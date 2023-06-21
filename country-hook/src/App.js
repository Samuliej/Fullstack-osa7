import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        if (name) {
          const response = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
          const jsonData = await response.json()
          console.log('maan tiedot', jsonData)
          const countryFormatted = {
            found: true,
            data: {
              name: jsonData.name.common,
              capital: jsonData.capital[0],
              population: jsonData.population,
              flag: jsonData.flags.png
            }
          }
          console.log(countryFormatted)
          setCountry(countryFormatted)
        }

      } catch (error) {
        console.log('Error getting country: ', error)
        setCountry({
          found: false,
          data: null
        })
      }
    }

    fetchCountry()
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App