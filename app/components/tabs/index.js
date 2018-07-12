import React from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
class TabsComponent extends React.Component{
    render(){
        let { hideBar=true,className='', children, ...other } = this.props;
        if(hideBar){
            className = 'q-tabs-bar-none ' + className;
        }
        return (
            <Tabs className={className} {...other}>{children}</Tabs>
        )
    }
}
TabsComponent.TabPane = TabPane;
export default TabsComponent;