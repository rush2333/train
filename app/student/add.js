import React from 'react';
import CommonPage from '../templates/common-page';
import { Redirect } from 'react-router-dom';
import { DatePicker, Modal, Select, message, InputNumber, notification, Button} from 'antd';
import moment from 'moment';
import { InputComponent, FormComponent } from '../components';
import ERRORS from '../config/errors';
import { moneyFormator, phoneValidator } from '../utils';
import settleParams from '../helpers/settle-params';
import settleErrors from '../helpers/settle-errors';
const { OptGroup, Option } = Select;
class StudentAdd extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            errors: {},
            params: {
                gender: '1',
                birthday: moment('1990-01-01')
            },
            back: false,
            courseList: {
                '平时班': [],
                '特训班': []
            },
            countList: [],
            disabled: true
        }
    }
    render(){
        const { params, back, courseList, errors, countList, disabled } = this.state;
        return (
            <Modal
                visible={true}
                title="新增学员"
                width={700}
                maskClosable={false}
                confirmLoading={true}
                onCancel={() => this.goBack()}
                footer={
                    <span>
                        <Button onClick={() => this.goBack()}>取消</Button>
                        <Button type='primary' disabled={this.disabledBtn() && disabled} onClick={() => this.addStudent()}>确定</Button>
                    </span>
                }
            >
                <div className="q-flex q-flex-center">
                    <FormComponent direction="vertical" labelWidth="80px">
                        <FormComponent.Group label="学员姓名">
                            <InputComponent
                                placeholder="请输入学员姓名"
                                error={errors.real_name}
                                onChange={(e) => this.controlRealNameParams(e.target.value)}
                                onBlur={(e) => this.controlRealNameError(e.target.value)}
                            />
                        </FormComponent.Group>
                        <FormComponent.Group label="学员性别">
                            <Select
                                style={{width: '100%'}}
                                defaultValue={params.gender}
                                onChange={(value) => this.settleParams('gender', value)}
                            >
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                        </FormComponent.Group>
                        <FormComponent.Group label="出生日期">
                            <DatePicker
                                style={{width: '100%'}}
                                defaultValue={params.birthday}
                                showToday={false}
                                allowClear={false}
                                onChange={date => this.settleParams('birthday', date)}
                            />
                        </FormComponent.Group>
                        <FormComponent.Group label="手机号码">
                            <InputComponent
                                placeholder="请输入手机号码"
                                error={errors.phone}
                                onChange={(e) => this.controlPhoneParams(e.target.value)}
                                onBlur={(e) => this.controlPhoneError(e.target.value)}
                            />
                        </FormComponent.Group>
                        <FormComponent.Group label="报名课程">
                            <Select
                                style={{width: '100%'}}
                                placeholder="请选择学员报名课程"
                                onSelect={value => this.controlCourseParams(value)}
                            >
                                {Object.keys(courseList).map((k, i) => (
                                    <OptGroup key={i} label={k}>
                                        {courseList[k].map((course, idx) => (
                                            <Option key={idx}
                                                title={course.msg}
                                                value={'' + course.id}
                                            >{course.msg}</Option>
                                        ))}
                                    </OptGroup>
                                ))}
                            </Select>
                        </FormComponent.Group>
                        <FormComponent.Group label="报名节数">
                            <Select
                                style={{width: '100%'}}
                                placeholder="请选择报名的课程节数"
                                value={params.count}
                                onChange={(value) => this.controlCountParams(value)}
                            >
                                {countList.map(count => <Option value={count} key={count} title={count}>{count}</Option>)}
                            </Select>
                        </FormComponent.Group>
                        <FormComponent.Group label="报名费用">
                            <InputComponent
                                placeholder="请输入报名费用"
                                error={errors.cost}
                                onChange={(e) => this.controlCostParams(e.target.value)}
                                onBlur={(e) => this.controlCostError(e.target.value)}
                            />
                        </FormComponent.Group>
                    </FormComponent>
                </div>
                {back ? <Redirect to="/manage/student/list" push={true}/> : null}
            </Modal>
        )
    }
    componentDidMount(){
        this.getCourseList();
    }
    addStudent(){
        let params = this.state.params;
        let post = {
            ...params,
            birthday: moment(params.birthday).format('YYYY-MM-DD'),
            cost: parseFloat(params.cost) * 100
        };
        this.setState({
            disabled: true
        });
        this.props.loadData('MANAGE-STUDENT-ADDSTUDENT', post).then((res) => {
            this.goBack();
        }, (res) => {
            message.error(res.msg);
            this.setState({
                disabled: false
            });
        });
    }
    getCourseList(){
        this.props.loadData('MANAGE-STUDENT-COURSELIST').then((res) => {
            let content = res.content;
            let courseList = {
                '平时班': [],
                '特训班': []
            };
            content.map(item => {
                let course_time = item.course_time.replace(/(\d{2}:\d{2})(:\d{2})/g, (match, p1) => {
                    return p1;
                });
                item.msg = item.id_sub + ' ' + item.name + ' ' + course_time;
                if(parseInt(item.type) === 2){
                    courseList['特训班'].push(item);
                }else{
                    courseList['平时班'].push(item);
                }
            });
            this.setState({
                courseList: courseList
            })
        }, (res) => {
            this.setState({
                courseList: {
                    '平时班': [],
                    '特训班': []
                }
            })
        });
    }
    controlRealNameParams(value){
        this.settleParams('real_name', value);
        this.controlRealNameError(value);
    }
    controlRealNameError(value){
        let err = null;
        if(!value){
            err = ERRORS.studentName.required;
        }
        this.settleErrors('real_name', err);
        return !err;
    }
    controlPhoneParams(value){
        this.settleParams('phone', value);
        this.controlPhoneError(value, true);
    }
    controlPhoneError(value, isInputing){
        let err = null;
        if(!value){
            err = ERRORS.phone.required;
        }else{
            if(!phoneValidator.cell(value, isInputing)){
                err = ERRORS.phone.invalid;
            }
        }
        this.settleErrors('phone', err);
        return !err;
    }
    controlCourseParams(value){
        this.settleParams('course_id', value);
        this.controlCourseError(value);
        this.setCount(parseInt(value));
    }
    controlCourseError(value){
        let err = null;
        if(!value){
            err = ERRORS.courseID.required;
        }
        this.settleErrors('course_id', err);
        return !err;
    }
    //根据选择的课程设置可选节数,设定课程类型
    setCount(course_id){
        const { courseList } = this.state;
        let ret = [] , type;
        courseList['平时班'].forEach(course => {
            if(course.id === course_id){
                type = course.type;
                ret.push('' + course.count_standard);
            }
        });
        courseList['特训班'].forEach(course => {
            if(course.id === course_id){
                type = course.type;
                for(let start = parseInt(course.count_less); start <= parseInt(course.count_standard); start++){
                    ret.push('' + start);
                }
            }
        });
        this.setState(prev => {
            return {
                params: {
                    ...prev.params,
                    count: ret[0],
                    type: type
                },
                countList: ret
            }
        });
    }
    controlCountParams(value){
        this.settleParams('count', value);
    }
    controlCostParams(value){
        this.settleParams('cost', value);
        this.controlCostError(value);
    }
    controlCostError(value){
        let err = null;
        if(!value){
            err = ERRORS.cost.required;
        }else if(!moneyFormator.deal(value)){
            err = ERRORS.cost.number;
        }
        this.settleErrors('cost', err);
        return !err;
    }
    disabledBtn(){
       const { real_name, phone, course_id, count, cost }  = this.state.params;
       if(real_name && phoneValidator.cell(phone) && course_id && count && moneyFormator.deal(cost)){
            return false;
       }
       return true;
    }
    goBack(){
        this.setState({
            back: true
        });
    }
}
StudentAdd.prototype.settleParams = settleParams;
StudentAdd.prototype.settleErrors = settleErrors;
export default StudentAdd;