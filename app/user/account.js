import React from 'react';
import CommonPage from '../templates/common-page';
import { Button, notification  } from 'antd';
import { Link } from 'react-router-dom';
import { CardComponent, CommonPageComponent, InputComponent } from '../components/index';
import { passwordValidator } from '../utils';
import ERROR from '../config/errors';
class UserAccount extends  CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                type: '2'
            },
            errors: {},
            repeatpasswd: ''
        };
    }
    render(){
        const { cookies } = this.props;
        const { params , errors } = this.state;
        return (
           <CommonPageComponent title="我的账号">
                <CardComponent title="账号信息">
                    <div className="q-pwd-modify">
                        <div className="q-form-group q-horizontal q-mrg-b25">
                            <label className="q-form-label q-align-right q-label">手机号码：</label>
                            <div className="q-form-detail">
                                <span>{cookies.get('_p') || '未登录'}</span>
                            </div>
                        </div>
                        <div className="q-form-group q-horizontal q-mrg-b25">
                            <label className="q-form-label q-align-right q-label ">角色：</label>
                            <div className="q-form-detail">
                                <span>培训运营</span>
                            </div>
                        </div>
                    </div>
                </CardComponent>
                <CardComponent title="修改密码">
                    <form className="q-pwd-modify">
                        <div className="q-form-group q-horizontal q-mrg-b25">
                            <label className="q-form-label q-align-right q-label">当前密码：</label>
                            <div className="q-form-detail">
                                <InputComponent
                                    tabIndex="1"
                                    type="password"
                                    placeholder="请输入当前账号密码"
                                    help={<span>如忘记密码，请<Link to="/forget" tabIndex="5">重置密码</Link></span>}
                                    error={errors.oldpasswd}
                                    onChange={(e) => this.controlOldPasswd(e.target.value)}
                                    onBlur={(e) => this.settleOldPasswdError(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="q-form-group q-horizontal q-mrg-b25">
                            <label className="q-form-label q-align-right q-label">新密码：</label>
                            <div className="q-form-detail">
                                <InputComponent
                                    tabIndex="2"
                                    type="password"
                                    placeholder="请输入新密码"
                                    help={<span>密码长度不少于6位</span>}
                                    error={errors.newpasswd}
                                    onChange={(e) => this.controlNewPasswd(e.target.value)}
                                    onBlur={(e) => this.settleNewPasswdError(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="q-form-group q-horizontal q-mrg-b25">
                            <label className="q-form-label q-align-right q-label">确认密码：</label>
                            <div className="q-form-detail">
                                <InputComponent
                                    tabIndex="3"
                                    type="password"
                                    placeholder="请再次输入新密码"
                                    error={errors.repeatpasswd}
                                    onChange={(e) => this.controlRepeatPasswd(e.target.value)}
                                    onBlur={(e) => this.settleRepeatPasswdError(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="q-form-group q-btn">
                            <Button type="primary" tabIndex="4" disabled={this.disabledBtn(this)} onClick={() => this.modify()}>确认</Button>
                        </div>
                    </form>
                </CardComponent>
           </CommonPageComponent>
        )
    }
    settleOldPasswdError(oldpasswd){
        if(!oldpasswd){
            this.settleErrors('oldpasswd', ERROR.password.oldRequired);
        }else{
            if(this.state.params.newpasswd){
                this.settleNewPasswdError(this.state.params.newpasswd,oldpasswd);
            }
            this.settleErrors('oldpasswd', null);
        }
    }
    controlOldPasswd(value){
        this.settleParams('oldpasswd', value);
        this.settleOldPasswdError(value);
    }
    settleNewPasswdError(newpasswd, oldpasswd){
        let old = oldpasswd || this.state.params.oldpasswd;
        if(!newpasswd){
            this.settleErrors('newpasswd', ERROR.password.newRequired);
        }else if(newpasswd === old){
            this.settleErrors('newpasswd', ERROR.password.repeat);
        }else{
            if(this.state.repeatpasswd){
                this.settleRepeatPasswdError(this.state.repeatpasswd, false, newpasswd);
            }
            this.settleErrors('newpasswd', null);
        }
    }
    controlNewPasswd(value){
        this.settleParams('newpasswd', value);
        this.settleNewPasswdError(value);
    }
    settleRepeatPasswdError(repeatpasswd, ing, newpasswd){
        if(!repeatpasswd){
            this.settleErrors('repeatpasswd', ERROR.repeatPasswd.required);
            return;
        }
        let newPasswd = newpasswd || this.state.params.newpasswd;
        if(!passwordValidator.repeat(newPasswd, repeatpasswd, ing)){
            this.settleErrors('repeatpasswd', ERROR.repeatPasswd.invalid);
        }else{
            this.settleErrors('repeatpasswd', null);
        }

    }
    controlRepeatPasswd(value){
        this.setState({
            repeatpasswd: value
        });
        this.settleRepeatPasswdError(value, true);
    }
    disabledBtn(that){
        const { params, repeatpasswd } = that.state;
        if(!params.oldpasswd || !params.newpasswd || params.oldpasswd === params.newpasswd) return true;
        if(!passwordValidator.repeat(params.newpasswd, repeatpasswd)) return true;
        return false;
    }
    modify(){
        this.props.loadData('ADMIN-MODIFY', this.state.params).then((res) => {
            notification.success({
                message: '修改密码成功',
                description: '成功修改密码后，下一次登录将需要使用新密码！'
            });
        }, (res) => {
            let code = res.code;
            if(code === 1002){
                this.settleErrors('oldpasswd', ERROR.password.wrong);
            }else{
                notification.error({
                    message: "修改密码失败",
                    description: "修改密码失败的原因可能是" + res.msg + '，您可以再次尝试修改密码或者联系网站管理员！'
                });
            }
        });
    }
}
export default UserAccount;
