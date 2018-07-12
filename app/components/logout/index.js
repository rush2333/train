import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Icon, Modal, notification } from 'antd';
const confirm = Modal.confirm;
import Fetch from '../../helpers/fetch';
import API from '../../config/api';
class Logout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            params: {
                phone:  props.cookies.get('_p')
            },
            logoutSuccess: false
        }
    }
    render(){
        const state = this.state;
        return (
            <div className="q-header-logout">
                <Button type="dashed" ghost onClick={() => this.logout()}>
                    <Icon type="logout" />退出
                </Button>
                {state.logoutSuccess ? <Redirect to="/login" push={true}/> : null}
            </div>
        )
    }
    logout(){
        const that = this;
        confirm({
            title: '您正在进行退出登录操作',
            content: '是否确认退出？',
            onOk: () => {
                Fetch.post(API['ADMIN-LOGOUT'], this.state.params).then((res) => {
                    that.props.cookies.remove('_p');
                    this.setState({
                        logoutSuccess: true
                    });
                    if(res.code !== 1){
                        notification.error({
                            message: "退出登录失败",
                            description: '退出登录失败的原因可能是' + res.msg + '，为了给你提供更好的服务，自动跳转到登录界面，你可在登录之后继续享受我们为您提供的服务！',
                            key: 'logoutFail'
                        });
                    }
                }, (res) => {


                });
            }
        });
    }
}
export default Logout;