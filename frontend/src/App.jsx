import { useState } from 'react'
import ChatWidget from './components/ChatWidget'
import UploadFileComponent from './components/UploadFileComponent/UploadFileComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UploadFileComponent />
      <ChatWidget />
    </>
  )
}

export default App
