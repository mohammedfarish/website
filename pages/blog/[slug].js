import axios from 'axios'
import Editor from "rich-markdown-editor";
import React, { Component } from 'react'
import Head from 'next/head'

import styles from '../../styles/blogpost.module.css'

import ErrorPage from '../404'

export default class BlogPost extends Component {
    constructor(props) {
        super(props)

        this.loadTheme = this.loadTheme.bind(this)
        this.fetchBlogData = this.fetchBlogData.bind(this)
        this.state = {
            existing: null,
            title: '',
            content: '',
            theme: '',
            date: ''
        }
    }

    componentDidMount() {
        this.fetchBlogData()
        this.loadTheme()
    }

    loadTheme() {
        const colors = {
            almostBlack: "#181A1B",
            lightBlack: "#2F3336",
            almostWhite: "#E6E6E6",
            white: "#FFF",
            white10: "rgba(255, 255, 255, 0.1)",
            black: "#000",
            black10: "rgba(0, 0, 0, 0.1)",
            primary: "#1AB6FF",
            greyLight: "#F4F7FA",
            grey: "#E8EBED",
            greyMid: "#C5CCD3",
            greyDark: "#DAE1E9",
        };

        const base = {
            ...colors,
            fontFamily:
                "'Roboto Mono', monospace",
            // "'Roboto', sans-serif",
            // "'Poppins', sans- serif",
            fontFamilyMono:
                "'Roboto Mono', monospace",
            // "'Roboto', sans-serif",
            // "'SFMono-Regular',Consolas,'Liberation Mono', Menlo, Courier,monospace",
            fontWeight: 400,
            zIndex: 100,
            link: colors.primary,
            placeholder: "#B1BECC",
            textSecondary: "#4E5C6E",
            textLight: colors.white,
            textHighlight: "#b3e7ff",
            textHighlightForeground: colors.black,
            selected: colors.primary,
            codeComment: "#6a737d",
            codePunctuation: "#5e6687",
            codeNumber: "#d73a49",
            codeProperty: "#c08b30",
            codeTag: "#3d8fd1",
            codeString: "#032f62",
            codeSelector: "#6679cc",
            codeAttr: "#c76b29",
            codeEntity: "#22a2c9",
            codeKeyword: "#d73a49",
            codeFunction: "#6f42c1",
            codeStatement: "#22a2c9",
            codePlaceholder: "#3d8fd1",
            codeInserted: "#202746",
            codeImportant: "#c94922",

            blockToolbarBackground: colors.white,
            blockToolbarTrigger: colors.greyMid,
            blockToolbarTriggerIcon: colors.white,
            blockToolbarItem: colors.almostBlack,
            blockToolbarIcon: undefined,
            blockToolbarIconSelected: colors.black,
            blockToolbarText: colors.almostBlack,
            blockToolbarTextSelected: colors.black,
            blockToolbarHoverBackground: colors.greyLight,
            blockToolbarDivider: colors.greyMid,

            noticeInfoBackground: "#F5BE31",
            noticeInfoText: colors.almostBlack,
            noticeTipBackground: "#9E5CF7",
            noticeTipText: colors.white,
            noticeWarningBackground: "#FF5C80",
            noticeWarningText: colors.white,
        };

        const light = {
            ...base,
            background: colors.white,
            text: colors.almostBlack,
            code: colors.lightBlack,
            cursor: colors.black,
            divider: colors.greyMid,

            toolbarBackground: colors.lightBlack,
            toolbarHoverBackground: colors.black,
            toolbarInput: colors.white10,
            toolbarItem: colors.white,

            tableDivider: colors.greyMid,
            tableSelected: colors.primary,
            tableSelectedBackground: "#E5F7FF",

            quote: colors.greyDark,
            codeBackground: colors.greyLight,
            codeBorder: colors.grey,
            horizontalRule: colors.greyMid,
            imageErrorBackground: colors.greyLight,

            scrollbarBackground: colors.greyLight,
            scrollbarThumb: colors.greyMid,
        };

        const dark = {
            ...base,
            background: colors.almostBlack,
            text: colors.almostWhite,
            code: colors.almostWhite,
            cursor: colors.white,
            divider: "#4E5C6E",
            placeholder: "#52657A",

            toolbarBackground: colors.white,
            toolbarHoverBackground: colors.greyMid,
            toolbarInput: colors.black10,
            toolbarItem: colors.lightBlack,

            tableDivider: colors.lightBlack,
            tableSelected: colors.primary,
            tableSelectedBackground: "#002333",

            quote: colors.greyDark,
            codeBackground: colors.black,
            codeBorder: colors.lightBlack,
            codeString: "#3d8fd1",
            horizontalRule: colors.lightBlack,
            imageErrorBackground: "rgba(0, 0, 0, 0.5)",

            scrollbarBackground: colors.black,
            scrollbarThumb: colors.lightBlack,
        };

        this.setState({
            theme: light
        })
    }

