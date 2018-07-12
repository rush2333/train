import React from 'react';
import { Link } from 'react-router-dom';
import CommonPage from '../templates/common-page';
import { DatePicker, Input,Button } from 'antd';
import { CommonPageComponent, SearchBarComponent} from "../components";
import moment from 'moment';
const { RangePicker } = DatePicker;
class CheckManageList extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                page: 1,
                row: 15,
                time_begin: moment().format('YYYY-MM-DD'),
                time_end: moment().format('YYYY-MM-DD'),
                key: ''
            },
            rows: [],
            total: 0
        }
    }
    render(){
        const columns = [
            {
                title: "考勤时间",
                dataIndex: "create_time",
                key: "create_time"
            },{
                title: "课程ID",
                dataIndex: "id",
                key: "id",
                render: (text, record) => {
                    let idMsg = record.id.split('-');
                    let id = idMsg[1];
                    let type = idMsg[0] === 'tx' ? 'special' : 'regular';
                    return (
                        <Link to={'/course/'+ type +'/detail/' + id}>{record.id}</Link>
                    )
                }
            },{
                title: "上课时间",
                dataIndex: "course_time",
                key: "course_time"
            },{
                title: "上课地点",
                dataIndex: "address",
                key: "address"
            },{
                title: "带班主教",
                dataIndex: "trainer",
                key: "trainer"
            },{
                title: "助教",
                dataIndex: "assistant",
                key: "assistant"
            },{
                title: "上课状态",
                dataIndex: "holiday",
                key: "holiday"
            },{
                title: "学员总人数",
                dataIndex: "all_count",
                key: "all_count"
            },{
                title: "实际出勤人数",
                dataIndex: "attend_count",
                key: "attend_count"
            },{
                title: "操作",
                dataIndex: "operate",
                key: "operate",
                render: (text, record) => (
                    <Link to={'/manage/check/detail/' + record.attend_id}>查看</Link>
                )
            }
        ];
        const { rows, total, params } = this.state;
        return (
            <CommonPageComponent title="考勤管理" table={{dataSource: rows, columns, total: total, rowKey: 'id', onChange: (page) => this.getCheckList({page})}}>
                <SearchBarComponent
                    left={[{
                        label: "级别",
                        Element: RangePicker,
                        props: {
                            style: {
                                width: '200px'
                            },
                            defaultValue: [
                                moment(params.time_begin),
                                moment(params.time_end)
                            ],
                            onChange: (dates, dateStrings) => this.controlRangePicker(dates, dateStrings, this.getCheckList)
                        }
                    },{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: "请输入关键字",
                            onChange: (e) => this.controlKey(e.target.value),
                            onPressEnter: (e) => this.getCheckList({key: e.target.value})
                        }
                    }]}
                    right={[{
                        Element: Button,
                        value: "打印"
                    },{
                        Element: Button,
                        value: "导出CSV",
                        props: {
                            onClick: () => this.props.outputCSV('MANAGE-ATTENDANCE-EXPORT', {
                                key: params.key,
                                time_begin: params.time_begin,
                                time_end: params.time_end
                            })
                        }

                    }]}
                />
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getCheckList();
    }
    getCheckList(params){
        const state = this.state;
        let postData = Object.assign({}, state.params, params);
        this.props.loadData('MANAGE-ATTENDANCE-LIST', postData).then((res) => {
            const { rows, total } = res.content;
            this.setState({
                rows: rows,
                total: total
            });
        }, (res) => {});
    }
}

export default CheckManageList;