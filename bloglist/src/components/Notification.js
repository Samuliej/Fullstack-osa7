import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../reducers/notificationReducer'

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
    return <div className="notif">{notification.message}</div>
  }
}

export default Notification
