import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

type FieldType = {
    useremail?: string;
  password?: string;
  remember?: boolean;
};
type FunFormProps = {
    handleSubmit: (values: any) => void;
  };
  

const FunForm = ({handleSubmit}:FunFormProps) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [submittable, setSubmittable] = useState(false);

  useEffect(() => {

    form
      .validateFields({ validateOnly: true })
      .then((obj:any) => setSubmittable(true) )
      .catch(() => setSubmittable(false));
  }, [form, values]);

  const onFinish = (values: any) => {
    handleSubmit(values)
  };

  const onFinishFailed = (error: any) => {
    console.log('Failed values:', error);
  };

  return (
    <Form
      name="form"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600}}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      <Form.Item<FieldType>
        label={<span className="custom-label">User email</span>}
        name="useremail"
        validateTrigger="onBlur"

        rules={[
          { required: true, message: 'Please input your email!' },
        
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label={<span className="custom-label">Password</span>}
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
        <Button type="primary" htmlType="submit" disabled={!submittable}>
        <span className="custom-label">Submit</span>
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FunForm;
