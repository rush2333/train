import React from 'react';
import CommonPage from '../templates/common-page';
import { Link } from 'react-router-dom';
import { Input, DatePicker, Button } from 'antd';
import { CardComponent, CommonPageComponent, SearchBarComponent, StatisticsComponent} from "../components";
import moment from 'moment';
import { moneyFormator } from '../utils';
const { RangePicker } = DatePicker;
class IndividualCourseList extends CommonPage {
    constructor(props){
        super(props);
        this.state = {
            params: {
                time_begin: moment().format('YYYY-MM-DD'),
                time_end: moment().format('YYYY-MM-DD'),
                key: '',
                page: 1,
                row: 15
            },
            rows: [],
            total: 0,
            statistic: {}
        }
    }
    render(){
        const columns = [
            {
                title: "报名时间",
                dataIndex: "create_time",
                key: "create_time"
            },{
                title: "报名ID",
                dataIndex: "id",
                key: "id"
            },{
                title: "学员姓名",
                dataIndex: "name",
                key: "name"
            },{
                title: "出生日期",
                dataIndex: "birthday",
                key: "birthday"
            },{
                title: "手机号码",
                dataIndex: "phone",
                key: "phone"
            },{
                title: "报名费(元)",
                dataIndex: "cost",
                key: "cost",
                render: (text, record) => {
                    return (<span>
                        {moneyFormator(record.cost)}
                    </span>)
                }
            },{
                title: "所属教练",
                dataIndex: "trainer",
                key: "trainer"
            },{
                title: "备注",
                dataIndex: "description",
                key: "description"
            }
        ];
        const { rows, total, params, statistic} = this.state;
        return (
            <CommonPageComponent title="单教" table={{dataSource: rows, columns, total, rowKey: 'id', onChange: (page) => this.getIndividualList({page})}}>
                <SearchBarComponent
                    left={[{
                        label: "时间",
                        Element: RangePicker,
                        props: {
                            style:{
                                width: '200px'
                            },
                            defaultValue: [
                                moment(params.time_begin),
                                moment(params.time_end)
                            ],
                            onChange: (dates, dateStrings) => this.controlRangePicker(dates, dateStrings, () => {
                                this.getIndividualList({
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
                            onPressEnter: (e) => this.getIndividualList({
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
                            onClick: () => this.props.outputCSV('COURSE-SINGLE-EXPORT', {
                                key: params.key,
                                time_begin: params.time_begin,
                                time_end: params.time_end
                            })
                        }
                    },{
                        Element: Link,
                        value: <Button type="primary">新增</Button>,
                        props: {
                            to: '/course/individual/list/add'
                        }
                    }]}/>
                <CardComponent title="单教数据统计">
                    <StatisticsComponent>
                        <StatisticsComponent.Item label="学员人数-总" detail={statistic.all_count || 0}/>
                        <StatisticsComponent.Item label="学员人数-男" detail={statistic.male_count || 0}/>
                        <StatisticsComponent.Item label="学员人数-女" detail={statistic.female_count || 0}/>
                        <StatisticsComponent.Item label="本月新增学员数" detail={statistic.month_count || 0}/>
                        <StatisticsComponent.Item label="今日新增学员数" detail={statistic.today_count || 0}/>
                        <StatisticsComponent.Item label="报名费用总额(元)" detail={moneyFormator(statistic.money)}/>
                    </StatisticsComponent>
                </CardComponent>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getIndividualList();
    }
    getIndividualList(params){
        let p = Object.assign({}, this.state.params, {
            ...params
        });
        this.props.loadData('COURSE-SINGLE-LIST', p).then((res) => {
            let { rows, total, statistic } = res.content;
            this.setState({
                rows,
                total,
                statistic
            });
        }, (res) => {
            this.setState({
                rows: [],
                total: 0,
                statistic: {}
            });
        });
    }
}

export default IndividualCourseList;