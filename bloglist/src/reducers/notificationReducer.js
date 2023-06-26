import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      console.log(`setNotification action ${action}, message ${action.message}`)
      return {
        message: action.payload.message,
        duration: action.payload.duration
      }
    },
    clearNotification() {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer