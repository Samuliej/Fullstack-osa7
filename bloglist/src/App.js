import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { setError } from './reducers/errorReducer'
import { setNotification } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  // const [notificationMessage, setNotificationMessage] = useState(null)
  // const [errorMessage, setErrorMessage] = useState(null)
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
      dispatch(setError({ message: 'Wrong username or password', duration: 5 }))
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
      dispatch(setNotification( { message: `You liked the ${blog.title} blog`, duration: 5 } ))
    } catch (exception) {
      console.log(exception.message)
      dispatch(setError( { message: 'Something went wrong liking the blog', duration: 5 } ))
    }
  }

  const handleRemove = async (blog) => {
    try {
      console.log('App.js remove funktiossa')
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      dispatch(setNotification( { message: `Blog ${blog.title} by ${blog.author} removed successfully.`, duration: 5 } ))
    } catch (exception) {
      console.log(exception.message)
      dispatch(setError( { message: 'Something went wrong removing the blog', duration: 5 } ))
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
    })
  }

  return (
    <div>
      {!user && (
        <div>
          <h1>log in to application</h1>
          <Notification />
          <Error />
          <LoginForm handleLogin={handleLogin} />
        </div>
      )}

      {user && (
        <div>
          <h1>blogs</h1>
          <Notification />
          <Error />
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
