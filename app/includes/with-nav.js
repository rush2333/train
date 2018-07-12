import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { FooterComponent, Logout } from '../components';
import { menuList } from '../config/routes';
const { Content, Sider } = Layout;
const ItemGroup = Menu.ItemGroup;
class WithNav extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: false
        };
    }
    render(){
        let { pathname, initHeight, children, cookies } = this.props;
        let selectKeys = [];
        let menuGroup = menuList.map(group => {
            return (<ItemGroup key={group.url} title={<span><Icon type={group.icon} style={{marginRight:'8px'}}/>{group.group}</span>}>
                {
                    group.children.map(child => {
                        if(pathname.indexOf(group.url+child.url) !== -1){
                            selectKeys.push(group.url+child.url);
                        }
                        return (<Menu.Item className="q-menu-item" key={group.url+child.url}><Link to={group.url + child.url + child.defaultChild}>{child.title}</Link></Menu.Item>)
                    })
                }
            </ItemGroup>)
        });
        return (
            <Layout>
                <Sider trigger={null} className="q-sider" style={{minHeight: initHeight + 'px'}} width="180">
                    <Link to="/"><header className='q-logo'/></Link>
                    <Menu theme="dark" selectedKeys={selectKeys}>
                        {menuGroup}
                    </Menu>
                </Sider>
                <Layout className="q-layout-content">
                    <header className="q-content-header">
                        <Logout cookies={cookies}/>
                    </header>
                    <Content style={{background: "#fff",margin: "15px 10px 0",borderRadius: "4px"}}>{children}</Content>
                    <FooterComponent/>
                </Layout>
            </Layout>
        )
    }
}
export default WithNav;