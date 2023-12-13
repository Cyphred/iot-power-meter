import { App as AntApp } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppConfigProvider from "./components/AppConfigProvider";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Signup from "./pages/Signup";
import Subscribers from "./pages/Subscribers";
import Rates from "./pages/Rates";

function App() {
  return (
    <AntApp>
      <AppConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="rates" element={<Rates />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppConfigProvider>
    </AntApp>
  );
}

export default App;
