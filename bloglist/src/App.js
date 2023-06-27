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
import Users from './components/Users'
import User from './components/User'
import { setError } from './reducers/errorReducer'
import { initializeBlogs,  createBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

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
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5,
    }

    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return sortedBlogs.map((blog) => (
      <Link key={blog.id} to={`/blogs/${blog.id}`}>
        <div style={blogStyle}>{blog.title}  {blog.author}</div>
      </Link>
    ))
  }

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
    <Router>
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
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<User />} />
              <Route path='/blogs/:id' element={<Blog />} />
              <Route path="/" element={
                <div>
                  {blogForm()}
                  {blogList()}
                </div>}
              />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
