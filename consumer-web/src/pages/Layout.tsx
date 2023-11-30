import { Breadcrumb, Layout as AntLayout, Menu, theme } from "antd";
import { Outlet } from "react-router-dom";

const { Header, Content, Footer } = AntLayout;

const Layout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntLayout className="layout" style={{ width: "100vw", height: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
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
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="site-layout-content"
          style={{ background: colorBgContainer }}
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
