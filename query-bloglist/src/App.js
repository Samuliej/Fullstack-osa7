import {  useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getBlogs, createBlog, setBlogToken, likeBlog, removeBlog } from './queries'
import Blog from './components/Blog'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useNotificationDispatch, useNotificationState } from './components/NotificationContext'
import LoginForm from './components/LoginForm'
import { useUserDispatch, useUserState } from './components/UserContext'
import './index.css'

const App = () => {
  const blogFormRef = useRef()
  const notification = useNotificationState()
  const notificationDispatch = useNotificationDispatch()
  const user = useUserState()
  const userDispatch = useUserDispatch()
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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setBlogToken(user.token)
      userDispatch({
        type: 'SET_USER',
        payload: user
      })
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
      userDispatch({
        type: 'CLEAR_USER'
      })
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
    blogFormRef.current.toggleVisibility()
    removeBlogMutation.mutate(blog)
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
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
