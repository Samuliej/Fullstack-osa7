import {  useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Table } from 'react-bootstrap'


const User = () => {
  const { id } = useParams()
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  const user =  users.find(user => user.id === id)

  if (!user) {
    return <div>User not found</div>
  }

  const userBlogs = blogs.filter(blog => blog.user.id === user.id)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs:</h3>
      <Table striped>
        <tbody>
          {userBlogs.map(blog =>
            <tr key={blog.id}>
              <td>
                {blog.title}
              </td>
            </tr>)}
        </tbody>
      </Table>
    </div>
  )
}

export default User