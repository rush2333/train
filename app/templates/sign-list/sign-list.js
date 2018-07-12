import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Tabs } from 'antd';
import { CommonPageComponent } from '../../components';
import DetailListComp from './components/detail-list';
import ClassListComp from './components/class-list';
import DetailComp from './components/detail';
const { TabPane } = Tabs;
class SignListTemplate extends React.Component{
    constructor(props){
        super(props);
        let type = 1, title = '平时班报名';
        if(this.pageType === 'special'){
            type = 2;
            title = '特训班报名';
        }
        this.state = {
            urls: {
                detailList: {
                    path: "/sign/" + this.pageType + "/detail-list",
                    title: title
                },
                classList: {
                    path: "/sign/" + this.pageType + "/class-list",
                    title: title
                },
                detail: {
                    path: "/sign/" + this.pageType + "/detail/:id",
                    title: title + '/报名明细'
                }
            },
            redirectPane: null,
            activeKey: props.match.path,
            type
        };
    }
    render(){
        let { urls, activeKey, redirectPane, type } = this.state;
        let { loadData, match, outputCSV } = this.props;
        let shouldRedirect = false;
        //this.currentPane动态创建并赋值，据此判断是否需要重定向
        if(redirectPane && redirectPane !== this.currentPane){
            shouldRedirect = true;
            this.currentPane = redirectPane;
        }
        let active = activeKey === urls.detailList.path ? activeKey : urls.classList.path;
        let title ;
        for (let k in urls){
            if(urls[k].path === activeKey){
                title = urls[k].title;
            }
        }
        return (
            <CommonPageComponent title={title} bordered={false}>
                <Tabs activeKey={active} onTabClick={(activeKey) => this.goToPane(activeKey)}>
                    <TabPane tab="按明细" key={urls.detailList.path}>
                        <Route path={urls.detailList.path} render={() => <DetailListComp type={type} loadData={loadData}/>} />
                    </TabPane>
                    <TabPane tab="按班级" key={urls.classList.path}>
                        <Route path={urls.classList.path} render={() => <ClassListComp pageType={this.pageType} loadData={loadData} outputCSV={outputCSV}/>}/>
                        <Route path={urls.detail.path} render={() => <DetailComp course_id={match.params.id} loadData={loadData} outputCSV={outputCSV}/>}/>
                    </TabPane>
                </Tabs>
                {shouldRedirect ? (<Redirect to={redirectPane} push={true}/>) : null}
            </CommonPageComponent>
        )
    }
    goToPane(pane){
        this.setState((prev) => {
            let ret = {
                activeKey: pane
            };
            if(prev.activeKey === pane){
                ret.redirectPane = pane;
                return ret;
            }
            //为了保留tabs切换时动画效果，延迟200ms跳转
            setTimeout(() => {
                this.setState({
                    redirectPane: pane
                });
            }, 200);
            return ret;
        });
    }
}
export default SignListTemplate;