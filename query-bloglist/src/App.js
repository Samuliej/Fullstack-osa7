import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useNotificationDispatch, useNotificationState } from './components/NotificationContext'
import LoginForm from './components/LoginForm'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  // const [notificationMessage, setNotificationMessage] = useState(null)
  const notification = useNotificationState()
  const notificationDispatch = useNotificationDispatch()
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      console.log(exception)
      notificationDispatch({
        type: 'SET_ERROR',
        payload: 'Wrong username or password'
      })
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    try {
      window.localStorage.clear()
      setUser(null)
    } catch (exception) {
      console.log(exception)
    }
  }


  const blogList = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return sortedBlogs.map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        handleLike={handleLike}
        handleRemove={handleRemove}
        user={user}
      />
    ))
  }

  const handleLike = async (blog) => {
    console.log('handleLikessa App.js')
    console.log(blog)
    try {
      // Päivitetään lokaalisti, koska tykkäys tuli turhan hitaasti
      const updatedBlogs = blogs.map((b) =>
        b.id === blog.id ? { ...b, likes: b.likes + 1 } : b
      )
      setBlogs(updatedBlogs)
      await blogService.like(blog)
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `You liked the blog '${blog.title}'`
      })
    } catch (exception) {
      console.log(exception.message)
    }
  }

  const handleRemove = async (blog) => {
    try {
      console.log('App.js remove funktiossa')
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `Blog '${blog.title}' removed succesfully`
      })
    } catch (exception) {
      console.log(exception.message)
      notificationDispatch({
        type: 'SET_ERROR',
        payload: 'Something went wrong removing the blog'
      })
    }
  }

  // Hoidettiin 5.5 yhteydessä
  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      })
    })
  }

  return (
    <div>
      {!user && (
        <div>
          <h1>log in to application</h1>
          {notification && notification.type === 'notification' && <Notification message={notification.message} />}
          {notification && notification.type === 'error' && <Error message={notification.message} />}
          <LoginForm handleLogin={handleLogin} />
        </div>
      )}
      {user && (
        <div>
          <h1>blogs</h1>
          {notification && notification.type === 'notification' && <Notification message={notification.message} />}
          {notification && notification.type === 'error' && <Error message={notification.message} />}
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>

          {blogForm()}
          {blogList()}
        </div>
      )}
    </div>
  )
}

export default App
