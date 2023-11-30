import { ConfigProvider, ThemeConfig } from "antd";
import { ReactNode } from "react";

const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  const theme: ThemeConfig = {
    components: {
      Typography: {
        titleMarginTop: 0,
        titleMarginBottom: 0,
      },
      Form: {
        itemMarginBottom: 0,
      },
    },
  };

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};

export default AppConfigProvider;
