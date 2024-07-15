import React, { useState } from 'react';
import { Upload, Button, Input, Space, Flex } from 'antd';
import { PaperClipOutlined, MenuFoldOutlined, CloseOutlined } from '@ant-design/icons';

const ChatInput = ({ handleSendMessage, showDrawer }:any) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const beforeUpload = (file:any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      console.error('You can only upload image files!');
      return Upload.LIST_IGNORE; // Prevent upload if not an image
    }

    setFile(file); // Update state for display
    return false; // Prevent auto upload
  };

  const onFileRemove = () => {
    setFile(null); // Remove the file from the state
  };

  const onFileUpload = (info:any) => {
    if (info.file.status === 'uploading') {
      console.log('File is uploading...', info.file);
    } else if (info.file.status === 'done') {
      setFile(info.file);
      console.log('File uploaded successfully:', info.file);
    } else if (info.file.status === 'error') {
      console.error('File upload failed:', info.file.error);
    }
  };

  const handleSend = () => {
    if(message && message.trim() !== '')
    handleSendMessage(message, file);
    setMessage('');
    setFile(null);
  };

  return (
    <Flex style={{ width: '100%' }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input 
          placeholder="Enter message" 
          onChange={(e) => setMessage(e.target.value)} 
          value={message} 
        />
        {file && (
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
            />
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={onFileRemove} 
              style={{ position: 'absolute', top: 0, right: 0 }}
            />
          </div>
        )}
        <Upload beforeUpload={beforeUpload} onChange={onFileUpload} showUploadList={false}>
          <Button icon={<PaperClipOutlined />}> </Button>
        </Upload>
        <Button onClick={handleSend} type="primary">Send</Button>
        <Button type="text" style={{ marginLeft: '0.4rem', border: 'solid 1px' }} onClick={showDrawer}>
          <MenuFoldOutlined />
        </Button>
      </Space.Compact>
    </Flex>
  );
};

export default ChatInput;
