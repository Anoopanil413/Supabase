import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToMessages, unsubscribeFromMessages } from '../features/userSlice';
// import { subscribeToMessages, unsubscribeFromMessages } from ''; // Ensure to replace with the actual file name

const useMessageSubscription = (channelName:string, messageReceivedCallback:any) => {
  const dispatch = useDispatch();
  const { messagesSubscription,channelsSubscription } = useSelector((state:any) => state.users);

  useEffect(() => {
    dispatch(subscribeToMessages(channelName));

    return () => {
      dispatch(unsubscribeFromMessages());
    };
  }, [dispatch, channelName]);

  useEffect(() => {
    if (messagesSubscription?.listenMessages) {
      messagesSubscription.listenMessages(messageReceivedCallback);
    }
  }, [messagesSubscription, messageReceivedCallback]);

  const sendMessage = (message:string) => {
    if (messagesSubscription?.sendMessage) {
      messagesSubscription.sendMessage(message);
    }
  };

  return sendMessage;
};

export default useMessageSubscription;
