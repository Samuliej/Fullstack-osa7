import { useState } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { setError } from '../reducers/errorReducer'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [newBlogUser, setNewBlogUser] = useState(null)

  const dispatch = useDispatch()

  const addBlog = (event) => {

    event.preventDefault()

    if (!newBlogTitle || !newBlogAuthor) {
      console.log('tyhjää täynnä')
      dispatch(setError({ message: 'Title or Author field empty', duration: 5 }))
    } else {

      event.preventDefault()
      createBlog({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
        user: newBlogUser,
      })

      dispatch(setNotification( { message: `Blog '${newBlogTitle} added`, duration: 5 } ))
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      setNewBlogUser(null)
    }
  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={addBlog}>
        title:
        <input
          id="title"
          placeholder="insert title here"
          value={newBlogTitle}
          onChange={(event) => setNewBlogTitle(event.target.value)}
        />{' '}
        <br></br>
        author:
        <input
          id="author"
          placeholder="insert author here"
          value={newBlogAuthor}
          onChange={(event) => setNewBlogAuthor(event.target.value)}
        />{' '}
        <br></br>
        url:
        <input
          id="url"
          placeholder="insert url here"
          value={newBlogUrl}
          onChange={(event) => setNewBlogUrl(event.target.value)}
        />{' '}
        <br></br>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm