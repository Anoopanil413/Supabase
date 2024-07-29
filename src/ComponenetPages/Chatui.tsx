import  { useCallback, useEffect, useState } from 'react'
import ChatComp from '../components/Chat'
import useMessageSubscription from '../utils/messagesHook';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Drawer, Layout, List,} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { addMessageToChannel, removeChannelDataonExit, unsubscribeFromMessages } from '../features/userSlice';
// import { MenuFoldOutlined, PaperClipOutlined } from '@ant-design/icons';
import ChatInput from '../components/chatInput';
import supabase from '../supabase';

const Chatui = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
const {currentChannel,profile,currentChannelname,channels} = useSelector((state:any)=>state.users) ;
    if(!currentChannel){
        navigate('/')
    }

    const [open, setOpen] = useState(false);

    const [onlineUsers, setOnlineUsers] = useState<{ id: any; username: any; avatar_url: any; }[]>([]);

    const channelsData = channels.filter((chanl:any) => chanl.id == currentChannel);



    const messageReceived = useCallback((payload: any) => {
      // console.log("payload",payload)
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



      // useEffect(() => {
      //   const fetchOnlineUsers = async () => {

    
      //       const usersOnline = channels.online_users || [];
    
      //       const { data: usersData, error: usersError } = await supabase
      //         .from('users')
      //         .select('id, name, avatar')
      //         .in('id', usersOnline);
    
      //       if (usersError) {
      //         console.error('Error fetching users:', usersError);
      //       } else {
      //       }
      //     }
      //   };
    
      //   fetchOnlineUsers();
      // }, [channelName]);


      useEffect(()=>{
                const fetchOnlineUsers = async () => {

                  

    
            const usersOnline = channelsData[0]?.online_users || [];


            // usersOnline.forEach(async(element:any) => {
            //   const { data: usersData, error: usersError } = await supabase
            //   .from('profiles')
            //   .select('id, username, avatar_url')
            //   .in('id', usersOnline);

            // if (usersError) {
            //   console.error('Error fetching users:', usersError);
            // } else {
            // }
            // });

            const { data: usersData, error: usersError } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', usersOnline);

            if (usersError) {
              console.error('Error fetching users:', usersError);
            } else {

              setOnlineUsers(usersData)
            }

          }

          fetchOnlineUsers()

      
      },[])

    

  return (
    <>


    <ChatComp/>
    <Drawer title={currentChannelname} onClose={onClose} open={open}>
        <Button type='primary' style={{width:'100%',backgroundColor:'darkred'}} onClick={handleOnclick}>
          Exit {currentChannelname}
        </Button>

        <div>
        <List
        itemLayout="horizontal"
        dataSource={onlineUsers}
        renderItem={user => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Badge dot status="success">
                  <Avatar src={user.avatar_url} />
                </Badge>
              }
              title={user?.username}
            />
          </List.Item>
        )}
      />
          
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
