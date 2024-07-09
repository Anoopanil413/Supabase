import React, { useCallback, useEffect, useState } from 'react'
import ChatComp from '../components/Chat'
import useMessageSubscription from '../utils/messagesHook';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Chatui = () => {

    const navigate = useNavigate()
const {currentChannel} = useSelector((state:any)=>state.users) ;
    if(!currentChannel){
        navigate('/')
    }



    const messageReceived = useCallback((payload: any) => {
        console.log("Message received:", payload);
      }, []);
    const sendMessage = useMessageSubscription(currentChannel, messageReceived);

      
      const handleSendMessage = () => {
        sendMessage("hello, world");
        console.log("msg send")
      };

      useEffect(()=>{

      },[])
    

  return (
    <>

    <ChatComp/>

    <button onClick={handleSendMessage}>
        send
    </button>
    
    
    </>

  )
}

export default Chatui
