import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearError } from '../reducers/errorReducer'

const Error = () => {
  const dispatch = useDispatch()
  const error = useSelector(state => state.error)

  useEffect(() => {
    if (error && error.duration) {
      const timeout = setTimeout(() => {
        dispatch(clearError())
      }, error.duration * 1000)

      return () => clearTimeout(timeout)
    }
  }, [dispatch, error])

  if (!error) {
    return <div className="empty"></div>
  } else if (error && error.message) {
    return <div className="error">{error.message}</div>
  }
}

export default Error
