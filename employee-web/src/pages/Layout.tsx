import { Layout as AntLayout, Button, Flex, Typography, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAppSelector } from "../redux/hooks";

const { Header, Content } = AntLayout;

const Layout = () => {
  const { logout } = useLogout();
  const { user } = useAppSelector((state) => {
    return { user: state.auth.user };
  });

  const handleLogout = () => {
    logout();
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntLayout className="layout" style={{ width: "100vw", height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          borderStyle: "solid",
          borderWidth: "0 0 1px 0",
          borderColor: "rgba(0,0,0,0.15)",
        }}
      >
        <Flex
          gap={8}
          align="center"
          justify="space-between"
          style={{ width: "100%" }}
        >
          <Typography.Title level={5} style={{ margin: 0 }}>
            Employee Dashboard
          </Typography.Title>

          <Flex justify="center" align="center" gap={8}>
            <Link to="/subscribers">
              <Button type="primary">Subscribers</Button>
            </Link>
            <Link to="/rates">
              <Button type="primary">Rates</Button>
            </Link>
          </Flex>

          <Flex gap={8} align="center">
            <Typography.Text>
              Logged in as {user?.firstName} {user?.lastName}
            </Typography.Text>
            <Button onClick={handleLogout}>Log out</Button>
          </Flex>
        </Flex>
      </Header>
      <Content style={{ padding: "0 50px", overflow: "scroll" }}>
        <div
          className="site-layout-content"
          style={{ background: colorBgContainer, paddingBottom: 16 }}
        >
          <Outlet />
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;
