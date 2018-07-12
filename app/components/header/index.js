import React from 'react';
import { Button, Icon, Layout } from 'antd';
import './index.css';
import Logout from '../logout';
const { Header } = Layout;
class HeaderComponent extends React.Component{
    render(){
        const { width='1200px', cookies, pathname } = this.props;
        return (
            <Header className="q-header">
                <div className="q-header-container" style={{width: width}}>
                    <div className="q-header-logo"/>
                    <div className="q-header-platform">
                        <strong>嗨球培训运营平台</strong>
                    </div>
                    {pathname !== '/login' && pathname !== '/forget' ? <Logout cookies={cookies}/>:null}
                </div>
            </Header>
        )
    }
}
export default HeaderComponent;