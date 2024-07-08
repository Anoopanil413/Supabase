import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { fetchProfile, setModalView } from '../features/userSlice'
import UserProfileModal from './UserProfile'
import supabase from '../supabase'



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
    <div>
      {users.viewModal && <UserProfileModal/>}
    </div>
  )
}

export default Home
