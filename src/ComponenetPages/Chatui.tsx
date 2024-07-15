import React, { useCallback, useEffect, useState } from 'react'
import ChatComp from '../components/Chat'
import useMessageSubscription from '../utils/messagesHook';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, Flex, Input, Layout, Menu, Space, Upload } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { addMessageToChannel, removeChannelDataonExit, unsubscribeFromChannels, unsubscribeFromMessages } from '../features/userSlice';
import { MenuFoldOutlined, PaperClipOutlined } from '@ant-design/icons';
import ChatInput from '../components/chatInput';

const Chatui = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
const {currentChannel,profile,channelMessagesOnSubscription,currentChannelname} = useSelector((state:any)=>state.users) ;
    if(!currentChannel){
        navigate('/')
    }


    const [open, setOpen] = useState(false);







    const messageReceived = useCallback((payload: any) => {
      console.log("payload",payload)
        dispatch(addMessageToChannel(payload.payload.message))

      }, []);

      const channelData = {
        user:profile,
        currentChannel
      }
    const {sendMessage} = useMessageSubscription(channelData, messageReceived);

      

      const showDrawer = () => {
        setOpen(true);
      }; 
      

          const onClose = () => {
            setOpen(false);
          };
          const encodeFileToBase64 = (file:any) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = (error) => reject(error);
            });
          };

      const handleOnclick = ()=>{

        dispatch(unsubscribeFromMessages(channelData));
        unsubscribeFromChannels()
        dispatch(removeChannelDataonExit(currentChannel))
        setOpen(false);
        navigate('/')
    
      }


      const handleSendMessages = async(msg:any,img?:any)=>{
        let messages
        if(img){
          const encodedImg = await encodeFileToBase64(img)
           messages= {
            channelName:currentChannel,
            message:msg,
            user:profile,
            image:encodedImg,
            date: Date.now()
          }
        }else{
          messages= {
            channelName:currentChannel,
            message:msg,
            user:profile,
            date: Date.now()
          }
        }
        sendMessage(messages)

      }

    

  return (
    <>


    <ChatComp/>
    <Drawer title={currentChannelname} onClose={onClose} open={open}>
        <Button type='primary' style={{width:'100%',backgroundColor:'darkred'}} onClick={handleOnclick}>
          Exit {currentChannelname}
        </Button>

        <div>
          
        </div>
     </Drawer>

    <Layout style={{  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Content style={{ maxWidth: '600px', paddingBottom: '20px', width: '100%' }}>



      <ChatInput handleSendMessage={handleSendMessages} showDrawer={showDrawer}/> 

      </Content>

      </Layout>


    
    
    </>

  )
}

export default Chatui
