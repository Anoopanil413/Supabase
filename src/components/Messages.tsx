import React from 'react';
import { Alert, Button, Spin, Typography } from 'antd';
// import { useAppContext } from '../context/appContext';
import Message from './Message';

const { Text } = Typography;

export default function Messages() {
//   const { username, loadingInitial, error, getMessagesAndSubscribe, messages } = useAppContext();
const messages = [{
    id:'1',
    text:"hello",
    is_authenticated:true,

},{
    id:'2',
    text:"hello",
    is_authenticated:true,
        username:'boommmfmf'
},{
    id:'3',
    text:"hello",
    is_authenticated:true,
      username:'boommm'
},{
    id:'4',
    text:"hello",
    is_authenticated:true,
      username:'mmmfmf'
}]


const username =  'mmmfmf'


  const reversed = [...messages].reverse();

//   if (loadingInitial) {
//     return (
//       <div style={{ textAlign: 'center' }}>
//         <Spin />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Alert
//         message="Error"
//         description={
//           <div>
//             {error}
//             <Button
//               type="link"
//               onClick={getMessagesAndSubscribe}
//               style={{ marginLeft: '5px' }}
//             >
//               try to reconnect
//             </Button>
//           </div>
//         }
//         type="error"
//         showIcon
//         style={{ marginTop: '20px' }}
//       />
//     );
//   }

  if (!messages.length) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Text >No messages 😞</Text>
      </div>
    );
  }

  return reversed.map((message) => {
    const isYou = message.username === username;
    return <Message key={message.id} message={message} isYou={isYou} />;
  });
}
