import React from 'react';
import { Tabs, DatePicker, Input, Button, Avatar } from 'antd';
import CommonPage from './common-page';
import { CommonPageComponent, SearchBarComponent, CardComponent, StatisticsComponent, TableComponent } from '../components';
import moment from 'moment';
import { moneyFormator } from '../utils';
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
const detailColumns = [{
    title: "报名ID",
    dataIndex: "id",
    key: "id"
},{
    title: "报名时间",
    dataIndex: "create_time",
    key: "create_time"
},{
    title: "微信头像",
    dataIndex: "head_img_url",
    key: "head_img_url",
    className: 'q-avatar-big',
    render: (text, record) => {
        return <Avatar src={record.head_img_url} size="large"/>;
    }
},{
    title: "微信昵称",
    dataIndex: "nickname",
    key: "nickname"
},{
    title: "学员姓名",
    dataIndex: "real_name",
    key: "real_name"
},{
    title: "学员性别",
    dataIndex: "sex",
    key: "sex"
},{
    title: "学员生日",
    dataIndex: "birthday",
    key: "birthday"
},{
    title: "手机号码",
    dataIndex: "phone",
    key: "phone"
},{
    title: "报名费(元)",
    dataIndex: "cost",
    key: 'cost',
    render: (text, record) => {
        return (
            <span>
                {moneyFormator(record.cost)}
            </span>
        )
    }
}, {
    title: "报名方式",
    dataIndex: 'book_way',
    key: 'book_way'
}];
class SignUpListTemplates extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                page: 1,
                row: 15,
                key: '',
                time_begin: moment().format('YYYY-MM-DD'),
                time_end: moment().format('YYYY-MM-DD')
            },
            params2: {
                key: '',
                page: 1,
                row: 15
            },
            detailData: {
                rows:[],
                total: 0,
                statistic: {}
            },
            classData: {
                rows: [],
                total: 0
            },
            activeKey: '1'
        }
    }
    render(){
        const { params, params2, detailData, classData, activeKey } = this.state;
        const pageConfig = this.pageConfig;
        let columns;
        if(activeKey === '1'){
            columns = detailColumns;
        }else if(activeKey === '2'){
            columns = pageConfig.classColumns;
        }
        return (
            <CommonPageComponent
                title={pageConfig.title}
                bordered={false}
            >
                <Tabs activeKey={activeKey} onChange={(key) => this.updateTab(key)}>
                    <TabPane tab="按明细" key="1">
                        <SearchBarComponent
                            style={{marginTop: '0'}}
                            left={[{
                                label: "时间",
                                Element: RangePicker,
                                props: {
                                    style:{
                                        width: '200px'
                                    },
                                    defaultValue: [moment(params.time_begin), moment(params.time_end)],
                                    format: 'YYYY-MM-DD',
                                    onChange: (dates) => this.controlRangePicker(dates)
                                }
                            },{
                                label: "搜索",
                                Element: Input,
                                props: {
                                    placeholder: "请输入关键字",
                                    onChange: (e) => this.controlKey(e.target.value),
                                    onPressEnter: (e) => this.getDetailList({
                                        key: e.target.value,
                                        page: 1
                                    })
                                }
                            }]}
                            right={[{
                                Element: Button,
                                value: "打印"
                            },{
                                Element: Button,
                                value: "导出CSV",
                                props: {
                                    onClick: () => this.props.outputCSV(pageConfig.api.detailCSV, {
                                        key: params.key,
                                        time_begin: params.time_begin,
                                        time_end: params.time_end,
                                        type: pageConfig.type === 'special' ? '2' : '1'
                                    })
                                }
                            }]}/>
                        <CardComponent title="数据统计">
                            <StatisticsComponent>
                                <StatisticsComponent.Item label="报名人数-总" detail={detailData.statistic.all_count || 0} />
                                <StatisticsComponent.Item label="报名人数-男" detail={detailData.statistic.male_count || 0} />
                                <StatisticsComponent.Item label="报名人数-女" detail={detailData.statistic.female_count || 0} />
                                <StatisticsComponent.Item label="本月新增报名数" detail={detailData.statistic.month_count || 0} />
                                <StatisticsComponent.Item label="今日新增报名数" detail={detailData.statistic.today_count || 0} />
                                <StatisticsComponent.Item label="报名费用总额(元)" detail={moneyFormator(detailData.statistic.money)}/>
                            </StatisticsComponent>
                        </CardComponent>
                        <TableComponent dataSource={detailData.rows} columns={columns} total={detailData.total} rowKey='id' onChange={() => {}} />
                    </TabPane>
                    <TabPane tab="按班级"  key="2">
                        <SearchBarComponent
                            style={{marginTop: '0'}}
                            left={[{
                                label: "搜索",
                                Element: Input,
                                props: {
                                    placeholder: "请输入关键字",
                                    onChange: (e) => this.controlKey2(e.target.value),
                                    onPressEnter: (e) => this.getClassList({
                                        key: e.target.value,
                                        page: 1
                                    })
                                }
                            }]}
                            right={[{
                                Element: Button,
                                value: "打印"
                            },{
                                Element: Button,
                                value: "导出CSV",
                                props: {
                                    onClick: () => this.props.outputCSV(pageConfig.api.classCSV, {
                                        key: params2.key
                                    })
                                }
                            }]}/>
                        <TableComponent dataSource={classData.rows} columns={columns} total={classData.total} rowKey='id' onChange={(page) => this.getClassList({page})} />
                    </TabPane>
                </Tabs>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getDetailList();
        this.getClassList();
    }
    updateTab(key){
        this.setState({
            activeKey: key
        });
    }
    getDetailList(params){
        let p = Object.assign({}, this.state.params, params);
        p.type = this.pageConfig.type === 'special' ? '2' : '1';
        this.props.loadData(this.pageConfig.api.detailList, p).then((res) => {
            this.setState({
                detailData: {
                    ...res.content
                }
            });
        }, (res) => {
            this.setState({
                detailData: {
                    rows: [],
                    total: 0,
                    statistic: {}
                }
            })
        });
    }
    getClassList(params){
        let p = Object.assign({}, this.state.params2, params);
        this.props.loadData(this.pageConfig.api.classList, p).then((res) => {
            this.setState({
                classData: res.content
            });
        }, (res) => {
            this.setState({
                classData: {
                    rows: [],
                    total: 0
                }
            })
        });
    }
    controlKey2(value){
        this.settleParams2('key', value);
    }
    settleParams2(type, value){
        this.setState(prev => {
            return {
                params2: {
                    ...prev.params2,
                    [type]: value
                }
            }
        })
    };
}
export default SignUpListTemplates;