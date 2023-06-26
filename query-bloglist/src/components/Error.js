const Error = ({ message }) => {
  console.log(`Error message: ${message}`)
  const style = {
    color: 'black',
    backgroundColor: 'red',
    fontSize: '20px',
    fontStyle: 'solid',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    textAlign: 'center'
  }

  const hide = { display: 'none' }

  if (!message) {
    return <div style={hide}></div>
  } else {
    return <div style={style}>{message}</div>
  }
}

export default Error
