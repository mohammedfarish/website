import React, { Component } from 'react'
import Link from 'next/link'
import axios from 'axios'

import styles from '../../styles/blog.module.css'

import verifyUser from '../../utils/functions/verify'

export default class BlogPosts extends Component {
    constructor(props) {
        super(props)

        this.verifyLoggedIn = this.verifyLoggedIn.bind(this)
        this.fetchPosts = this.fetchPosts.bind(this)
        this.state = {
            posts: [],
            hideNewArticleButton: true
        }
    }

    componentDidMount() {
        this.verifyLoggedIn()
    }

    async verifyLoggedIn() {
        const user = window.localStorage.getItem('user');
        if (user) {
            const verify = await verifyUser()
            if (!verify) {
                this.setState({
                    hideNewArticleButton: true
                })
                this.fetchPosts()
                window.localStorage.removeItem('user');
                return window.location.reload()
            } else {
                this.setState({
                    hideNewArticleButton: false
                })
                return this.fetchPosts(true)
            }
        } else {
            return this.fetchPosts()
        }
    }

    fetchPosts(login) {
        let token = null
        if (login) token = window.localStorage.getItem('user')

        axios.get('/api/blog/list', {
            headers: {
                "x-auth-token": token
            }
        })
            .then(response => {
                if (response.data) {
                    this.setState({
                        posts: response.data
                    })
                }
            })
    }

    render() {
        return (
            <div>
                <div className={styles.blogpageHeader}>
                    <span>Blog Articles.</span>
                    <Link href="/blog/new">
                        <button hidden={this.state.hideNewArticleButton} className={styles.blogpageHeaderButton}>New Article</button>
                    </Link>
                </div>
                <div>
                    {this.state.posts.map(item => {
                        return (
                            <Link
                                key={item.key} href={'/blog/' + item.slug}>
                                <a>
                                    <div className={styles.blogItem}>
                                        <div className={styles.blogItemSection}>
                                            <span className={styles.blogItemDate}>{item.date}</span>
                                            <span className={styles.blogItemTitle}>{item.title}</span>
                                        </div>
                                        <div hidden={item.status.length === 0 ? true : false} className={styles.blogItemStatus} >
                                            <span>{item.status}</span>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }

}
