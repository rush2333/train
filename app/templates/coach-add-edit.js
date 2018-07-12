import React from 'react';
import { Redirect } from 'react-router-dom';
import CommonPage from './common-page';
import { Avatar, Select, Button } from 'antd';
import { CommonPageComponent, InputComponent, AvatarSettingComponent,FormComponent } from '../components';
const { Option } = Select;
import ERRORS from '../config/errors';
import phoneValidator from "../utils/phone-validator";
class CoachTemplate extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                name: '',
                sex: '1',
                phone: '',
                grade: '1',
                description: ''
            },
            errors: {},
            visible: false,
            imgSrc: '',
            goBack: false,
            renewImg: false
        }
    }
    render(){
        const { visible, imgSrc, params, errors, goBack } = this.state;
        const footerConfig = {
            ok: {
                value: "确定",
                disabled: this.disabledBtn(),
                onClick: () => this.ensureSetting()
            },
            cancel: {
                value: '取消',
                onClick: () => this.goBack()
            }
        };
        const { title } = this.pageConfig;
        return (
            <CommonPageComponent title='教练管理' pageFooter={footerConfig}>
                <section className="q-section">
                    <h3 className="q-section-title">{title}</h3>
                    <div className="q-section-body">
                        <FormComponent direction="vertical" labelWidth="150px">
                            <FormComponent.Group label="头像" >
                                <div className="q-select-button">
                                    <Button onClick={() => this.selectImg()}>选择图片</Button>
                                </div>
                                <div className="q-select-preview">
                                    <div className="q-select-content">
                                        <Avatar size="large" shape="square" src={imgSrc}/>
                                    </div>
                                </div>
                            </FormComponent.Group>
                            <FormComponent.Group label="姓名" >
                                <InputComponent
                                    placeholder="请输入教练姓名"
                                    error={errors.name}
                                    value={params.name}
                                    onChange={(e) => this.controlName(e.target.value)}
                                    onBlur={(e) => this.settleNameError(e.target.value)}
                                />
                            </FormComponent.Group>
                            <FormComponent.Group label="性别" >
                                <Select
                                    style={{width: '100%'}}
                                    value={params.sex}
                                    onChange={(value) => this.settleParams('sex', value)}
                                >
                                    <Option value="1">男</Option>
                                    <Option value="2">女</Option>
                                </Select>
                            </FormComponent.Group>
                            <FormComponent.Group label="手机号码" >
                                <InputComponent
                                    placeholder="请输入手机号码"
                                    error={errors.phone}
                                    value={params.phone}
                                    onChange={(e) => this.controlPhone(e.target.value)}
                                    onBlur={(e) => this.settlePhoneError(e.target.value)}
                                />
                            </FormComponent.Group>
                            <FormComponent.Group label="级别" >
                                <Select
                                    style={{width: '100%'}}
                                    value={params.grade}
                                    onChange={(v) => this.settleParams('grade', v)}
                                >
                                    <Option value="1">主教</Option>
                                    <Option value="2">助教</Option>
                                </Select>
                            </FormComponent.Group>
                            <FormComponent.Group label="个人简介" >
                                <InputComponent
                                    placeholder="请输入个人相关简介"
                                    help="不多于15个汉字"
                                    maxLength="15"
                                    value={params.description}
                                    onChange={(e) => this.settleParams('description', e.target.value)}
                                />
                            </FormComponent.Group>
                        </FormComponent>
                    </div>
                </section>
                <AvatarSettingComponent visible={visible} closeModal={() => this.closeModal()} getBase64={(base64) => this.getBase64(base64)}/>
                {goBack ? <Redirect to="/manage/coach/list" push={true}/> : null}
            </CommonPageComponent>
        )
    }
    disabledBtn(){
        let { params } = this.state;
        return !(!!params.header_url && !!params.name && phoneValidator.cell(params.phone));
    }
    goBack(){
        this.setState({
            goBack: true
        });
    }
    ensureSetting(){}
    selectImg(){
        this.setState({
            visible: true
        });
    }
    closeModal(){
        this.setState({
            visible: false
        });
    }
    getBase64(base64){
        let reg = new RegExp('^data:image/png;base64,');
        let header_url = base64.replace(reg, '');
        this.setState({
            imgSrc: base64,
            renewImg: true
        });
        this.settleParams('header_url', header_url);
    }
    settleNameError(value){
        if(!value){
            this.settleErrors('name',  ERRORS.coachName.required);
        }else {
            this.settleErrors('name', null);
        }
    }
    controlName(value){
        this.settleParams('name', value);
        this.settleNameError(value);
    }
    controlPhone(value){
        this.settleParams('phone', value);
        this.settlePhoneError(value, true);
    }
}

export default CoachTemplate;