import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, message, Spin } from 'antd';
import { InputComponent } from './components';
import { phoneValidator } from './utils';
import ERRORS from './config/errors';
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            params: {
                phone: '',
                passwd: ''
            },
            errors: {},
            loading: false,
            successLogin: false
        };
        this.settleErrors = this.settleErrors.bind(this);
        this.ableBtn = this.ableBtn.bind(this);
    }
    render(){
        const state = this.state;
        return (
            <div style={{display: 'flex',alignItems:'center',justifyContent:'center',minHeight:'inherit'}}>
                <section className="q-login">
                    <header className="q-login-header"/>
                    <form className="q-login-form">
                        <div className="q-form-group q-vertical">
                            <label className="q-form-label q-fw500">手机号码</label>
                            <div className="q-form-detail">
                                <InputComponent
                                    placeholder="请输入手机号码"
                                    autoComplete="off"
                                    value={state.phone}
                                    onChange={(e) => this.controlInput(e.target.value)}
                                    onBlur={(e) => this.blurInput(e.target.value)}
                                    error={state.errors.phone}
                                />
                            </div>
                        </div>
                        <div className="q-form-group q-vertical">
                            <label className="q-form-label q-fw500">密码</label>
                            <div className="q-form-detail">
                                <InputComponent
                                    placeholder="请输入密码"
                                    autoComplete="off"
                                    type="password"
                                    value={state.passwd}
                                    onChange={(e) => this.controlPassword(e.target.value)}
                                    onBlur={(e) => this.controlPassword(e.target.value)}
                                    error={state.errors.passwd}
                                />
                            </div>
                        </div>
                        <Spin spinning={state.loading}>
                            <div className="q-btn-group q-pdt12">
                                <Button type="primary" onClick={() => this.login()} disabled={this.ableBtn()}>登录</Button>
                            </div>
                        </Spin>
                        <footer className="q-login-footer">
                            <Link to="/forget">忘记密码？</Link>
                        </footer>
                    </form>
                </section>
                {state.successLogin ? <Redirect to="/course/regular/list" push={true}/> : null}
            </div>
        )
    }
    ableBtn(){
        return !phoneValidator.cell(this.state.params.phone) || !this.state.params.passwd;
    }
    settlePhone(phone, ing=false){
        if(!phone){
            this.settleErrors('phone', ERRORS.phone.required);
            return;
        }
        if(!phoneValidator.cell(phone, ing)){
            this.settleErrors('phone', ERRORS.phone.invalid);
        }else{
            this.settleErrors('phone', null);
        }
    }
    controlInput(value){
        this.settleParams('phone', value);
        this.settlePhone(value, true);
    }
    blurInput(value){
        this.settlePhone(value);
    }
    controlPassword(value){
        this.settleParams('passwd', value);
        if(!value){
            this.settleErrors('passwd', ERRORS.password.required);
        }else{
            this.settleErrors('passwd', null);
        }
    }
    login(){
        this.setState({
            loading: true
        });
        this.props.loadData('ADMIN-LOGIN', this.state.params).then((res) => {
            this.props.cookies.set('_p', this.state.params.phone);
            this.setState({
                successLogin: true
            });
        }, (res) => {
            this.setState({
                loading: false
            });
            let code = res.code;
            if(code === 1001){
                this.settleErrors('phone', ERRORS.phone.unregistered);
            }else if(code === 1002){
                this.settleErrors('passwd', ERRORS.password.wrong);
            }else{
                message.error(res.msg);
            }
        });
    }
    settleParams(type, value){
        let params = {};
        params[type] = value;
        this.setState(prev => {
            return {
                params: {
                    ...prev.params,
                    ...params
                }
            };
        });
    }
    settleErrors(type, msg){
        let errors = {};
        errors[type] = msg;
        this.setState(prevState => {
            return {
                errors: {
                    ...prevState.errors,
                    ...errors
                }
            }
        });
    }
}

export default Login;