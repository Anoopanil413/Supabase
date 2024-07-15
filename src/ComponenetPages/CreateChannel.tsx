import React, { Fragment, useCallback, useEffect, useState } from "react";
import ReusableCard from "../components/Card";
import { Button, Input, Menu, MenuProps, Upload } from "antd";
import Buttons from "../components/Button";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInitialChannels,
  setCurrentChannelName,
  setModalView,
  setUsersCurrentChanel,
  SubscribetoChannels,
  unsubscribeFromChannels,
} from "../features/userSlice";
import supabase from "../supabase";
import imgs from '../../public/imgs.svg'
import { useNavigate } from "react-router-dom";
import ItemList from "../components/ListItems";
import './commonPage.css'


const CreateChannel = () => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState([]);
  const { channelsSubscription, error, channels,profile } = useSelector(
    (state: any) => state.users
  );
  const dispatch = useDispatch();

  const navigate = useNavigate()


  useEffect(() => {
    (async () => {
      await dispatch(fetchInitialChannels());
      const val = await dispatch(SubscribetoChannels());
    })();

    return () => {
      dispatch(unsubscribeFromChannels());
    };
  }, [dispatch]);

  const [messages, setMessage] = useState<String | null>(null);


  const handleChannelClick = (channelName: any) => {
    setUsersCurrentChanel(channelName);
  };

  const handleChange = (event: any) => {
    const namef = event.target.name;
    const value = event.target.value;
    if (namef == "channelName") {
      setChannelName(value);
    } else {
      setDescription(value);
    }
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      setMessage("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setMessage("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const createChannel = async (event: any) => {
    event.preventDefault;

    if(!profile){
      dispatch(setModalView(true)) 
      return
    }

    if (fileList) {
      const images = fileList.length ? fileList[0]?.originFileObj : null;

      const { data, error: uploadError } = await supabase.storage
        .from("channel_images")
        .upload(`public/${channelName}-${Date.now()}`, images);

      if (uploadError) {
        console.log("Error", uploadError);

        throw new Error(uploadError.message);
      }

      const publicURL = await supabase.storage
        .from("channel_images")
        .getPublicUrl(data.path);

      if (!publicURL) {
        throw new Error("no image url ");
      }
      const imageurl = publicURL.data.publicUrl;

      const { data: chanlData, error } = await supabase
        .from("channels")
        .insert([{ name: channelName, description, images: imageurl }]);

      if (error) {
        console.log("ERROR::", error);
        throw new Error(error.message);
      }


      return chanlData;
    } else {
      const { data, error } = await supabase
        .from("channels")
        .insert([{ name: channelName, description }]);

      if (error) {
        console.log("ERROR::", error);
        throw new Error(error.message);
      }


      return data;
    }
  };

  const handleLeave = (item:any)=>{

  }


  const handleJoinChannel = (chanl:any)=>{
    if(profile){
      dispatch(setUsersCurrentChanel(chanl.id))
      dispatch(setCurrentChannelName(chanl.name))
      navigate('chat')
    }else{
      setModalView(true)
    }

  }


  return (
    <>
      <div  className='createChannelTemplate'  >
        <div style={{width:'50%'}}>

        <div style={{maxWidth:'340px', border:'solid 1px #d9d6ab', borderRadius:'0.5rem'}}>
        <ReusableCard title="Crerate Channel">
          <label             style={{ margin: "0.7rem",fontWeight:'bold',marginTop:'0.8rem' }}
          >Channel Name</label>
          <Input
            name="channelName"
            placeholder="Channel name"
            value={channelName}
            onChange={handleChange}
            style={{ margin: "0.7rem" }}
            />
            <label             style={{ margin: "0.7rem",fontWeight:'bold' }}
            >Channel Description</label>

          <Input
            name="description"
            placeholder="Channel description"
            value={description}
            onChange={handleChange}
            style={{ margin: "0.7rem" }}
            />
          <label             style={{ margin: "0.7rem",fontWeight:'bold' }}
          >Channel Logo</label>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            maxCount={1}
            style={{ margin: "0.7rem" }}

          >
            {fileList.length < 1 && (
              <div >
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          {messages && <p>{messages}</p>}

          <div style={{ margin: "0.5rem" }}>
            <Buttons handleClick={createChannel} text="Create" />
          </div>
        </ReusableCard>

        </div>
            </div>
        <div style={{width:'50%',padding:'1rem',height:'40vh', overflow:'hidden', scrollBehavior:'smooth'}}>
          <div style={{textAlign:'center', fontWeight:'bolder', fontSize:'1rem'}}>Channels</div>

          <div style={{display:'flex', justifyContent:'center', padding:'0 2rem', }}> 
          <ItemList handleClickToJoin={handleJoinChannel} handleLeave={handleLeave} items={channels}/>
            </div>

        </div>


        {/* <div>


        <div >
          <h2>Channels</h2>
          {error && <p>Error: {error}</p>}
        </div>
 
        {channels && channels.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: "2rem",
              backgroundColor: "lightgray",
              padding: "1rem",
              width: "80vw",
              flexWrap: "wrap",
              borderRadius: "1rem",
            }}
          >
            {channels.map((chanl: any) => {
              return (
                <Fragment key={chanl.id} >
                    <div onClick={()=>handleJoinChannel(chanl)} >

                  <ReusableCard
                    title={chanl?.name}
                    description={chanl?.description}
                    >
                    <>
                    <img src={chanl.images?chanl.images:imgs} alt="img" loading="lazy" style={{width:'4rem',height:'4rem', opacity:'0.8',padding:'1rem'}}/>
                    </>
                  </ReusableCard>
                      </div>
                </Fragment>
              );
            })}
          </div>
        )}
                </div> */}

      </div>
    </>
  );
};

export default CreateChannel;
