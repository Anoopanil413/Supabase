import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Drawer, Layout } from 'antd';
// import { useAppContext } from '../context/appContext';
import Messages from './Messages';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { unsubscribeFromMessages } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import useMessageSubscription from '../utils/messagesHook';
import chatbg from '../../public/chatbg.jpg'

const { Content } = Layout;

function ChatComp() {
  const [height, setHeight] = useState(window.innerHeight - 205);
//   const { scrollRef, onScroll, scrollToBottom, isOnBottom, unviewedMessageCount } = useAppContext();
const [open, setOpen] = useState(false);
const dispatch = useDispatch();
const navigate = useNavigate();

const {currentChannel,profile,channelMessagesOnSubscription} = useSelector((state)=>state.users)


const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight - 205);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const channelData = {
    channelName:currentChannel,
    user:profile

  }
  const {unSubscribeFromChannel} = useMessageSubscription(channelData, ()=>{});

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [channelMessagesOnSubscription[currentChannel]]);
  
  // const unviewedMessageCount = 1
  const isOnBottom = false

  const scrollToBottom = ()=>{
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }


  return (
    <Layout style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', padding:'1rem' }}>

      <Content style={{ maxWidth: '600px', paddingBottom: '20px', width: '100%' }}>



        <Card
          style={{backgroundImage:`url(${chatbg})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat', borderRadius: '10px', height, overflow: 'auto' }}
          bodyStyle={{ padding: '20px' }}
          // onScroll={onScroll}
          // ref={scrollRef}
        >
          <Messages />
          {!isOnBottom && (
            <div
              style={{
                position: 'sticky',
                bottom: 8,
                float: 'right',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              ref={messagesEndRef}
              onClick={scrollToBottom}
            >
              {/* {unviewedMessageCount > 0 ? (
                <Badge count={unviewedMessageCount} style={{ backgroundColor: '#52c41a' }}>
                  <Button type="link" icon={<BsChevronDoubleDown />} />
                </Badge>
              ) : (
                <Button type="link" icon={<BsChevronDoubleDown />} />
              )} */}
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
}


export default ChatComp
