import React, { useEffect, useState } from 'react';
import { Alert, Avatar, Button, Card, List, Spin, Typography } from 'antd';
// import { useAppContext } from '../context/appContext';
import Message from './Message';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { Text } = Typography;

export default function Messages() {
//   const { username, loadingInitial, error, getMessagesAndSubscribe, messages } = useAppContext();
const {channelMessagesOnSubscription,currentChannel,profile} = useSelector((state:any)=>state.users);







  return (
    <>
    {/* {
      channelMessagesOnSubscription[currentChannel] && channelMessagesOnSubscription[currentChannel].messages.length > 0 && channelMessagesOnSubscription[currentChannel].messages.map((m:any)=>{
        console.log("cheking messaeg sin componenet",m)

        return(
          <>
          <div>
            {m.messages}
          </div>
          
          </>
        )
      })
    } */}


{channelMessagesOnSubscription[currentChannel] && channelMessagesOnSubscription[currentChannel].messages.length > 0 ?(
    <List
      itemLayout="horizontal"
      dataSource={channelMessagesOnSubscription[currentChannel].messages}
      renderItem={(message:any) => (
        <List.Item className={message.user.id === profile.id ? 'my-message' : 'other-message'}>
          <List.Item.Meta
            avatar={<Avatar src={message.user.avatar_url} />}
            title={<span>{message.user.id === profile.id ? "You" : message.user.username}</span>}
            description={
              <div>
                <p style={{ color: 'black' }}>{message.messages}</p>
                <span className="timestamp">{moment(message.timestamp).format('hh:mm A')}</span>
              </div>
            }
          />
        </List.Item>
      )}
    />



):(
  <>
  <p>No messages yet</p>
  
  </>
)
    
  }
    </>
  )
}
