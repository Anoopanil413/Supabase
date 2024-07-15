import React from 'react'
import Chatui from '../ComponenetPages/Chatui'
import UserProfileModal from './UserProfile'
import { useSelector } from 'react-redux'

const Chat = () => {
  const users = useSelector((state:any)=>state.users)

  return (

    <>
    {users.viewModal && <UserProfileModal/>}
    <Chatui/>
    </>

  )
}

export default Chat
