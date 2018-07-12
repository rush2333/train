import React from 'react';
import { Link, Route } from 'react-router-dom';
import CommonPage from '../templates/common-page';
import { Input,Button, Select } from 'antd';
import { CardComponent, CommonPageComponent, SearchBarComponent, StatisticsComponent} from "../components";
import moneyFormator from "../utils/money-format";
import Loader from '../helpers/load';
const Option = Select.Option;
class StudentManageList extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                key: '',
                row: 15,
                page: 1,
                type: '3'
            },
            rows: [],
            total: 0,
            statistic: {},
            goToAdd: false
        }
    }
    render(){
        const columns = [{
            title: "学员ID",
            dataIndex: "users_id",
            key: "users_id"
        },{
            title: "姓名",
            dataIndex: "real_name",
            key: "real_name"
        },{
            title: "性别",
            dataIndex: "sex",
            key: "sex"
        },{
            title: "出生日期",
            dataIndex: "birthday",
            key: "birthday"
        },{
            title: "手机号码",
            dataIndex: "phone",
            key: "phone"
        },{
            title: "学员来源",
            dataIndex: "type",
            key: 'type'
        },{
            title: "状态",
            dataIndex: "status",
            key: "status"
        },{
            title: "操作",
            dataIndex: "operate",
            key: "operate",
            render: (text, record) => (
                <Link to={"/manage/student/detail/" + record.openid }>查看</Link>
            )
        }];
        const { total, rows, statistic, params } = this.state;
        return (
            <CommonPageComponent title="学员管理" table={{dataSource: rows, columns, total: total, rowKey: (record) => record.openid, onChange: (page) => this.getStudentList({page})}}>
                <SearchBarComponent
                    left={[{
                        label: "学员来源",
                        Element: Select,
                        props: {
                            style: {
                                width: '200px'
                            },
                            placeholder: "请选择学员来源",
                            defaultValue: params.type,
                            onChange: (value)=> this.controlSelect(value)
                        },
                        children: [
                            <Option value="3" key="3">全部</Option>,
                            <Option value="1" key="1">微信报名</Option>,
                            <Option value="2" key="2">线下报名</Option>,
                        ]
                    } ,{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: "请输入关键字",
                            onChange: (e) => this.controlKey(e.target.value),
                            onPressEnter: (e) => this.getStudentList({
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
                            onClick: () => this.props.outputCSV('MANAGE-STUDENT-EXPORT', {
                                key: params.key
                            })
                        }
                    },{
                        Element: Link,
                        value: (<Button type="primary">新增学员</Button>),
                        props: {
                            to: '/manage/student/list/add'
                        }
                    }]}
                />
                <CardComponent title="数据统计">
                    <StatisticsComponent>
                        <StatisticsComponent.Item label="学员人数-总" detail={statistic.all_count || 0}/>
                        <StatisticsComponent.Item label="学员人数-男" detail={statistic.male_count || 0}/>
                        <StatisticsComponent.Item label="学员人数-女" detail={statistic.female_count || 0}/>
                        <StatisticsComponent.Item label="已结课学员数" detail={statistic.finished || 0}/>
                        <StatisticsComponent.Item label="未结课学员数" detail={statistic.unfinished || 0}/>
                        <StatisticsComponent.Item label="本月新增学员数" detail={statistic.month_count || 0}/>
                        <StatisticsComponent.Item label="报名费用总额(元)" detail={moneyFormator(statistic.money)}/>
                    </StatisticsComponent>
                </CardComponent>
                <Route path="/manage/student/list/add" render={() => (<Loader compURL="student/add"/>)}/>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getStudentList();
    }
    controlSelect(value){
        this.settleParams('type', value);
        this.getStudentList({
            type: value,
            page: 1
        });
    }
    getStudentList(params){
        let p = Object.assign({}, this.state.params, {
            ...params
        });
        this.props.loadData('MANAGE-STUDENT-LIST', p).then((res) => {
            const { rows, total, statistic } = res.content;
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

export default StudentManageList;