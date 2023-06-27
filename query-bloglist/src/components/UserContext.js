import { createContext, useReducer, useContext, useEffect } from 'react'
import { setBlogToken } from '../queries'

const userReducer = (state, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.payload
  case 'CLEAR_USER':
    return null
  default:
    return state
  }
}

const UserContext = createContext()

export const useUserState = () => {
  const userAndDispatch = useContext(UserContext)
  console.log(userAndDispatch)
  return userAndDispatch[0]
}

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[1]
}

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'SET_USER',
        payload: user,
      })
      setBlogToken(user.token)
    }
  }, [])

  return (
    <UserContext.Provider value={[ user, userDispatch ]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext