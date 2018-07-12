import React from 'react';
import CommonPage from './common-page';
import { DatePicker, Input,Button, Avatar } from 'antd';
import { CommonPageComponent, SearchBarComponent, AvatarComponent } from "../components";
import moment from 'moment';
import moneyFormator from "../utils/money-format";
const { RangePicker } = DatePicker;
class SignDetail extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                time_begin: moment().format('YYYY-MM-DD'),
                time_end: moment().format('YYYY-MM-DD'),
                key: '',
                page: 1,
                row: 15,
                course_id: props.match.params.id
            },
            rows: [],
            total: 0
        };
    }
    render(){
        const columns = [{
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
                return (<span>
                    {moneyFormator(record.cost)}
                </span>)
            }
        }];
        const { params, rows, total } = this.state;
        const pageConfig = this.pageConfig;
        return(
            <CommonPageComponent title={ pageConfig.title +"报名/报名明细"} table={{dataSource: rows, columns, total: total, rowKey: 'id', onChange: (page) => this.getSignDetailList({page})}}>
                <SearchBarComponent
                    left={[{
                        label: "时间",
                        Element: RangePicker,
                        props: {
                            style: {
                                width: '200px'
                            },
                            defaultValue: [
                                moment(params.time_begin),
                                moment(params.time_end)
                            ],
                            format: 'YYYY-MM-DD',
                            onChange: (dates, dateStrings) => this.controlRangePicker(dates, dateStrings, () => {
                                this.getSignDetailList({
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
                            onPressEnter: (e) => this.getSignDetailList({
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
                            onClick: () => this.props.outputCSV('SIGNUP-COMMON-EXPORT', {
                                time_begin: params.time_begin,
                                time_end: params.time_end,
                                key: params.key,
                                course_id: params.course_id
                            })
                        }
                    }]}
                />
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getSignDetailList();
    }
    getSignDetailList(params){
        this.props.loadData('SIGNUP-COMMON-DETAIL', {
            ...this.state.params,
            ...params
        }).then((res) => {
            const { total, rows } = res.content;
            this.setState({
                total,
                rows
            });
        }, (res) => {
            this.setState({
                total: 0,
                rows: []
            });
        });
    }
}

export default SignDetail;