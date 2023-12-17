import { Card, Flex, Typography, Button, Form, Input, Alert } from "antd";
import useLogin from "../hooks/useLogin";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type FieldType = {
  email?: string;
  password?: string;
};

const Login = () => {
  const { login, isLoading, apiError, serverError } = useLogin();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const onFinish = async ({ email, password }: FieldType) => {
    // Reject if email or password was not provided
    if (!email || !password) return;
    await login(email, password);

    const user = localStorage.getItem("user");
    const token = localStorage.getItem("userToken");
    if (user && token) navigate("/subscribers");
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("userToken");
    if (user && token) navigate("/subscribers");
  }, []);

  return (
    <Flex vertical style={{ height: "100vh" }} justify="center" align="center">
      <Card>
        <Typography.Title level={2}>
          IoT Power Company Employee App
        </Typography.Title>
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item<FieldType>
            label="E-mail"
            name="email"
            rules={[{ required: true, message: "E-mail is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>
          {apiError && (
            <Alert message={apiError.message} type="error" closable />
          )}
          {serverError && (
            <Alert message={serverError.message} type="error" closable />
          )}
          {searchParams.get("createAccountSuccess") === "1" && (
            <Alert
              showIcon
              message="Account creation successful. You may now login."
              type="success"
              closable
            />
          )}

          <Flex
            style={{ width: "100%", paddingRight: 22 }}
            justify="space-between"
          >
            <Typography.Link onClick={() => navigate("/signup")}>
              Create an account
            </Typography.Link>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" disabled={isLoading}>
                Login
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
};

export default Login;
