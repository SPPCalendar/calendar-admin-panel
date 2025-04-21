import { Button, Form, Input, Card } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JwtPayload, useAuthStore } from "../../store/auth";
import api from '../../utils/api';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string; }) => {
    // Simulated auth logic
    try {
      setLoading(true);
      
      const response = await api.post("/auth/login", {
        email: values.username,
        password: values.password,
      });
  
      const { accessToken } = response.data;

      const decoded = jwtDecode<JwtPayload>(accessToken);
      if (!decoded) {
        throw new Error("Invalid token");
      }

      if (decoded.userRole !== 'ADMIN') {
        alert('You are not authorized to access the admin panel.');
        return;
      }
  
      useAuthStore.getState().setAccessToken(accessToken);

      console.log("Login successful");
      navigate('/'); // Redirect to dashboard or home
    } catch (error: any) {
      console.error("Login failed:", error?.response?.data || error.message);
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Card title="Login" style={{ width: 300 }}>
        <Form name="login" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
