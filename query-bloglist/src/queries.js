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

export const like = async (blog) => {
  const updatePath = `${baseUrl}/${blog.id}`
  const likedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1,
    user: blog.user.id,
  }
  try {
    const response = await axios.put(updatePath, likedBlog)
    return response.data
  } catch (exception) {
    console.log(exception.message)
  }
}

export const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }

  const deletePath = `${baseUrl}/${blogId}`
  try {
    console.log('blogs.js remove funktiossa')
    const response = await axios.delete(deletePath, config)
    return response.data
  } catch (exception) {
    console.log(exception.message)
  }
}

export const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
