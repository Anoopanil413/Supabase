import React, { createContext, useContext, useEffect, useState } from 'react'
import FunForm from '../components/FunForm'

import supabase from '../supabase';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);


const Login = () => {
  // const register = (email, password) =>
  //   supabase.auth.signUp({ email, password });


  const handleSignupSubmit = async(data:any)=>{

    console.log("chekingt he data from form",data)

  }
  return (
    <>
    <div className='LoginPage'>
      <FunForm handleSubmit= {handleSignupSubmit}/>
    </div>
    </>

  )
}

export default Login
