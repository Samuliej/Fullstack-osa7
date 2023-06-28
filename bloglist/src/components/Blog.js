import { useParams } from 'react-router-dom'
import {  useDispatch, useSelector } from 'react-redux'
import { setBlogs, like, remove, comment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { setError } from '../reducers/errorReducer'
import { useState } from 'react'

const Blog = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [commentString, setCommentString] = useState('')
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

  const onClickAddComment = () => {
    handleComment()
  }

  const handleComment = async () => {
    try {
      dispatch(comment(currentBlog, commentString))
      dispatch(setNotification( { message: 'Comment added', duration: 5 } ))
      setCommentString('')
    } catch (exception) {
      console.log(exception)
      dispatch(setError( { message: 'Something went wrong commenting the blog', duration: 5 } ))
    }
  }


  const onClickRemove = () => {
    if (window.confirm(`Remove blog: ${currentBlog.title}?`)) handleRemove(currentBlog)
  }


  const handleRemove = async (blog) => {
    try {
      dispatch(remove(blog.id))
      dispatch(setNotification( { message: `Blog '${blog.title}' removed succesfully`, duration: 5 } ))
    } catch (exception) {
      console.log(exception)
      dispatch(setError( { message: `Something went wrong deleting the blog: ${blog.id}`, duration: 5 } ))
    }
  }


  return (
    <div>
      <h2>{currentBlog.title} by {currentBlog.author}</h2>
      <div><a href={currentBlog.url}>{currentBlog.url}</a></div>
      <div>{currentBlog.likes} likes <button onClick={onClickLike}>like</button></div>
      <div>added by {currentBlog.user.name}</div>
      <div>
        {user && blogUser && user.name === blogUser.name && (
          <button onClick={onClickRemove}>remove</button>
        )}
      </div>
      <br />
      <h3>comments</h3>
      <div>
        <input value={commentString} onChange={ (event) => setCommentString(event.target.value) } id="comment" /><button onClick={onClickAddComment}>add comment</button>
      </div>
      <ul>
        {currentBlog.comments.map(comment => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
