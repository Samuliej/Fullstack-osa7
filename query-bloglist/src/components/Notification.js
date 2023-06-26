const Notification = ({ message }) => {
  console.log(`Notification message: ${message}`)
  const style = {
    color: 'black',
    backgroundColor: 'lightgreen',
    fontSize: '20px',
    fontStyle: 'solid',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    textAlign: 'center'
  }

  const hide = { display: 'none' }

  if (!message && message !== '') {
    return <div style={hide}></div>
  } else {
    return <div style={style}>{message}</div>
  }
}

export default Notification
