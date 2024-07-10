import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Drawer, Layout } from 'antd';
// import { useAppContext } from '../context/appContext';
import Messages from './Messages';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { unsubscribeFromMessages } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import useMessageSubscription from '../utils/messagesHook';

const { Content } = Layout;

function ChatComp() {
  const [height, setHeight] = useState(window.innerHeight - 205);
//   const { scrollRef, onScroll, scrollToBottom, isOnBottom, unviewedMessageCount } = useAppContext();
const [open, setOpen] = useState(false);
const dispatch = useDispatch();
const navigate = useNavigate();

const {currentChannel,profile} = useSelector((state)=>state.users)


const showDrawer = () => {
  setOpen(true);
};

const onClose = () => {
  setOpen(false);
};

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


  const unviewedMessageCount = 1
  const isOnBottom = true

  const scrollToBottom = ()=>{
    console.log("jkfjjf")
  }

  const handleOnclick = ()=>{

    dispatch(unsubscribeFromMessages(channelData));
    unSubscribeFromChannel()
    setOpen(false);
    navigate('/')

  }

  return (
    <Layout style={{  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Content style={{ maxWidth: '600px', paddingBottom: '20px', width: '100%' }}>

      <Drawer title="Basic Drawer" onClose={onClose} open={open}>
        <Button type='primary' onClick={handleOnclick}>
          Exit 

        </Button>

      </Drawer>
        <Card
          style={{ backgroundColor: 'white', borderRadius: '10px', height, overflow: 'auto' }}
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
              onClick={scrollToBottom}
            >
              {unviewedMessageCount > 0 ? (
                <Badge count={unviewedMessageCount} style={{ backgroundColor: '#52c41a' }}>
                  <Button type="link" icon={<BsChevronDoubleDown />} />
                </Badge>
              ) : (
                <Button type="link" icon={<BsChevronDoubleDown />} />
              )}
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
}


export default ChatComp
