import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { Avatar, Badge, Space } from 'antd';
import { setModalView } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const { Header, Sider, Content } = Layout;

const Layouts: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch()
  const viewModal = useSelector((state:any)=>state.users)

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" style={{width:'100%'}} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',backgroundColor:colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

<Badge dot>
      <Avatar shape="square" icon={<UserOutlined />}onClick={()=>dispatch(setModalView(!viewModal.viewModal))}/>
    </Badge>

        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height:'90vh',
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Layouts;