import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearError } from '../reducers/errorReducer'
import { Alert } from 'react-bootstrap'

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
    return (
      <Alert variant='danger'>
        {error.message}
      </Alert>
    )
  }
}

export default Error
