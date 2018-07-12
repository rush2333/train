import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Spin, notification } from 'antd';
import { InputComponent } from './components';
import { phoneValidator, codeValidator, passwordValidator } from './utils';
import ERRORS from './config/errors';
class Forget extends React.Component{
    constructor(props){
        super(props);
        this.initCaptchaGroup = {
            value: '获取验证码',
            loading: false,
            ableBtn: true,
            second: 60
        };
        this.state = {
            captchaGroup: {
                ...this.initCaptchaGroup,
                disabled: true
            },
            errors:{},
            params: {
                type: '1'
            },
            repeatPasswd: '',
            forgetSuccess: false
        };
        this.settlePhone = this.settlePhone.bind(this);
        this.logout();//如果是忘记原先的密码，则需要先把已经登录的账号退出登录
    }
    render(){
        const state = this.state;
        const ableBtn = !(phoneValidator.cell(state.params.phone) && state.captchaGroup.ableBtn);
        return (
            <div style={{display: 'flex',alignItems:'center',justifyContent:'center',minHeight:'inherit'}}>
                <section className="q-forget">
                    <div className="q-forget-tips">
                        <h2>忘记密码？</h2>
                        <p>请输入您的手机账号，获取验证码；</p>
                        <p>根据验证码设置新密码。</p>
                    </div>
                    <div className="q-forget-container">
                        <form className="q-form q-forget-form">
                            <div className="q-form-group q-vertical">
                                <label className="q-form-label q-fw500">手机号码</label>
                                <div className="q-form-detail">
                                    <InputComponent
                                        placeholder="请输入手机号码"
                                        error={state.errors.phone}
                                        onChange={(e) => this.controlPhone(e.target.value)}
                                        onBlur={(e) => this.settlePhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="q-form-group q-vertical">
                                <label className="q-form-label q-fw500">验证码</label>
                                <div className="q-form-detail q-pd-r100">
                                    <InputComponent
                                        style={{width: '100%'}}
                                        placeholder="请输入验证码"
                                        error={state.errors.code}
                                        disabled={state.captchaGroup.disabled}
                                        onChange={(e) => this.controlCaptcha(e.target.value)}
                                        onBlur={e => this.settleCaptcha(e.target.value)}
                                    />
                                    <div className="q-captcha-btn">
                                        <Spin spinning={state.captchaGroup.loading}>
                                            <Button onClick={() => this.getCaptcha()} disabled={ableBtn} type="primary" >{state.captchaGroup.value}</Button>
                                        </Spin>
                                    </div>
                                </div>
                            </div>
                            <div className="q-form-group q-vertical">
                                <label className="q-form-label q-fw500">新密码</label>
                                <div className="q-form-detail">
                                    <InputComponent
                                        type="password"
                                        placeholder="请输入新密码"
                                        error={state.errors.passwd}
                                        onChange={(e) => this.controlPasswd(e.target.value)}
                                        onBlur={(e) => this.settlePasswdError(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="q-form-group q-vertical">
                                <label className="q-form-label q-fw500">确认密码</label>
                                <div className="q-form-detail">
                                    <InputComponent
                                        type="password"
                                        placeholder="请再次输入新密码"
                                        error={state.errors.repeatPasswd}
                                        onChange={(e) => this.controlRepeatPasswd(e.target.value)}
                                        onBlur={(e) => this.settleRepeatPasswdError(e.target.value, false)}
                                    />
                                </div>
                            </div>
                            <div className="q-btn-group q-pdt12">
                                <Button type="primary" disabled={this.disabledForgetBtn()} onClick={() => this.forget()}>确认设置</Button>
                            </div>
                            <footer className="q-forget-footer">
                                <Link to="/login">返回登录>></Link>
                            </footer>
                        </form>
                    </div>
                </section>
                {state.forgetSuccess ? (<Redirect to="/login"/>):null}
            </div>
        )
    }
    settlePhone(value, ing){
        if(!value){
            this.settleErrors('phone', ERRORS.phone.required);
            return ;
        }
        if(!phoneValidator.cell(value, ing)){
            this.settleErrors('phone', ERRORS.phone.invalid);
        }else{
            this.settleErrors('phone', null);
        }
    }
    controlPhone(value){
        this.settleParams('phone', value);
        this.settlePhone(value, true);
    }
    settleCaptcha(value, ing){
        if(!value){
            this.settleErrors('code', ERRORS.code.required);
            return;
        }
        if(!codeValidator(value,ing)){
            this.settleErrors( 'code',ERRORS.code.invalid);
        }else{
            this.settleErrors( 'code', null);
        }
    }
    controlCaptcha(value){
        this.settleParams('code', value);
        this.settleCaptcha(value, true);
    }
    getCaptcha(){
        let code_id = (new Date()).getTime();
        this.settleParams('code_id', code_id);
        this.settleCaptchaGroup('ableBtn', false);
        this.props.loadData('SERVICE-CAPTCHA', {
            phone: this.state.params.phone,
            code_id: code_id
        }).then((res) => {
            this.settleCaptchaGroup('disabled', false);
            this.nextCaptcha();
        }, (res) => {
            this.settleErrors('code',res.msg);
            this.settleCaptchaGroup('ableBtn', true);
        });
    }
    nextCaptcha(){
        this.timer = setInterval(() => {
            this.setState(prev => {
                let updateSecond = prev.captchaGroup.second - 1;
                return {
                    captchaGroup: {
                        ...prev.captchaGroup,
                        second: updateSecond,
                        value: updateSecond + '秒'
                    }
                }
            },() => {
                if(this.state.captchaGroup.second <= 1){
                    clearInterval(this.timer);
                    this.setState(prev => {
                        return {
                            captchaGroup: {
                                ...prev.captchaGroup,
                                ...this.initCaptchaGroup
                            }
                        }
                    });
                }
            });
        }, 1000);
    }
    settlePasswdError(value){
        if(!value){
            this.settleErrors('passwd', ERRORS.password.required);
        }else{
            this.settleErrors('passwd', null);
        }
    }
    controlPasswd(value){
        this.settleParams('passwd', value);
        this.settlePasswdError(value);
    }
    settleRepeatPasswdError(value, ing){
        if(!value){
            this.settleErrors('repeatPasswd', ERRORS.repeatPasswd.required);
            return;
        }
        if(passwordValidator.repeat(this.state.params.passwd, value, ing)){
            this.settleErrors('repeatPasswd', null);
        }else{
            this.settleErrors('repeatPasswd', ERRORS.repeatPasswd.invalid);
        }

    }
    controlRepeatPasswd(value){
        this.setState({
            repeatPasswd: value
        });
        this.settleRepeatPasswdError(value, true);
    }
    forget(){
        this.props.loadData('ADMIN-MODIFY', this.state.params).then((res) => {
            notification.success({
                message: "修改密码成功",
                description: '成功修改密码后，需要重新登录才可以获得更好的服务，已自动为你跳转到登录界面！',
                key: 'modifySuccess'
            });
            this.setState({
                forgetSuccess: true
            });
        }, (res) => {
            let code = res.code;
            if(code === 1008){
                this.settleErrors('code', ERRORS.code.outdated);
            }else if(code === 1009){
                this.settleErrors('code', ERRORS.code.wrong);
            }else{
                notification.error({
                    message: "修改密码失败",
                    description: '修改密码失败的原因可能是' + res.msg + '，您可以再次尝试修改密码或者联系网站管理员！',
                    key: 'modifyFail'
                });
            }
        });
    }
    logout(){
        const { loadData, cookies } = this.props;
        loadData('ADMIN-LOGOUT', {
            phone: cookies.get('_p')
        }, () => {
            cookies.remove('_p');
        });
    }
    disabledForgetBtn(){
        let { params, repeatPasswd } = this.state;
        return !(phoneValidator.cell(params.phone) && codeValidator(params.code) && passwordValidator(params.passwd, repeatPasswd))
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
            }
        });
    }
    settleErrors(type, msg){
        let errors = {};
        errors[type] = msg;
        this.setState(prev => {
            return {
                errors: {
                    ...prev.errors,
                    ...errors
                }
            }
        });
    }
    settleCaptchaGroup(type, msg){
        let captcha = {};
        captcha[type] = msg;
        this.setState(prev => {
            return {
                captchaGroup: {
                    ...prev.captchaGroup,
                    ...captcha
                }
            };
        });
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
}

export default Forget;