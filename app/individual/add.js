import React from 'react';
import CommonPage from '../templates/common-page';
import { Redirect } from 'react-router-dom';
import { DatePicker, Modal, Select, message, InputNumber, notification, Button} from 'antd';
import moment from 'moment';
import { InputComponent, FormComponent } from '../components';
import ERRORS from '../config/errors';
import { moneyFormator, phoneValidator } from '../utils';
const { Option } = Select;
class IndividualCourseAdd extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            errors: {},
            params: {
                sex: '1',
                birth_day: '1990-01-01',
                description: ''
            },
            back: false,
            coachList: []
        }
    }
    render(){
        const { params, back, coachList, errors } = this.state;
        const disabled = this.disabledBtn();
        return (
            <Modal
                visible={true}
                title="新增单教"
                width={700}
                maskClosable={false}
                confirmLoading={true}
                onCancel={() => this.goBack()}
                footer={
                    <span>
                        <Button onClick={() => this.goBack()}>取消</Button>
                        <Button type='primary' disabled={disabled} onClick={() => this.addIndividualCourse()}>确定</Button>
                    </span>
                }
            >
                <div className="q-flex q-flex-center">
                    <FormComponent direction="vertical" labelWidth="80px">
                        <FormComponent.Group label="学员姓名">
                            <InputComponent
                                placeholder="请输入学员姓名"
                                error={errors.name}
                                onChange={(e) => this.controlName(e.target.value)}
                                onBlur={(e) => this.settleNameError(e.target.value)}
                            />
                        </FormComponent.Group>
                        <FormComponent.Group label="学员性别">
                            <Select
                                style={{width: '100%'}}
                                defaultValue={params.sex}
                                onChange={(value) => this.settleParams('sex', value)}
                            >
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                        </FormComponent.Group>
                        <FormComponent.Group label="出生日期">
                            <DatePicker
                                style={{width: '100%'}}
                                defaultValue={moment(params.birth_day)}
                                showToday={false}
                                allowClear={false}
                                onChange={(date, dateString) => this.settleParams('birth_day', dateString)}
                            />
                        </FormComponent.Group>
                        <FormComponent.Group label="手机号码">
                            <InputComponent
                                placeholder="请输入手机号码"
                                error={errors.phone}
                                onChange={(e) => this.controlPhone(e.target.value)}
                                onBlur={(e) => this.settlePhoneError(e.target.value)}
                            />
                        </FormComponent.Group>
                        <FormComponent.Group label="报名费用">
                            <InputComponent
                                placeholder="请输入报名费用"
                                error={errors.cost}
                                onChange={(e) => this.controlCost(e.target.value)}
                                onBlur={(e) => this.settleCostError(e.target.value)}
                            />
                        </FormComponent.Group>
                        <FormComponent.Group label="所属教练">
                            <Select
                                style={{width: '100%'}}
                                placeholder="请选择教练"
                                onChange={(value) => this.controlTrainer(value)}
                            >
                                {coachList.map((coach, index) => <Option key={index} value={'' + coach.trainer_id}>{coach.name}</Option>)}
                            </Select>
                        </FormComponent.Group>
                        <FormComponent.Group label="备注">
                            <InputComponent
                                placeholder="请输入备注"
                                help="不多于15字"
                                maxLength="15"
                                onChange={(e) => this.settleParams('description', e.target.value)}
                            />
                        </FormComponent.Group>
                    </FormComponent>
                </div>
                {back ? <Redirect to="/course/individual/list" push={true}/> : null}
            </Modal>
        )
    }
    componentDidMount(){
        if(this.state.coachList.length === 0){
            this.getCoachList();
        }
    }
    settleNameError(value){
        if(!value){
            this.settleErrors('name', ERRORS.studentName.required);
            return;
        }
        this.settleErrors('name', null);
    }
    controlName(value){
        this.settleParams('name', value);
        this.settleNameError(value);
    }
    controlPhone(value){
        this.settleParams('phone', value);
        this.settlePhoneError(value, true);
    }
    controlTrainer(value){
        this.settleParams('trainer_id', value);
    }
    goBack(){
        this.setState({
            back: true
        });
    }
    disabledBtn(){
        const { name, sex, birth_day, phone, cost, trainer_id, description } = this.state.params;
        // console.log('name', !!name);
        // console.log('phone', phoneValidator.cell(phone));
        // console.log('cost', !!cost);
        // console.log('trainer_id', !!trainer_id);
        return !(name && phoneValidator.cell(phone) && cost && trainer_id);
    }
    getCoachList(){
        this.props.loadData('MANAGE-COACH-GETLIST').then((res) => {
            this.setState({
                coachList: res.content
            });
        }, (res) => {

        });
    }
    shouldPost(){

    }
    addIndividualCourse(){
        this.props.loadData('COURSE-SINGLE-ADD', this.state.params).then((res) => {
            this.goBack();
        }, (res) => {
            notification.error({
                message: '新增单教失败',
                description: '新增单教失败的原因可能是' + res.msg + '，您可以再次尝试新增单教或者联系网站管理员！'
            })
        });
    }
    settleCostError(value){
        if(!value){
            this.settleErrors('cost', ERRORS.cost.required);
            return;
        }else if(!moneyFormator.deal(value)){
            this.settleWarnings(ERRORS.cost.deal);
        }
        this.settleParams('cost', null);
    }
    settleCostError(value){
        if(!value){
            this.settleErrors('cost', ERRORS.cost.required);
        }else if(moneyFormator.deal(value)){
            this.settleErrors('cost', null);
        }else{
            this.settleErrors('cost', ERRORS.cost.number);
        }
    }
    controlCost(value){
        this.settleParams('cost', value);
        this.settleCostError(value);
    }
    settleWarnings(msg){
        message.warning({
            content: msg
        });
    }
}

export default IndividualCourseAdd;