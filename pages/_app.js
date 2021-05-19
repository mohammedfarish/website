import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from "next/router";
import axios from 'axios';

import '../styles/globals.css'
import '../styles/fonts.css'

import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

import isDev from '../utils/middlewares/isDev'
import LoadingBar from '../components/loading bar/LoadingBar';

function MyApp({ Component, pageProps }) {

  const [globalState, setGlobalState] = useState({})
  const [loggedIn, setLoggedIn] = useState(null)
  const [loader, setLoader] = useState(0)
  const [loaderOpaccty, setLoaderOpaccty] = useState(1)

  const router = useRouter()

  useEffect(() => {

    if (isDev()) return;

    analytics()

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

  useEffect(() => {
    const uid = window.localStorage.getItem('uid')
    const sessionUID = window.sessionStorage.getItem('uid')
    if (!uid) return;
    if (!sessionUID) return;

    if (isDev()) return;

    const page = router.asPath

    const data = {
      uid: window.localStorage.getItem('uid'),
      data: {
        type: "browse",
        page
      }
    }

    if (page !== '/')
      setLoader(30)

    axios.post('/api/analytics', data)
      .then(() => {
        if (page !== '/')
          setLoader(100)
      })
      .catch(() => {
        if (page !== '/')
          setLoader(100)
      })
  }, [router.asPath])

  const analytics = () => {
    const sessionUID = window.sessionStorage.getItem('uid')
    if (sessionUID) return;

    const data = {
      uid: window.localStorage.getItem('uid') || null,
      userAgent: window.navigator.userAgent,
      data: {
        type: "visit",
        page: router.asPath
      }
    }

    return axios.post('/api/analytics', data)
      .then(response => {
        const { uid } = response.data
        window.sessionStorage.setItem('uid', '9655412898773276531324564')
        if (uid) {
          return window.localStorage.setItem('uid', uid)
        }
        return;
      })

  }

  useEffect(() => {

    if (loader < 99)
      return setTimeout(() => {
        setLoaderOpaccty(1)
      }, 500);

    setTimeout(() => {
      setLoaderOpaccty(0)
      setTimeout(() => {
        setLoader(0)
      }, 1000);
    }, 500);

  }, [loader])

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
      <LoadingBar loaderOpaccty={loaderOpaccty} loader={loader} />
      <Header setLoggedIn={setLoggedIn} current={router.pathname} />
      <div className="pages">
        <Component {...pageProps} loader={loader} setLoader={setLoader} globalState={globalState} setGlobalState={setGlobalState} />
      </div>
      <Footer />
    </div>
  )
}

export default MyApp
