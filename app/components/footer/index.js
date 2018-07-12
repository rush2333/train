import React from 'react';
import { Layout } from 'antd';
import './index.css';
const { Footer } = Layout;
class FooterComponent extends React.Component{
    render(){
        return (
            <Footer className="q-footer">
                <small>羽毛球培训管理系统 &copy;2017 Created by Hey-Q</small>
            </Footer>
        )
    }
}
export default FooterComponent;