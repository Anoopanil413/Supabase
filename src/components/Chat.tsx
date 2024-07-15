import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Badge, Button, Card, Drawer, Layout, Tooltip,  } from 'antd';
// import { useAppContext } from '../context/appContext';
import Messages from './Messages';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { unsubscribeFromMessages } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import useMessageSubscription from '../utils/messagesHook';
import chatbg from '../../public/chatbg.jpg'
import { Header } from 'antd/es/layout/layout';

import avtrbg from '../../public/avatar.jpg'
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';

const { Content } = Layout;

function ChatComp() {
  const [height, setHeight] = useState(window.innerHeight - 400);
//   const { scrollRef, onScroll, scrollToBottom, isOnBottom, unviewedMessageCount } = useAppContext();
const [open, setOpen] = useState(false);
const dispatch = useDispatch();
const navigate = useNavigate();

const {currentChannel,profile,channelMessagesOnSubscription,currentChannelname,channels} = useSelector((state:any)=>state.users)


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
  const isOnBottom = false;

  const chanlDat = channels.filter((chanl:any)=>chanl.id ===currentChannel )


  const scrollToBottom = ()=>{
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function truncateText(desc:string, maxLength=25) {
    let descrip = new String(desc)
    if (descrip.length > maxLength) {
        descrip = descrip.slice(0, maxLength) + '...';
    }
    return (
        <Tooltip title={desc}>
        <div>{descrip}</div>
      </Tooltip>
    );
  }


  return (
    <Layout style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', padding:'1rem' }}>

      <Content style={{ maxWidth: '600px', paddingBottom: '20px', width: '100%' }}>

              <Header style={{ backgroundColor: '#deddc5', display: 'flex', alignItems: 'center', borderTopLeftRadius:'1rem',borderTopRightRadius:'1rem'  }}>
        <Avatar src={chanlDat[0]?.images ?? avtrbg} size="large" style={{ marginRight: 16 }} />
        <div>
          <Title level={4} style={{ margin: 0 }}>{chanlDat[0]?.name}</Title>
          <Paragraph style={{ margin: 0 }}>{truncateText(chanlDat[0]?.description)}</Paragraph>
        </div>
      </Header>



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
