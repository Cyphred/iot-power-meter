import { App as AntApp } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppConfigProvider from "./components/AppConfigProvider";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Signup from "./pages/Signup";
import Subscribers from "./pages/Subscribers";
import Rates from "./pages/Rates";
import SubscriberFull from "./pages/SubscriberFull";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AntApp>
      <AppConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route path="subscribers">
                  <Route path="" element={<Subscribers />} />
                  <Route path=":subscriberId" element={<SubscriberFull />} />
                </Route>
                <Route path="rates" element={<Rates />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AppConfigProvider>
    </AntApp>
  );
}

export default App;
