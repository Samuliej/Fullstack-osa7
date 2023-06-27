import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

export const setBlogToken = (newToken) => {
  token = `Bearer ${newToken}`
}

export const getBlogs = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

export const likeBlog = async (likedBlog) => {
  const updatePath = `${baseUrl}/${likedBlog.id}`
  try {
    const response = await axios.put(updatePath, likedBlog)
    return response.data
  } catch (exception) {
    console.log(exception.message)
  }
}

export const removeBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const deletePath = `${baseUrl}/${blog.id}`
  const response = await axios.delete(deletePath, config)
  console.log('mikä siellä lymyää: ', response.data)
  return response.data
}

export const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
