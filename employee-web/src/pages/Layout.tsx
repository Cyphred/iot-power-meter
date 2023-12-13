import {
  Layout as AntLayout,
  Button,
  Flex,
  Menu,
  MenuProps,
  Typography,
  theme,
} from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";

const { Header, Content } = AntLayout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [getItem("Subscribers", "1"), getItem("Rates", "2")];

const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
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

  const handleMenuSetPage = (key: string) => {
    switch (key) {
      case "1":
        navigate("/subscribers");
        break;
      case "2":
        navigate("/rates");
        break;
    }
  };

  return (
    <AntLayout className="layout" style={{ width: "100vw", height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Flex
          gap={8}
          align="center"
          justify="space-between"
          style={{ width: "100%" }}
        >
          <Typography.Title level={5} style={{ margin: 0, color: "white" }}>
            Employee Dashboard
          </Typography.Title>

          <Menu
            theme="dark"
            mode="horizontal"
            items={items}
            style={{ flex: 1, minWidth: 0 }}
            onSelect={(info) => handleMenuSetPage(info.key)}
          />

          <Flex gap={8} align="center">
            <Typography.Text style={{ color: "white" }}>
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
