import { createContext, useReducer, useEffect, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      type: 'notification',
      message: action.payload
    }
  case 'SET_ERROR':
    return {
      type: 'error',
      message: action.payload
    }
  case 'CLEAR_NOTIFICATION':
    return null
  default:
    return state
  }
}

const NotificationContext = createContext()

export const useNotificationState = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [notification])

  return (
    <NotificationContext.Provider value={[ notification, notificationDispatch ]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext