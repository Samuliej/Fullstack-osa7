import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, action) {
      console.log(`setError action ${action}, message ${action.message}`)
      return {
        message: action.payload.message,
        duration: action.payload.duration
      }
    },
    clearError() {
      return null
    }
  }
})

export const { setError, clearError } = errorSlice.actions
export default errorSlice.reducer