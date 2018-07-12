/*
* 已经作废
* */

import React from 'react';
import CommomPage from './common-page';
import { Link } from 'react-router-dom';
import { Input, Button, DatePicker, notification } from 'antd';
import moment from 'moment';
import { CommonPageComponent, SearchBarComponent, CardComponent, StatisticsComponent } from '../components/index';
import { moneyFormator } from '../utils';
const { RangePicker } = DatePicker;
class SignUpList extends CommomPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                key: '',
                row: 15,
                page: 1,
                time_begin: moment().format('YYYY-MM-DD'),
                time_end: moment().format('YYYY-MM-DD')
            },
            rows: [],
            statistic: {},
            total: 0
        }
    }
    render(){
        const { params, rows, statistic, total } = this.state;
        const pageConfig = this.pageConfig;
        const columns = [{
            title: '课程ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => {
                let id = record.id.split('-')[1];
                return (
                    <Link to={'/course/' + pageConfig.type + '/detail/' + id}>{record.id}</Link>
                )
            }
        }, {
            title: '课程名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '上课时间',
            dataIndex: 'course_time',
            key: 'course_time',
        }, {
            title: '上课地点',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: '报名人数(总/男/女)',
            dataIndex: 'count',
            key: 'count',
            render: (text, record) => {
                let male = parseFloat(record.male_count) || 0;
                let female = parseFloat(record.female_count) || 0;
                let all = male + female;
                return (<span>
                {all}/{male}/{female}
            </span>)
            }
        }, {
            title: '报名费(总/男/女)',
            dataIndex: 'income',
            key: 'income',
            render: (text, record) => {
                let all = moneyFormator(record.pay_sum);
                let male = moneyFormator(record.male_pay);
                let female = moneyFormator(record.female_pay);
                return (<span>
                {all}/{male}/{female}
            </span>)
            }
        },{
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text, record) => (
                <Link to={'/sign/' + pageConfig.type + '/detail/' + record.course_id}>查看</Link>
            )
        }
        ];
        return (
            <CommonPageComponent title={pageConfig.value} table={{dataSource: rows, columns, total, rowKey: 'id', onChange: (page) => this.getSignupList({page})}}>
                <SearchBarComponent
                    left={[{
                        label: "时间",
                        Element: RangePicker,
                        props: {
                            style:{
                                width: '200px'
                            },
                            defaultValue: [moment(params.time_begin), moment(params.time_end)],
                            format: 'YYYY-MM-DD',
                            onChange: (dates, dateStrings) => this.controlRangePicker(dates, dateStrings, () => {
                                this.getSignupList({
                                    time_begin: dateStrings[0],
                                    time_end: dateStrings[1],
                                    page: 1
                                });
                            })
                        }
                    },{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: "请输入关键字",
                            onChange: (e) => this.controlKey(e.target.value),
                            onPressEnter: (e) => this.getSignupList({
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
                            onClick: () => this.props.outputCSV(pageConfig.api.csv, {
                                key: params.key,
                                time_begin: params.time_begin,
                                time_end: params.time_end
                            })
                        }
                    }]}/>
                <CardComponent title="数据统计">
                    <StatisticsComponent>
                        <StatisticsComponent.Item label="报名人数-总" detail={statistic.all_count || 0} />
                        <StatisticsComponent.Item label="报名人数-男" detail={statistic.male_count || 0} />
                        <StatisticsComponent.Item label="报名人数-女" detail={statistic.female_count || 0} />
                        <StatisticsComponent.Item label="本月新增报名数" detail={statistic.month_count || 0} />
                        <StatisticsComponent.Item label="今日新增报名数" detail={statistic.today_count || 0} />
                        <StatisticsComponent.Item label="报名费用总额(元)" detail={moneyFormator(statistic.money)}/>
                    </StatisticsComponent>
                </CardComponent>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getSignupList();
    }
    getSignupList(params){
        let pageConfig = this.pageConfig;
        let postData = {
            ...this.state.params,
            ...params
        };
        this.props.loadData(pageConfig.api.list, postData).then((res) => {
            const { rows, statistic, total } = res.content;
            this.setState({
                rows: rows,
                statistic: statistic,
                total: total
            });
        }, (res) => {
            this.setState({
                rows: [],
                statistic: {},
                total: 0
            });
            notification.error({
                message: '获取'+ pageConfig.value +'报名列表失败',
                description: '获取' + pageConfig.value + '报名列表失败的原因可能是' + res.msg + '，请重新尝试获取或者联系网站管理员！'
            });
        });
    }
}

export default SignUpList;