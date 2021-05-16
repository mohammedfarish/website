import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from "next/router";

import '../styles/globals.css'
import '../styles/fonts.css'

import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

import isDev from '../utils/middlewares/isDev'

function MyApp({ Component, pageProps }) {

  const [globalState, setGlobalState] = useState({})
  const [loggedIn, setLoggedIn] = useState(null)

  const router = useRouter()

  useEffect(() => {

    if (isDev()) return;

    if (document.addEventListener) {
      document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      }, false);
      document.addEventListener('copy', (e) => {
        e.preventDefault();
      });
    } else {
      document.attachEvent('oncontextmenu', function () {
        window.event.returnValue = false;
      });
      document.attachEvent('copy', function () {
        window.event.returnValue = false;
      });
    }
  }, [])

  useEffect(() => {
    if (loggedIn === null) return;
    setLoggedIn(null)
    router.reload()
  }, [loggedIn])

  return (
    <div>
      <Head>
        <title>Mohammed Farish</title>
        <link rel="icon" href="https://mohammedfarish.com/favicon.ico" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Originally from Kerala, India, Farish is now an innovative fullstack developer working on futuristic projects. Starting with Smart Technology, Farish works on projects involving the internet of things." />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mohammedfarish.com/" />
        <meta property="og:title" content="Mohammed Farish" />
        <meta property="og:description" content="Originally from Kerala, India, Farish is now an innovative fullstack developer working on futuristic projects. Starting with Smart Technology, Farish works on projects involving the internet of things." />
        <meta property="og:image" content="https://www.mohammedfarish.com/assets/seoimage.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.mohammedfarish.com/" />
        <meta property="twitter:title" content="Mohammed Farish" />
        <meta property="twitter:description" content="Originally from Kerala, India, Farish is now an innovative fullstack developer working on futuristic projects. Starting with Smart Technology, Farish works on projects involving the internet of things." />
        <meta property="twitter:image" content="https://www.mohammedfarish.com/assets/seoimage.jpg" />
      </Head>
      <Header setLoggedIn={setLoggedIn} current={router.pathname} />
      <div className="pages">
        <Component {...pageProps} globalState={globalState} setGlobalState={setGlobalState} />
      </div>
      <Footer />
    </div>
  )
}

export default MyApp
