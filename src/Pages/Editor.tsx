import React, { useState } from 'react'
import TextEditor from '../components/Quill'

const Editor = () => {
    const [value,setValue] = useState('')

    const handleSend =()=>{

    }


  return (
    <>
    <TextEditor   value = {value}
  setValue = {setValue}
  handleSend = {handleSend}
  defaultValue = "helooo"/>

    </>

  )
}

export default Editor
