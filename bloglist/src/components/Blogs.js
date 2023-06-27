import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return sortedBlogs.map((blog) => (
    <Link key={blog.id} to={`/blogs/${blog.id}`}>
      <div style={blogStyle}>{blog.title}  {blog.author}</div>
    </Link>
  ))
}

export default BlogList