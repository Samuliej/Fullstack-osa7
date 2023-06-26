import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { initializeBlogs, setBlogs, createBlog, like, removeBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
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
      dispatch(setUser(user))
    } catch (exception) {
      console.log(exception)
      dispatch(setError({ message: 'Wrong username or password', duration: 5 }))
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    try {
      window.localStorage.clear()
      dispatch(setUser(null))
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
    try {
      // Päivitetään lokaalisti, koska tykkäys tuli turhan hitaasti
      const updatedBlogs = blogs.map((b) =>
        b.id === blog.id ? { ...b, likes: b.likes + 1 } : b
      )
      dispatch(setBlogs(updatedBlogs))
      dispatch(like(blog))
      dispatch(setNotification( { message: `You liked the ${blog.title} blog`, duration: 5 } ))
    } catch (exception) {
      console.log(exception.message)
      dispatch(setError( { message: 'Something went wrong liking the blog', duration: 5 } ))
    }
  }

  const handleRemove = async (blog) => {
    try {
      dispatch(removeBlog(blog.id))
      dispatch(setNotification( { message: `Blog '${blog.title}' removed succesfully`, duration: 5 } ))
    } catch (exception) {
      console.log(exception)
      dispatch(setError( { message: `Something went wrong deleting the blog: ${blog.id}`, duration: 5 } ))
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
    dispatch(createBlog(blogObject))
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
