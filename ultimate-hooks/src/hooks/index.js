import axios from 'axios'
import { useState, useEffect } from 'react'

export const useResource = (baseUrl) => {
  const [objects, setObjects] = useState([])
  let token = null

  const setToken = newToken => {
    token = `Bearer ${newToken}`
  }

  const getAll = async () =>  {
    try {
      const response = await axios.get(baseUrl)
      setObjects(response.data)
    } catch (error) {
      console.log('Error getting objects: ', error)
    }
  }

  const create = async newObject => {
    const config = {
      headers: { Authorization: token }
    }

    const response = await axios.post(baseUrl, newObject, config)
    setObjects([...objects, response.data])
  }

  const update = async (id, newObject) => {
    try {
      const response = await axios.put(`${baseUrl}/id`, newObject)
      setObjects(objects.map((obj =>
        obj.id === id
          ? response.data
          : obj
      )))
    } catch (error) {
      console.log(`Error updating ojbect: ${id}, error: ${error}`)
    }
  }


  useEffect(() => {
    getAll()
  }, [])

  return ([
    objects,
    { create, update, setToken }
  ])
}