import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Overview from './pages/Overview';
import 'antd/dist/reset.css';
import './App.css';
import './styles/responsive.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <Overview />
      </div>
    </ConfigProvider>
  );
}

export default App;