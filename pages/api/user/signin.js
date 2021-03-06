/* eslint-disable no-underscore-dangle */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dbConnect from "../../../utils/database/dbConnect";

import sessionSchema from "../../../utils/database/schema/sessionSchema";
import userSchema from "../../../utils/database/schema/userSchema";

import getIP from "../../../utils/middlewares/getIP";
import rateLimiter from "../../../utils/middlewares/rateLimiter";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":

      const inRateLimit = await rateLimiter(req, 10);
      if (!inRateLimit) return res.json({ success: false, reason: "Too many requests. Try again later." });

      try {
        let { usernameOrEmail } = req.body;
        const { password, uid } = req.body;
        if (!usernameOrEmail || !password) return res.json({ success: false, reason: "Username or Password not provided." });

        usernameOrEmail = usernameOrEmail.toLowerCase();

        const existingEmail = await userSchema.findOne({ email: usernameOrEmail });
        const existingUsername = await userSchema.findOne({ username: usernameOrEmail });

        if (!existingUsername && !existingEmail) return res.json({ success: false, reason: "Incorrect username/email or password." });

        let existingData;
        if (existingEmail) existingData = existingEmail;
        if (existingUsername) existingData = existingUsername;

        if (!existingData.active) {
          if (!existingData.verified) return res.json({ success: false, reason: "Account is not verified. Please contact admin." });
          return res.json({ success: false, reason: "Account is inactive. Please contact admin." });
        }

        const passwordData = existingData.password;

        const correctPassword = await bcrypt.compare(password, passwordData);
        if (!correctPassword) return res.json({ success: false, reason: "Incorrect username/email or password." });

        const ip = await getIP(req);
        if (!ip) return res.json({ success: false, reason: "Internal Server Error." });

        const activeSessions = await sessionSchema.find({ userId: existingData._id, active: true });
        if (activeSessions.length > 0) {
          activeSessions.forEach(async (session) => {
            const { _id } = session;
            await sessionSchema.findByIdAndUpdate(_id, {
              active: false,
            });
          });
        }

        const session = await sessionSchema.create({
          userId: existingData._id,
          deviceIP: ip,
          active: true,
          deviceId: uid,
        });

        await userSchema.findByIdAndUpdate(existingData._id, {
          $addToSet: {
            sessions: session._id,
          },
        });

        const tokenPayload = {
          sessionId: session._id,
        };

        const token = await jwt.sign(tokenPayload, process.env.JWT_SECRET);

        res.json({ success: true, token });
      } catch (error) {
        res.status(503).json("Internal Server Error.");
      }

      break;

    default:
      res.status(404).json(false);
      break;
  }

  return true;
};
