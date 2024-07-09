import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Layout } from 'antd';
// import { useAppContext } from '../context/appContext';
import Messages from './Messages';
import { BsChevronDoubleDown } from 'react-icons/bs';

const { Content } = Layout;

function ChatComp() {
  const [height, setHeight] = useState(window.innerHeight - 205);
//   const { scrollRef, onScroll, scrollToBottom, isOnBottom, unviewedMessageCount } = useAppContext();

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight - 205);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const unviewedMessageCount = 1
  const isOnBottom = true

  const scrollToBottom = ()=>{
    console.log("jkfjjf")
  }

  return (
    <Layout style={{  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ maxWidth: '600px', paddingBottom: '20px', width: '100%' }}>
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
