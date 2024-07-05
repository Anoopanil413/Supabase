import { Button, Form, Input } from 'antd';
import React, { Component } from 'react';

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

export class Forms extends Component {
  formRef = React.createRef<any>();

  state = {
    submittable: false,
  };

  componentDidMount() {
    this.validateForm();
  }

  componentDidUpdate(prevProps: any, prevState: any) {

    if (prevState !== this.state) {
      this.validateForm();
    }
  }

  validateForm = () => {
    this.formRef.current
      .validateFields({ validateOnly: true })
      .then(() => {
        if (!this.state.submittable) {
          this.setState({ submittable: true });
        }
      })
      .catch(() => {
        if (this.state.submittable) {
          this.setState({ submittable: false });
        }
      });
  };

  onValuesChange = () => {
    this.validateForm();
  };

  onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  onFinishFailed = (error: any) => {
    console.log('Failed values:', error);
  };

  render() {
    return (
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        autoComplete="off"
        ref={this.formRef}
        onValuesChange={this.onValuesChange}
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Please input your username!' },
            { max: 15, message: 'Username cannot be longer than 15 characters!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={!this.state.submittable}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Forms;
