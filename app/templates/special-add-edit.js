import React from 'react';
import CommonPage from '../templates/common-page';
import { Redirect } from 'react-router-dom';
import { Checkbox, TimePicker,DatePicker , Select, Cascader,message   } from 'antd';
import { CommonPageComponent, StepsComponent, TabsComponent, PhoneComponent,InputComponent, FormComponent,MapComponent,RichTextComponent } from '../components';
import { weeks } from "../config/CONSTANT";
import moment from 'moment';
import addressOptions from '../config/cascader-address-options';
import "../../css/supplement.css";
import ERROR from '../config/errors';
import { numberValidator, moneyFormator, phoneValidator } from '../utils';
const CheckBoxGroup = Checkbox.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class SpecialCourseAddEditTemplate extends CommonPage {
    constructor(props){
        super(props);
        this.state = {
            activeKey: 0,
            inputElement: null,
            params: {
                name: '',
                area: ['广东省', '广州市', '天河区'],
                address: '',
                longitude: '113.34234',
                latitude: '23.17072',
                cycle: ['0', '1','2','3','4','5','6'],
                course_detail: [{
                    course_begin: '08:00',
                    course_end: null
                }],
                tel: '',
                count_standard: '',
                count_less:'',
                cost: '',
                regi_begin: moment(),
                regi_end: moment()
            },
            errors: {},
            coachList: [],
            okValue: '下一步',
            cancelValue: '取消',
            goBack: false,
            disabled: false,
            text: '',
            selectedTimeList: []
        };
        this.labelWidth = '120px';
    }
    render(){
        const { params, errors, activeKey,disabled, coachList, okValue, cancelValue, goBack, selectedTimeList } = this.state;
        const footerConfig = {
            ok: {
                value: okValue,
                disabled: this.disabledBtn() && !disabled,
                onClick: () => {
                    if(activeKey === 0){
                        this.setState({
                            activeKey: 1,
                            okValue: '确定',
                            cancelValue: '上一步'
                        });
                    }else{
                        this.ensureSetting();
                    }
                }
            },
            cancel: {
                value: cancelValue,
                onClick: () => {
                    if(activeKey === 0){
                        this.goBack();
                    }else{
                        this.setState({
                            activeKey: 0,
                            okValue: '下一步',
                            cancelValue: '取消'
                        });
                    }
                }
            }
        };
        let wDetails = params.cycle.map(c => weeks[c].label).join('、');
        let tDetails = params.course_detail.map(t => t.course_begin + '-' + t.course_end).join(' ');
        let pageConfig = this.pageConfig;
        return (
            <CommonPageComponent table={false} className="q-sub-page" title={pageConfig.title} pageFooter={footerConfig}>
                <StepsComponent current={activeKey}>
                    <StepsComponent.Item>1.基础信息</StepsComponent.Item>
                    <StepsComponent.Item>2.课程详情</StepsComponent.Item>
                </StepsComponent>
                <div className="q-pane">
                    <PhoneComponent className="q-pane-phone"
                        data={{
                            title: params.name,
                            classTime: wDetails + tDetails,
                            registerTime: null,
                            cost: params.cost,
                            tel: params.tel,
                            address: params.area.join('') + params.address,
                            description: params.description
                        }}
                    />
                    <div className="q-pane-rest q-mrg-l15">
                        <TabsComponent activeKey={activeKey + ''}>
                            <TabsComponent.TabPane tab="基础信息" key="0">
                                <section className="q-sub-section">
                                    <h3 className="q-sub-section-title">基础信息</h3>
                                    <div className="q-sub-section-main">
                                        <FormComponent direction="vertical" labelWidth={this.labelWidth}>
                                            <FormComponent.Group label="课程名称">
                                                <InputComponent
                                                    placeholder="请输入课程名称"
                                                    maxLength="15"
                                                    help="课程名称长度不能长于15个字"
                                                    error={errors.name}
                                                    value={params.name}
                                                    onChange={(e) => this.controlName(e.target.value)}
                                                    onBlur={(e) => this.settleNameError(e.target.value)}
                                                />
                                            </FormComponent.Group>
                                            <FormComponent.Group label="上课时间" marginBottom='0'>
                                                <div className="q-multiline">
                                                    <CheckBoxGroup
                                                        size="small"
                                                        value={params.cycle}
                                                        onChange={checkedValue => this.controlCycle(checkedValue)}>
                                                        {weeks.map((item) => (
                                                            <Checkbox size="small" value={'' + item.value} key={item.value}>{item.label}</Checkbox>
                                                        ))}
                                                    </CheckBoxGroup>
                                                    <CheckBoxGroup
                                                        value={selectedTimeList}
                                                        onChange={checkedValue => this.controlDeleteTime(checkedValue)}
                                                    >
                                                    {params.course_detail.map((detail, i) => (
                                                        <div className="q-timepicker-group" key={i}>
                                                            <Checkbox value={'' + i} key={i}>
                                                                <TimePicker
                                                                    disabled={!!detail.detail_id}
                                                                    format='HH:mm'
                                                                    defaultOpenValue={detail.course_begin?moment(detail.course_begin, 'HH:mm'):moment(detail.course_end, 'HH:mm')}
                                                                    value={detail.course_begin ? moment(detail.course_begin, 'HH:mm'):null}
                                                                    onChange={(time) => this.controlTimeList(i, 'course_begin', time)}
                                                                />
                                                                <span className="q-short-dash">-</span>
                                                                <TimePicker
                                                                    disabled={!!detail.detail_id}
                                                                    format='HH:mm'
                                                                    defaultOpenValue={detail.course_end?moment(detail.course_end, 'HH:mm'):moment(detail.course_begin, 'HH:mm')}
                                                                    value={detail.course_end ? moment(detail.course_end, 'HH:mm') : null}
                                                                    onChange={(time) => this.controlTimeList(i, 'course_end', time)}
                                                                />
                                                            </Checkbox>
                                                        </div>
                                                    ))}
                                                    </CheckBoxGroup>
                                                    <div className="q-timepicker-add">
                                                        {params.course_detail.length < 4 ? (
                                                            <a onClick={() => this.addTimeList()} >添加时间段</a>
                                                        ):null}
                                                        {params.course_detail.length > 1 ? (
                                                            <a onClick={() => this.deleteTimeList()}>删除时间段</a>
                                                        ):null}
                                                    </div>
                                                </div>
                                            </FormComponent.Group>
                                            <FormComponent.Group label="报名时间">
                                                <RangePicker
                                                    style={{width: '100%'}}
                                                    showTime={{ format: 'HH:mm' }}
                                                    format="YYYY-MM-DD HH:mm"
                                                    value={[params.regi_begin, params.regi_end]}
                                                    onChange={(dates) => this.controlRegi(dates)}
                                                />
                                            </FormComponent.Group>
                                            <FormComponent.Group label="上课区域" >
                                                <Cascader
                                                    placeholder="请选择上课球馆所在区域"
                                                    style={{width: '100%'}}
                                                    options={addressOptions}
                                                    allowClear={false}
                                                    value={params.area}
                                                    onChange={(value) => this.controlBigAddress(value)}
                                                />
                                            </FormComponent.Group>
                                            <FormComponent.Group label="上课区域">
                                                <InputComponent
                                                    placeholder="请输入上课球馆的详细地址"
                                                    autoComplete="off"
                                                    wrapRef={(r) => this.getInputRef(r)}
                                                    value={params.address}
                                                    onChange={(e) => this.controlSmallAddress(e.target.value)}
                                                    onBlur={(e) => this.controlSmallAddress(e.target.value)}
                                                />
                                            </FormComponent.Group>
                                        </FormComponent>
                                        <div className="q-map-container">
                                            <MapComponent
                                                getLatLng={(latLng) => this.updateLatLng(latLng)}
                                                getSmallAddress={(address) => this.settleParams('address', address)}
                                                lat={params.latitude} lng={params.longitude} bigAddress={params.area.join('')} inputElement={this.state.inputElement}/>
                                        </div>
                                    </div>
                                </section>
                                <section className="q-sub-section">
                                    <h3 className="q-sub-section-title">其他信息</h3>
                                    <div className="q-sub-section-main">
                                        <FormComponent direction="vertical" labelWidth={this.labelWidth}>
                                            <FormComponent.Group label="报名费用">
                                                <InputComponent
                                                    placeholder="请输入报名费用"
                                                    help="小数点后保留2位，如：33.33。单位：元。"
                                                    error={errors.cost}
                                                    value={params.cost}
                                                    onChange={(e) => this.controlCost(e.target.value)}
                                                    onBlur={(e) => this.settleCostError(e.target.value)}
                                                />
                                            </FormComponent.Group>
                                            <FormComponent.Group label="标准课程节数">
                                                <InputComponent
                                                    placeholder="请输入课程节数"
                                                    help="输入整数，如：10"
                                                    error={errors.count_standard}
                                                    value={params.count_standard}
                                                    onChange={(e) => this.controlCountStandard(e.target.value)}
                                                    onBlur={(e) => this.settleCountStandardError(e.target.value)}
                                                />
                                            </FormComponent.Group>
                                            <FormComponent.Group label="最少课程节数">
                                                <InputComponent
                                                    placeholder="请输入学生可以报名的最少节数"
                                                    help="输入整数，如：10。不可以大于标准课程节数"
                                                    error={errors.count_less}
                                                    value={params.count_less}
                                                    onChange={(e) => this.controlLessCount(e.target.value)}
                                                    onBlur={(e) => this.settleCountLessError(e.target.value)}
                                                />
                                            </FormComponent.Group>
                                            <FormComponent.Group label="咨询电话">
                                                <InputComponent
                                                    placeholder="请输入联系电话"
                                                    error={errors.phone}
                                                    value={params.tel}
                                                    onChange={(e) => this.controlPhone(e.target.value)}
                                                    onBlur={(e) => this.settlePhoneError(e.target.value)}
                                                />
                                            </FormComponent.Group>
                                            <FormComponent.Group label="带班主教">
                                                <Select
                                                    placeholder="请选择带班主教"
                                                    style={{width: '100%'}}
                                                    value={params.trainer_id}
                                                    onChange={(value) => this.settleParams('trainer_id', value)}
                                                >
                                                    {coachList.map((c, i) => <Option value={'' + c.trainer_id} key={'' + c.trainer_id}>{c.name}</Option>)}
                                                </Select>
                                            </FormComponent.Group>
                                        </FormComponent>
                                    </div>
                                </section>
                            </TabsComponent.TabPane>
                            <TabsComponent.TabPane tab="课程详情" key="1">
                                <section className="q-sub-section">
                                    <h3 className="q-sub-section-title">课程详情</h3>
                                    <div className="q-sub-section-main">
                                        <RichTextComponent maxLength={500} text={this.state.text} getText={(html) => this.controlDescription(html)}/>
                                    </div>
                                </section>
                            </TabsComponent.TabPane>
                        </TabsComponent>
                    </div>
                </div>
                {goBack ? <Redirect to='/course/special/list' push={true}/> : null}
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getCoachList();
    }
    goBack(){
        this.setState({
            goBack: true
        });
    }
    ensureSetting(){}
    settleNameError(value){
        if(!value){
            this.settleErrors('name', ERROR.courseName.required);
        }else{
            this.settleErrors('name', null);
        }
    }
    controlName(value){
        this.settleParams('name', value);
        this.settleNameError(value);
    }
    controlCycle(checkedValue){
        if(!checkedValue.length){
            message.warning('至少要选一个');
        }else{
            this.settleParams('cycle', checkedValue);
        }
    }
    controlDeleteTime(checkedValue){
        this.setState({
            selectedTimeList: checkedValue
        });
    }
    controlTimeList(index, type, time){
        this.setState(prev => {
            let details = [...prev.params.course_detail];
            details[index][type] = time ? time.format('HH:mm'):null;
            return {
                params: {
                    ...prev.params,
                    course_detail: details
                }
            }
        });
    }
    addTimeList(){
        this.setState(pre => {
            let timeList  = [
                ...pre.params.course_detail
            ];
            if(!timeList.length){
                return {
                    params: {
                        ...pre.params,
                        course_detail: [
                            ...pre.params.course_detail,
                            {
                                course_begin: '08:00',
                                course_end: '09:00'
                            }
                        ]
                    }
                }
            }
            let last = timeList.pop();
            let course_begin = last.course_end;
            let course_end = null;
            if(!last.course_end){
                message.warning('请先设置上一个时间段');
                return;
            }
            if(timeList.length === 3){
                message.warning('只能设置4个时间段');
                return ;
            }
            return {
                params: {
                    ...pre.params,
                    course_detail: [
                        ...pre.params.course_detail,
                        {
                            course_begin,
                            course_end
                        }
                    ]
                }
            }
        })
    }
    deleteTimeList(){
        let { selectedTimeList, params } = this.state;
        let course_detail = [...params.course_detail];
        if(!selectedTimeList.length){
            message.warning('至少选择一个时间段');
            return;
        }
        selectedTimeList.sort((a,b) => b-a).map(item => {
            if(course_detail[item].detail_id){
                this.deleteTime(course_detail[item].detail_id);
            }
            course_detail.splice(parseInt(item), 1);
            this.settleParams('course_detail', course_detail);
            this.setState({
                selectedTimeList: []
            })
        });
    }
    controlRegi(dates){
        this.settleParams('regi_begin', dates[0]);
        this.settleParams('regi_end', dates[1]);
    }
    getInputRef(ref){
        if(ref && !this.state.inputElement){
            this.setState({
                inputElement: ref
            });
        }
    }
    updateLatLng(latLng){
        this.settleParams('latitude', latLng.lat);
        this.settleParams('longitude', latLng.lng);
    }
    controlBigAddress(value){
        this.settleParams('area', value);
    }
    settleSmallAddress(value){
        if(!value){
            this.settleErrors('address', ERROR.address.required);
        }else{
            this.settleErrors('address', null);
        }
    }
    controlSmallAddress(value){
        this.settleParams('address', value);
        this.settleSmallAddress(value);
    }
    settleCostError(value){
        if(!value){
            this.settleErrors('cost', ERROR.cost.required);
        }else if(!moneyFormator.deal(value)){
            this.settleErrors('cost', ERROR.cost.number);
        }else{
            this.settleErrors('cost', null);
        }
    }
    controlCost(value){
        this.settleParams('cost', value);
        this.settleCostError(value);
    }
    settleCountStandardError(value){
        if(!value){
            this.settleErrors('count_standard', ERROR.courseCount.required);
            return;
        }else if(!numberValidator.int(value)){
            this.settleErrors('count_standard', ERROR.courseCount.int);
            return;
        }else{
            if(parseInt(value) < parseInt(this.state.params.count_less)){
                this.settleErrors('count_less', ERROR.courseCount.max);
            }else{
                this.settleErrors('count_less', null);
            }
        }
        this.settleErrors('count_standard', null);
    }
    controlCountStandard(value){
        this.settleParams('count_standard', value);
        this.settleCountStandardError(value);
    }
    settleCountLessError(value){
        if(!value){
            this.settleErrors('count_less', ERROR.courseCount.required);
        }else if(!numberValidator.int(value)){
            this.settleErrors('count_less', ERROR.courseCount.int);
        }else if(parseInt(value) > parseInt(this.state.params.count_standard)){
            this.settleErrors('count_less', ERROR.courseCount.max);
        }else{
            this.settleErrors('count_less', null);
        }
    }
    controlLessCount(value){
        this.settleParams('count_less', value);
        this.settleCountLessError(value);
    }
    controlPhone(value){
        this.settleParams('tel', value);
        this.settlePhoneError(value, true);
    }
    getCoachList(){
        this.props.loadData('MANAGE-COACH-GETLIST').then((res) => {
            this.setState({
                coachList: res.content
            });
        }, (res) => {})
    }
    controlDescription(html){
        this.settleParams('description', html);
    }
    setStatus(status){
        this.setState({
            disabled: status
        });
    }
    disabledBtn(){
        const {name, course_detail, regi_begin, address,cost,count_standard, count_less, tel, trainer_id} = this.state.params;
        let bool = false;
        course_detail.forEach(c => {
            if(!c.course_begin || !c.course_end){
                bool = true;
            }
        });
        if(bool){
            return bool;
        }
        if(!(numberValidator.int(count_standard) && numberValidator.int(count_less) && parseInt(count_less) <= parseInt(count_standard))){
            return true;
        }
        return !(!!name && !!regi_begin && !!address && !!cost && phoneValidator.cell(tel) && !!trainer_id);
    }
}
export default SpecialCourseAddEditTemplate;