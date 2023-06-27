import { useState, /*useEffect,*/ useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getBlogs, createBlog, setBlogToken, likeBlog, removeBlog } from './queries'

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
  const notification = useNotificationState()
  const notificationDispatch = useNotificationDispatch()
  const [user, setUser] = useState(null)
  const queryClient = useQueryClient()

  const createBlogMutation = useMutation(createBlog, {
    onSuccess: (returnedBlog) => {
      queryClient.setQueryData('blogs', (oldBlogs) => [...oldBlogs, returnedBlog])
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      })
    }
  })

  const likeBlogMutation = useMutation(likeBlog, {
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries('blogs')
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `You liked the blog '${updatedBlog.title}'`
      })
    }

  })

  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: 'Blog removed succesfully'
      })
    }
  })

  const result = useQuery(
    'blogs', getBlogs,
    {
      refetchOnWindowFocus: false,
      retry: 1
    }
  )

  const blogs = result.data

  if (result.isLoading) {
    return <div>Blog service unavailable</div>
  }

  // Tämä useEffect jostain syystä rikkoo apin totaalisesti,
  // joten jätän sen tässä vielä kokonaan käyttämättä.
  // ja asetan tokenin uutta blogia luodessa
  /*useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])*/

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

  const handleLike = (blog) => {
    likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  const handleRemove = (blog) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setBlogToken(user.token)
    }
    blogFormRef.current.toggleVisibility()
    removeBlogMutation.mutate(blog)
  }

  // Hoidettiin 5.5 yhteydessä
  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setBlogToken(user.token)
    }
    blogFormRef.current.toggleVisibility()
    createBlogMutation.mutate(blogObject)
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
