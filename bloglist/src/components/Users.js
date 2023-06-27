import { useSelector, useDispatch } from 'react-redux'
import { setUsers } from '../reducers/usersReducer'
import { useEffect } from 'react'
import userService from '../services/users'

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

  console.log('Users.js', users)

  return (
    <div>
      <h2>Users</h2>
      <div style={{ marginLeft: '210px' }}><strong>blogs created</strong></div>
      <div style={{ display: 'table' }}>
        {users.map(user => (
          <div key={user.id} style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', width: '200px' }}>{user.name}</div>
            <div style={{ display: 'table-cell', paddingLeft: '10px' }}>{user.blogs.length}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users