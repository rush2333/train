import React from 'react';
import {
    DatePicker,
    Input,
    Button,
    Avatar
} from 'antd';
import moment from 'moment';
import {
    SearchBarComponent,
    CardComponent,
    StatisticsComponent,
    TableComponent
} from '../../../components';
import { moneyFormator } from '../../../utils';
import Utils from './utils';
const { RangePicker } = DatePicker;
const columns = [
    {
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
    }
];
class DetailList extends Utils{
    constructor(props){
        super(props);
        this.state = {
            params: {
                page: 1,
                row: 15,
                time_begin: moment(),
                time_end: moment(),
                key: "",
                type: props.type
            },
            detailData: {
                statistic: {},
                rows: [],
                total: 0
            }
        };
    }
    render(){
        let { params, detailData } = this.state;
        let { time_begin, time_end, key, type } = params;
        let csvParams = {
            time_begin: moment(time_begin).format('YYYY-MM-DD'),
            time_end: moment(time_end).format('YYYY-MM-DD'),
            key,
            type
        };
        return (
            <div>
                <SearchBarComponent
                    style={{marginTop: '0'}}
                    left={[{
                        label: "时间",
                        Element: RangePicker,
                        props: {
                            style:{
                                width: '200px'
                            },
                            defaultValue: [params.time_begin,params.time_end],
                            format: 'YYYY-MM-DD',
                            onChange: (dates) => this.controlRangePicker(dates, () => this.getTableList(true))
                        }
                    },{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: "请输入关键字",
                            onChange: (e) => this.controlKey(e.target.value),
                            onPressEnter: (e) => this.getTableList(true)
                        }
                    }]}
                    right={[{
                        Element: Button,
                        value: "打印"
                    },{
                        Element: Button,
                        value: "导出CSV",
                        props: {
                            onClick: () => this.props.outputCSV('SIGNUP-COMMON-DETAILEXPORT', csvParams)
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
                <TableComponent columns={columns} dataSource={detailData.rows} total={detailData.total} rowKey="id" onChange={(page) => this.updateTable(page)}/>
            </div>
        )
    }
    componentDidMount(){
        this.getTableList();
    }
    getTableList(shouldResetPage){
        let params = this.state.params;
        if(shouldResetPage) {params.page = 1;}
        let  post = {
            ...params,
            time_begin: moment(params.time_begin).format('YYYY-MM-DD'),
            time_end: moment(params.time_end).format('YYYY-MM-DD')
        };
        this.props.loadData('SIGNUP-COMMON-DETAILLIST', post).then((res) => {
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
}
export default DetailList;