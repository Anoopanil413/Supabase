import React, { createContext, useContext, useEffect, useState } from 'react'
import FunForm from '../components/FunForm';
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";


import supabase from '../supabase';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../features/userSlice';
import { Auth } from '@supabase/auth-ui-react';
import { GoogleOutlined } from '@ant-design/icons';




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

  useEffect(()=>{
    (async()=>{
      const session = await supabase.auth.getSession();
      console.log("seddddddddddddddd",session.data)

    })()
  })

  const handleClickk = async()=>{
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    sessionStorage.setItem('token',data)

    console.log(data)
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
    <div style={{display:'flex', justifyContent:'center',alignItems:'center',flexDirection:'column',height:'100%',}}>
    <div style={{textAlign:'center'}}><p style={{fontSize:'20px'}}>Login</p></div>
    <div className='LoginPage'>
      <FunForm handleSubmit= {handleSignupSubmit}/>
    </div>
    <button className="google-button" onClick={handleClickk}><GoogleOutlined />Signin / Signup with Google</button>


    <div><p>Create an account?  <span ><a href="/signup">signup</a></span></p></div>


    <div>

    </div>
      </div>
    </>

  )
}

export default Login
