import { Layout as AntLayout, Button, Typography, theme } from "antd";
import { Outlet } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAppSelector } from "../redux/hooks";

const { Header, Content, Footer } = AntLayout;

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
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Typography.Text style={{ color: "white" }}>
          Logged in as {user?.firstName} {user?.lastName}
        </Typography.Text>
        <Button onClick={handleLogout}>Log out</Button>
      </Header>
      <Content style={{ padding: "0 50px", overflow: "scroll" }}>
        <div
          className="site-layout-content"
          style={{ background: colorBgContainer, paddingBottom: 16 }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </AntLayout>
  );
};

export default Layout;
