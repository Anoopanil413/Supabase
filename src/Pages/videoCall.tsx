
import  { useRef, useEffect, useState } from 'react';

import './videoChat.css'
import supabase from '../supabase';
import { useSelector } from 'react-redux';




const VideoCall = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null); 
    const [isCallActive, setIsCallActive] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const {profile} = useSelector((state:any)=>state.users);





  


  useEffect(() => {  
    setIsScreenSharing(false);
    const configuration = { iceServers: [  
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.l.google.com:5349" },
        { urls: "stun:stun1.l.google.com:3478" },
        { urls: "stun:stun1.l.google.com:5349" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:5349" },
        { urls: "stun:stun3.l.google.com:3478" },
        { urls: "stun:stun3.l.google.com:5349" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:5349" }] };



    peerConnectionRef.current = new RTCPeerConnection(configuration);
    peerConnectionRef.current.onicecandidate = handleICECandidate;
    peerConnectionRef.current.ontrack = handleTrack;
    const channel = supabase.channel('video-call');
      channel.on('broadcast', { event: 'signal' }, handleSignalingMessage);

    channel.subscribe((status:any) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed to video-call channel');
      }
    });
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      channel.unsubscribe();
    };
  }, []);


  const handleICECandidate = (event:any) => {

    console.log("is the profile id available at ",profile?.id)
    if (event.candidate) {
      sendSignalingMessage({
        type: 'ice-candidate',
        candidate: event.candidate,
        senderId:profile?.id
      });
    }
  };
  const sendSignalingMessage = async (message:any) => {
    await supabase.channel('video-call').send({
      type: 'broadcast',
      event: 'signal',
      payload: message,
    });
  };
  

  const handleTrack = (event:any) => {
    if(!remoteVideoRef.current)return;
    remoteVideoRef.current.srcObject = event.streams[0];
  };


  const handleSignalingMessage = async (payload:any) => {

    const { type, ...data } = payload.payload;

    if(!peerConnectionRef.current)return

    if(data?.senderId == profile?.id)return

    switch (type) {
      case 'offer':
        console.log("received offer from",data)

        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        sendSignalingMessage({
          type: 'answer',
          answer: peerConnectionRef.current.localDescription,
          senderId:profile?.id
        });
        break;
      case 'answer':
        console.log("received answer from",data)
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        break;
      case 'ice-candidate':
        console.log("received icecandidtaes",data)

        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        break;
      default:
        console.log('Unknown message type:', payload);
    }
  };
  async function getConnectedDevices(type:any) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
}

const  getRespectiveMediaDevice = async(ifVideoDeviceAvailable:any)=>{
    if(ifVideoDeviceAvailable.length ==0 ){
         let stream =  await navigator.mediaDevices.getUserMedia({audio:true});
         return stream
    }else{
        let stream =  await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        return stream
    }
}


  const startCall = async () => {
    try {

      let ifVideoDeviceAvailable = await getConnectedDevices('videoinput')

      const stream = await getRespectiveMediaDevice(ifVideoDeviceAvailable)
      if(!stream)return

      if(!localVideoRef.current)return;
      if(!peerConnectionRef.current)return;
      localVideoRef.current.srcObject = stream;

      stream.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, stream));
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);


      sendSignalingMessage({
        type: 'offer',
        offer: peerConnectionRef?.current.localDescription,
        senderId:profile.id
      });

      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if(!localVideoRef.current || !remoteVideoRef.current)return
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track:any) => track.stop());
    }
    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
    setIsCallActive(false);
  };
//   const toggleScreenShare = async () => {
//     try {
//       if (!isScreenSharing) {
//         const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//         const videoTrack = screenStream.getVideoTracks()[0];
//         const sender = peerConnectionRef.current.getSenders().find(s => s.track.kind === 'video');
//         await sender.replaceTrack(videoTrack);
//         localVideoRef.current.srcObject = screenStream;
//       } else {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         const videoTrack = stream.getVideoTracks()[0];
//         const sender = peerConnectionRef.current.getSenders().find(s => s.track.kind === 'video');
//         await sender.replaceTrack(videoTrack);
//         localVideoRef.current.srcObject = stream;
//       }
//       setIsScreenSharing(!isScreenSharing);
//     } catch (error) {
//       console.error('Error toggling screen share:', error);
//     }
//   };

  return (
    <div className="video-call-container">
      <div className="video-wrapper">
        <video ref={remoteVideoRef} className="remote-video" autoPlay playsInline />
        <video ref={localVideoRef} className="local-video" autoPlay playsInline muted />
      </div>
      <div className="button-group">
        <button
          onClick={isCallActive ? endCall : startCall}
          className={`call-button ${isCallActive ? 'end-call' : 'start-call'}`}
        >
          {isCallActive ? 'End Call' : 'Start Call'}
        </button>
        <button
        //   onClick={toggleScreenShare}
          className={`share-button ${isScreenSharing ? 'screen-sharing' : ''}`}
        >
          Share Screen
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
