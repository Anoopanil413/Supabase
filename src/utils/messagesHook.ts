import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToChannel, setChannelOnSubscriptionForMsgs, subscribeToMessages, unsubscribeFromMessages } from '../features/userSlice';
// import { subscribeToMessages, unsubscribeFromMessages } from ''; // Ensure to replace with the actual file name

const useMessageSubscription = (channeldat:any, messageReceivedCallback:any) => {
  const dispatch = useDispatch();
  const { messagesSubscription } = useSelector((state:any) => state.users);

  const {currentChannel:channelName,user} = channeldat

  useEffect(() => {
    dispatch(subscribeToMessages(channeldat));
    dispatch(setChannelOnSubscriptionForMsgs({ channelName: channelName}));
    return () => {
      dispatch(unsubscribeFromMessages(channeldat));
      // if(messagesSubscription.unsubscribeFromChannel){
      //   messagesSubscription.unsubscribeFromChannel()
      // }
    };
  }, [dispatch, channelName]);

  useEffect(() => {
    if (messagesSubscription?.listenMessages) {
      messagesSubscription.listenMessages(messageReceivedCallback);
    }
  }, [messagesSubscription, messageReceivedCallback]);

  const sendMessage = (message:any) => {
    if (messagesSubscription?.sendMessage) {
      
      messagesSubscription.sendMessage(message);

      dispatch(addMessageToChannel(message))
    }
  };

  const unSubscribeFromChannel = ()=>{
    console.log("unsubscribing from channel")
    if(messagesSubscription.unsubscribeFromChannel){
      messagesSubscription.unsubscribeFromChannel()

    }
  }

  return {sendMessage,unSubscribeFromChannel};
};

export default useMessageSubscription;
