import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    likeBlog(state, action) {
      const { id, likes } = action.payload
      const blogToUpdate = state.find(blog => blog.id === id)
      if (blogToUpdate) {
        blogToUpdate.likes = likes
      }
    },
    removeBlog(state, action) {
      const { id } = action.payload
      const index = state.findIndex(blog => blog.id === id)
      // reminder to self, can use this because reduxjs toolkit handles immutability
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    commentBlog(state, action) {
      const { id, comments } = action.payload
      const blogToUpdate = state.find(blog => blog.id === id)
      if (blogToUpdate) {
        blogToUpdate.comments = comments
      }
    }
  }
})

export const { appendBlog, setBlogs, likeBlog, removeBlog, commentBlog } = blogSlice.actions

export const initialize = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const create = ({ title, author, url }) => {
  const blog = {
    title: title,
    author: author,
    url: url
  }
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch(appendBlog(newBlog))
  }
}

export const remove = (blogId) => {
  return async dispatch => {
    try {
      await blogService.remove(blogId)
      dispatch(removeBlog( { id: blogId } ))
    } catch (exception) {
      console.log(exception)
    }
  }
}

export const like = blog => {
  return async dispatch => {
    const updatedBlog = await blogService.like(blog)
    dispatch(likeBlog(updatedBlog))
  }
}

export const comment = (blog, comment) => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.comment(blog, comment)
      dispatch(commentBlog(updatedBlog))
    } catch (exception) {
      console.log(exception)
    }
  }
}

export default blogSlice.reducer