import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../reducers/notificationReducer'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)

  useEffect(() => {
    if (notification && notification.duration) {
      const timeout = setTimeout(() => {
        dispatch(clearNotification())
      }, notification.duration * 1000)

      return () => clearTimeout(timeout)
    }
  }, [dispatch, notification])

  if (!notification) {
    return <div className="empty"></div>
  } else if (notification && notification.message) {
    return (
      <Alert variant='success'>
        {notification.message}
      </Alert>
    )
  }
}

export default Notification
