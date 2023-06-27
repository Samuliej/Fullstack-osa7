import { useParams } from 'react-router-dom'
import {  useDispatch, useSelector } from 'react-redux'
import { setBlogs, like, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { setError } from '../reducers/errorReducer'

const Blog = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  let blogUser = null

  const currentBlog = blogs.find(b => b.id === id)
  if (currentBlog) {
    blogUser = currentBlog.user
  }


  if (!currentBlog) {
    return <div>Blog not found or deleted</div>
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

  const onClickLike = () => {
    handleLike(currentBlog)
  }


  const onClickRemove = () => {
    if (window.confirm(`Remove blog: ${currentBlog.title}?`)) handleRemove(currentBlog)
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

  return (
    <div>
      <h2>{currentBlog.title} by {currentBlog.author}</h2>
      <div><a href='#'>{currentBlog.url}</a></div>
      <div>{currentBlog.likes} likes <button onClick={onClickLike}>like</button></div>
      <div>added by {currentBlog.user.name}</div>
      <div>
        {user && blogUser && user.name === blogUser.name && (
          <button onClick={onClickRemove}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
