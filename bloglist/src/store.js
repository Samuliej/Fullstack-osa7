import { combineReducers, configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import errorReducer from './reducers/errorReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'

const rootReducer = combineReducers({
  notification: notificationReducer,
  error: errorReducer,
  blogs: blogReducer,
  user: userReducer,
  users: usersReducer
})

const store = configureStore({
  reducer: rootReducer
})

export default store