import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'
import { setError } from './reducers/errorReducer'
import { initialize } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { MDBFooter } from 'mdb-react-ui-kit'
import Home from './components/Home'

const App = () => {
  const dispatch = useDispatch()
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


  return (
    <Router>
      <div className='container'>
        {!user && (
          <div>
            <LoginForm handleLogin={handleLogin} />
          </div>
        )}

        {user && (
          <div>
            <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark' className='bg-body-tertiary'>
              <Container fluid>
                <Navbar.Brand href='/home'>Blog App</Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                  <Nav className='container-fluid'>
                    <Nav.Link href='#home' as='span'>
                      <Link className='navlink' to={'/home'}>Home</Link>
                    </Nav.Link>
                    <Nav.Link  href='#' as='span'>
                      <Link className='navlink' to={'/blogs'}>Blogs</Link>
                    </Nav.Link>
                    <Nav.Link href='#' as='span'>
                      <Link className='navlink' to={'/users'}>Users</Link>
                    </Nav.Link>
                  </Nav>
                  <Navbar.Text className='ml-auto'>
                      Signed in as: {user.name}
                  </Navbar.Text>
                  <Button variant='light' onClick={handleLogout}>
                      Logout
                  </Button>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <Notification />
            <Error />
            <Routes>
              <Route path='/home' element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<User />} />
              <Route path='/blogs/:id' element={<Blog />} />
              <Route path='/blogs' element={
                <div>
                  <Blogs />
                </div>
              }/>
              <Route path="/" element={
                <div>
                  {<Blogs />}
                </div>}
              />
            </Routes>
          </div>
        )}
        <MDBFooter bgColor='light' className='text-center text-lg-left'>
          <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: '50px' }}>
            &copy; {new Date().getFullYear()} Copyright:{' '}
            <a target='blank' className='text-dark' href='https://www.linkedin.com/in/samuli-toppi-803746269/'>
            Samuli Toppi
            </a>
          </div>
        </MDBFooter>
      </div>
    </Router>
  )
}

export default App
