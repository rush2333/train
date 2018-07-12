import React from 'react';
import { Link } from 'react-router-dom';
import CommonPage from '../templates/common-page';
import { Input, Button } from 'antd';
import { CommonPageComponent, SearchBarComponent} from '../components/index';
import { moneyFormator } from '../utils/';
class StudentDetail extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                key: '',
                page: 1,
                row:15,
                openid: props.match.params.id
            },
            rows: [],
            total: 0,
            user: ''
        }
    }
    render(){
        const columns = [
            {
                title: '报名时间',
                dataIndex: 'create_time',
                key: 'create_time',
            }, {
                title: '课程ID',
                dataIndex: 'id',
                key: 'id',
                render: (text, record) => {
                    let idMsg = record.id.split('-');
                    let id = idMsg[1];
                    let type = idMsg[0] === 'tx' ? 'special': 'regular';
                    return <Link to={'/course/' + type + '/detail/' + id}>{record.id}</Link>
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
                title: '报名费用(元)',
                dataIndex: 'cost',
                key: 'cost',
                render: (text, record) => (<span>
                    {moneyFormator(record.cost)}
                </span>)
            }, {
                title: '总课时',
                dataIndex: 'count',
                key: 'count',
            }, {
                title: '剩余课时',
                dataIndex: 'surplus',
                key: 'surplus',
            }, {
                title: '考勤记录(出勤/请假/旷课)',
                dataIndex: 'record',
                key: 'record',
                render: (text, record) => (
                    <span>{record.attend_count}/{record.leave_count}/{record.cut_count}</span>
                )
            },{
                title: '状态',
                dataIndex: 'status',
                key: 'status',
            },{
                title: "操作",
                key: 'operate',
                render: (text, record) => {
                    let course_id;
                    record.id.replace(/-(\d*)-/, (match, p1) => course_id = p1);
                    return (<Link to={"/manage/student/detail/" + record.openid + '/' + course_id}>查看</Link>)
                }
            }
        ];
        const { rows, total, params, user } = this.state;
        return (
            <CommonPageComponent title={"学员管理" + (user?'/'+user.real_name : '') } table={{dataSource: rows, columns, total, rowKey: 'id'}}>
                <SearchBarComponent
                    left={[{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: '请输入关键字'
                        }
                    }]}
                    right={[{
                        Element: Button,
                        value: "打印"
                    },{
                        Element: Button,
                        value: "导出CSV",
                        props: {
                            onClick: () => this.props.outputCSV('', {
                                key: params.key,
                                openid: params.openid
                            })
                        }
                    }]}/>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getStudentDetail();
    }
    getStudentDetail(params){
        let p = Object.assign({}, this.state.params, {
            ...params
        });
        this.props.loadData('MANAGE-STUDENT-DETAIL', p).then((res) => {
            const { rows, total, user } = res.content;
            this.setState({
                rows,
                total,
                user
            });
        }, (res) => {
            this.setState({
                rows: [],
                total: 0
            });
        });
    }
}

export default StudentDetail;