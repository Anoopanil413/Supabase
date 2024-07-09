import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { fetchProfile, setModalView } from '../features/userSlice'
import UserProfileModal from './UserProfile'
import CreateChannel from '../ComponenetPages/CreateChannel'



const Home = () => {


  const users = useSelector((state:any)=>state.users)
  const dispatch = useDispatch();

  


  useEffect(()=>{
    if(!users.profile && !users.viewModal){
      dispatch(setModalView(true))
    }else if(users.user){
      dispatch(setModalView(false))

    }
  },[users?.user])
  



  return (
    <>
      {users.viewModal && <UserProfileModal/>}
      <CreateChannel/>


    </>


  )
}

export default Home
