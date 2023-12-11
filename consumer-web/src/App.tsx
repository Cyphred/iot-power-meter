import { App as AntApp } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AppConfigProvider from "./components/AppConfigProvider";
import Layout from "./pages/Layout";

function App() {
  return (
    <AntApp>
      <AppConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppConfigProvider>
    </AntApp>
  );
}

export default App;
