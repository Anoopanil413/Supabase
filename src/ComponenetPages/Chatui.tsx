import React, { useCallback, useEffect, useState } from 'react'
import ChatComp from '../components/Chat'
import useMessageSubscription from '../utils/messagesHook';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Input, Layout, Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { addMessageToChannel } from '../features/userSlice';

const Chatui = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
const {currentChannel,profile,channelMessagesOnSubscription} = useSelector((state:any)=>state.users) ;
    if(!currentChannel){
        navigate('/')
    }

    const [message,setMessage] = useState('')






    const messageReceived = useCallback((payload: any) => {
      console.log("payload",payload)
        dispatch(addMessageToChannel(payload.payload.message))

      }, []);

      const channelData = {
        user:profile,
        currentChannel
      }
    const {sendMessage} = useMessageSubscription(channelData, messageReceived);

      
      const handleSendMessage = () => {
        const messages= {
          channelName:currentChannel,
          message:message,
          user:profile,
          date: Date.now()
        }
        if(message && message.trim() !== '')sendMessage(messages);
        setMessage('')
      };

      



    

  return (
    <>

    <ChatComp/>
    <Layout style={{  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Content style={{ maxWidth: '600px', paddingBottom: '20px', width: '100%' }}>


      <Flex>

      <Space.Compact style={{ width: '100%' }}>
      <Input placeholder='Enter message' onChange={(e)=>setMessage(e.target.value)} value={message} />
      <Button onClick={handleSendMessage} type="primary">Send</Button>
      </Space.Compact>
      </Flex>

      </Content>

      </Layout>


    
    
    </>

  )
}

export default Chatui
