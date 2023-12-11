import { Layout as AntLayout, Button, Menu, Typography, theme } from "antd";
import { Outlet } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAppSelector } from "../redux/hooks";

const { Header, Content, Footer } = AntLayout;

const links = [{ key: 0, label: "" }];

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
        {/*
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={new Array(15).fill(null).map((_, index) => {
            const key = index + 1;
            return {
              key,
              label: `nav ${key}`,
            };
          })}
        />
        */}
        <Typography.Text style={{ color: "white" }}>
          Logged in as {user?.firstName} {user?.lastName}
        </Typography.Text>
        <Button onClick={handleLogout}>Log out</Button>
      </Header>
      <Content style={{ padding: "0 50px", overflow: "scroll" }}>
        <div
          className="site-layout-content"
          style={{ background: colorBgContainer, height: "100%" }}
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
