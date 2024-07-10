import React, { createContext, useContext, useEffect, useState } from 'react'
import FunForm from '../components/FunForm';
import { useNavigate } from "react-router-dom";


import supabase from '../supabase';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../features/userSlice';




const Login = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const signinFun = async(email:string, password:string)=>{
    const {data,error}  = await supabase.auth.signInWithPassword({
      email:email,
      password:password
    })

    if(data){
      return data
    }else{
      return error
    }
  }




  const handleSignupSubmit = async(datas:any)=>{
    try {
      const {useremail,password} = datas

      const data = await signinFun(useremail,password)
      if(data?.session && data?.user){
        sessionStorage.setItem("token",JSON.stringify(data) );
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;

        if(userId){
         await dispatch(fetchProfile(userId))

        }
        navigate("/");
      }else {
        navigate("/signup");

      }
    } catch (error) {
      console.log(error)
    }




  }
  return (
    <>
    <div style={{display:'flex', justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
    <div>Login</div>
    <div className='LoginPage'>
      <FunForm handleSubmit= {handleSignupSubmit}/>
    </div>
      </div>
    </>

  )
}

export default Login
