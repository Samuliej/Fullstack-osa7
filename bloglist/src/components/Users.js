import { useSelector, useDispatch } from 'react-redux'
import { setUsers } from '../reducers/usersReducer'
import { useEffect } from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Users = () => {
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getAll()
      dispatch(setUsers(users))
    }

    fetchUsers()
  }, [dispatch])

  return (
    <div>
      <h2>Users</h2>
      <div style={{ textAlign: 'right', marginRight: '60px' }}><strong>Blogs created</strong></div>
      <Table striped>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td>
                <Link
                  to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </td>
              <td>
                {user.blogs.length}
              </td>
            </tr>)}
        </tbody>
      </Table>
    </div>
  )
}

export default Users