    fetchBlogData() {
        axios.get('/api/blog/post?q=' + this.props.slug)
            .then(response => {
                if (response.data) {
                    const { title, content, date } = response.data
                    this.setState({
                        existing: true,
                        content,
                        title,
                        date
                    })
                } else {
                    this.setState({
                        existing: false
                    })
                }
            })
            .catch(() => {
                this.setState({
                    existing: false
                })
            })
    }

    render() {

        if (this.state.existing === false) {
            return <ErrorPage />
        } else if (this.state.existing === true) {
            return (
                <div className={styles.blogPostPage}>
                    <Head>
                        <title>{this.state.title} - Blog | Mohammed Farish</title>
                        <meta name="description" content={this.state.content} />
                        <meta property="og:title" content={this.state.title + " - Blog | Mohammed Farish"} />
                        <meta property="og:description" content={this.state.content} />
                        <meta property="og:image" content="https://www.mohammedfarish.com/assets/seoimage.jpg" />
                        <meta property="twitter:title" content={this.state.title + " - Blog | Mohammed Farish"} />
                        <meta property="twitter:description" content={this.state.content} />
                        <meta property="twitter:image" content="https://www.mohammedfarish.com/assets/seoimage.jpg" />
                    </Head>
                    <div className={styles.blogPostTitle}>
                        <span>{this.state.title}</span>
                    </div>
                    <div className={styles.blogPostDate}>
                        <span>{this.state.date}</span>
                    </div>
                    <div className={styles.blogContent}>
                        <Editor
                            className={styles.blogPostEditor}
                            defaultValue={this.state.content}
                            readOnly
                            readOnlyWriteCheckboxes
                            theme={this.state.theme}
                        />
                    </div>
                </div>
            )
        } else {
            return (
                <div className={styles.blogloadingpage} >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 0c3.667.305 6.863 2.26 8.851 5.129l-1.746 1.013c-1.634-2.273-4.182-3.84-7.105-4.133v-2.009zm-11 12c0-1.47.324-2.863.891-4.122l-1.737-1.007c-.733 1.558-1.154 3.292-1.154 5.129 0 1.837.421 3.571 1.153 5.129l1.738-1.008c-.567-1.259-.891-2.651-.891-4.121zm20 0c0 1.47-.324 2.863-.891 4.122l1.738 1.007c.732-1.558 1.153-3.292 1.153-5.129s-.421-3.571-1.153-5.129l-1.738 1.007c.567 1.259.891 2.652.891 4.122zm-1.895 5.858c-1.634 2.273-4.182 3.84-7.105 4.133v2.009c3.667-.305 6.863-2.26 8.851-5.129l-1.746-1.013zm-16.21-11.717c1.634-2.272 4.183-3.839 7.105-4.132v-2.009c-3.667.305-6.862 2.259-8.851 5.128l1.746 1.013zm7.105 15.85c-2.923-.293-5.471-1.86-7.105-4.133l-1.746 1.013c1.988 2.87 5.184 4.824 8.851 5.129v-2.009z" /></svg>
                    <span>fetching article content</span>
                </div>
            )
        }
    }
}

BlogPost.getInitialProps = (context) => {
    return { slug: context.query.slug }
}