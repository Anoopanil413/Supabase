import React, { useEffect, useState } from 'react';
import { Avatar, Button, Descriptions, Form, Input, Upload, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import ReusableModal from '../components/Modal';
import userSlice, { createProfile } from '../features/userSlice';
import { UserOutlined } from '@ant-design/icons';
import avtar from '../../public/avatar.jpg'


const UserProfileModal = () => {

    const viewSlice = useSelector((state:any)=>state.users)
  const [visible, setVisible] = useState(viewSlice.viewModal);
  const [editMode, setEditMode] = useState(false);
  const profile = useSelector((state:any) => state.users.profile);
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const showModal = () => {
    setVisible(viewSlice.viewModal);
    setEditMode(profile ? true : false);
    form.setFieldsValue({
      username: profile?.username,
      full_name: profile?.full_name,
      email: profile?.email,
    });
  };

  useEffect(()=>{

    if(profile){
      setEditMode(profile ? true : false);
      form.setFieldsValue({
        username: profile?.username,
        full_name: profile?.full_name,
        email: profile?.email,
      });
    }


  },[profile])

  const handleCancel = () => {
    setVisible(false);
    setEditMode(false);
    form.resetFields();
    setFileList([]);
  };

  const handleOk = async(event:any) => {
    try {
      event.preventDefault()
      const values = await form.validateFields()
      const avatar_file = fileList.length ? fileList[0]?.originFileObj : null;
      const val = await dispatch(createProfile({ ...values, avatar_url: avatar_file }));
      setVisible(false);

    } catch (error) {
      console.log('ERRROR::',error)
    }

  
  };

  const handleUploadChange = ({ fileList }:any) => {
    setFileList(fileList);
  };

  const beforeUpload = (file:any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <>

      <ReusableModal
        title={profile ? 'Edit Profile' : 'Create Profile'}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
      <Avatar shape="square" size={100} icon={<UserOutlined />} src={profile?.avatar_url? profile?.avatar_url: avtar}/>

        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input disabled={editMode && !!profile} />
          </Form.Item>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input disabled={editMode && !!profile} />
          </Form.Item> */}
          <Form.Item name="avatar_url" label="Avatar">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              maxCount={1}
            >
              {fileList.length < 1 && <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>}
            </Upload>
          </Form.Item>
        </Form>
      </ReusableModal>
    </>
  );
};

export default UserProfileModal;
