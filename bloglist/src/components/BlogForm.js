import { useState } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { setError } from '../reducers/errorReducer'
import { create } from '../reducers/blogReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const dispatch = useDispatch()

  const addBlog = (event) => {

    event.preventDefault()

    if (!newBlogTitle || !newBlogAuthor) {
      dispatch(setError({ message: 'Title or Author field empty', duration: 5 }))
    } else {
      dispatch(create({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      }))

      dispatch(setNotification( { message: `Blog '${newBlogTitle}' added`, duration: 5 } ))
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
    }
  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <Form onSubmit={addBlog}>
        <Form.Label>title:</Form.Label>
        <Form.Control
          id='title'
          placeholder='insert title here'
          value={newBlogTitle}
          onChange={(event) => setNewBlogTitle(event.target.value)}
        />
        <Form.Label>author:</Form.Label>
        <Form.Control
          id='author'
          placeholder='insert author here'
          value={newBlogAuthor}
          onChange={(event) => setNewBlogAuthor(event.target.value)}
        />
        <Form.Label>url:</Form.Label>
        <Form.Control
          id='url'
          placeholder='insert url here'
          value={newBlogUrl}
          onChange={(event) => setNewBlogUrl(event.target.value)}
        />
        <Button id='create-button' type='submit' variant='primary'>
          create
        </Button>
      </Form>
    </div>
  )
}

export default BlogForm
