import React from 'react';
import { List, Avatar, Tooltip, Button } from 'antd';
import chatbg from '../../public/chatbg.jpg'
import { useSelector } from 'react-redux';

const ItemList = ({ items,handleClickToJoin,handleLeave }:{items:any,handleClickToJoin:any,handleLeave:any}) => {

    const {channelMessagesOnSubscription ,currentChannel} =useSelector((state:any)=>state.users)
    const handleJoinChannel = (item:any)=>{
        handleClickToJoin(item)
    }

    const handleLeaveChannel = (item:any)=>{
        handleLeave(item)
    }

    function truncateText(desc:string, maxLength=20) {
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
    <List
      itemLayout="horizontal"
      dataSource={items}
      style={{border:'solid 1px #d9d6ab', borderRadius:'1rem', maxHeight:'350px', backgroundColor:'#f5f4ed'}}
      
      renderItem={(item:any) => (
        <List.Item style={{minWidth:'280px', margin:'0.4rem',padding:'0.5rem', backgroundColor:'#deddc5', borderRadius:'1rem'}} key={item.id}>
          <List.Item.Meta
          style={{display:'flex',alignItems:'center'}}
            avatar={<Avatar src={item?.images ?? chatbg} />}
            title={<p>{item?.name}</p>}
            description={
              <div>
                <p>{item.description?truncateText(item.description):item.description}</p>
                {item.remainingTime && (
                  <p style={{ color: 'red' }}>{item.remainingTime}</p>
                )}
              </div>
            }

          />
           <div style={{ marginLeft: 'auto' }}>
            {
                channelMessagesOnSubscription[item?.id] ?(
                    <>
                    <Button type="primary" onClick={() => handleJoinChannel(item)}>Chat</Button>

                    <Button type='default' style={{backgroundColor:'darkred', color:'white'}} onClick={() => handleLeaveChannel(item)}>Leave</Button>
                    </>

                ):(
                    <Button type="primary" onClick={() => handleJoinChannel(item)}>Join</Button>
                )
            }
          

          </div>
        </List.Item>
      )}
    />
  );
};

export default ItemList;
