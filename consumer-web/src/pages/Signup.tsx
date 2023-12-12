import { Card, Flex, Typography, Button, Form, Input, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";

type FieldType = {
  email: string;
  password: string;
  passwordRepeat: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  streetAddress: string;
  barangay: string;
  city: string;
};

const Signup = () => {
  const { isLoading, apiError, serverError, signup } = useSignup();
  const navigate = useNavigate();

  const onFinish = async ({
    email,
    password,
    firstName,
    middleName,
    lastName,
    streetAddress,
    barangay,
    city,
  }: FieldType) => {
    // Reject if email or password was not provided
    if (!email || !password) return;

    const result = await signup({
      email,
      password,
      firstName,
      middleName,
      lastName,
      streetAddress,
      barangay,
      city,
    });

    if (result) navigate("/login?createAccountSuccess=1");
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Flex vertical style={{ height: "100vh" }} justify="center" align="center">
      <Card>
        <Typography.Title level={2}>Create an Account</Typography.Title>
        <Form
          name="signup"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item<FieldType>
            label="E-mail"
            name="email"
            rules={[
              { type: "email", message: "Please enter a valid email" },
              { required: true, message: "E-mail is required" },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="Repeat password"
            name="passwordRepeat"
            rules={[
              { required: true, message: "Password is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
            dependencies={["password"]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="First name"
            name="firstName"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Middle name"
            name="middleName"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Last name"
            name="lastName"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Street address"
            name="streetAddress"
            rules={[{ required: true, message: "Street address is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Barangay"
            name="barangay"
            rules={[{ required: true, message: "Barangay is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="City/Municipality"
            name="city"
            rules={[
              { required: true, message: "City/municipality is required" },
            ]}
          >
            <Input />
          </Form.Item>

          {apiError && (
            <Alert message={apiError.message} type="error" closable />
          )}
          {serverError && (
            <Alert message={serverError.message} type="error" closable />
          )}

          <Flex
            style={{ width: "100%", paddingRight: 44 }}
            justify="flex-end"
            gap={8}
          >
            <Button type="default" onClick={() => navigate(-1)}>
              Go back
            </Button>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" disabled={isLoading}>
                Create Account
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
};

export default Signup;
