import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
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
import { initialize,  create } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initialize())
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


  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(create(blogObject))
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
            <div style={{ backgroundColor: 'lightGreen' }}>
              <div style={{ display: 'inline-block' }}><Link to={'/blogs'}>blogs</Link></div>
              <div style={{ display: 'inline-block', marginLeft: '10px' }}><Link to={'/users'}>users</Link></div>
              <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                <em>{user.name} logged in</em>
                <button style={{ marginLeft: '10px' }} onClick={handleLogout}>logout</button>
              </div>
            </div>
            <h1>blogs</h1>
            <Notification />
            <Error />
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<User />} />
              <Route path='/blogs/:id' element={<Blog />} />
              <Route path='/blogs' element={
                <div>
                  {blogForm()}
                  <Blogs />
                </div>
              }/>
              <Route path="/" element={
                <div>
                  {blogForm()}
                  {<Blogs />}
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
