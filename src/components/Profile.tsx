import React from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createProfile } from '../features/userSlice';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state:any) => state.users);

  const onFinish = (values:any) => {
    dispatch(createProfile({ ...values, id: user.id }));
  };

  return (
    <Form
      name="profile"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Full Name"
        name="full_name"
        rules={[{ required: true, message: 'Please input your full name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Avatar URL"
        name="avatar_url"
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
