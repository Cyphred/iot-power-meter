import { App as AntApp } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppConfigProvider from "./components/AppConfigProvider";
import Login from "./pages/Login";
import Layout from "./pages/Layout";

function App() {
  return (
    <AntApp>
      <AppConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}></Route>
          </Routes>
        </BrowserRouter>
      </AppConfigProvider>
    </AntApp>
  );
}

export default App;
