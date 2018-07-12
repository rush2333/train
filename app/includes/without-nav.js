import React from 'react';
import { Layout } from 'antd';
import { HeaderComponent, FooterComponent } from '../components';
const { Content } = Layout;
class WithoutNav extends React.Component{
    render(){
        const { initHeight, children, cookies,pathname } = this.props;
        const height = initHeight - 120 + 'px';
        return (
            <Layout >
                <HeaderComponent width={'1200px'} cookies={cookies} pathname={pathname}/>
                <Content className="q-content" style={{minHeight: height}}>
                    {children}
                </Content>
                <FooterComponent/>
            </Layout>
        )
    }
}
export default WithoutNav;