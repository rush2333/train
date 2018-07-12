import React from 'react';
import { Link } from 'react-router-dom';
import CommonPage from '../templates/common-page';
import { Select, Input,Button, Avatar, Modal,notification } from 'antd';
import { CommonPageComponent, SearchBarComponent } from "../components";
const { Option } = Select;
const { confirm } = Modal;
class CoachManageList extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                page: 1,
                row: 15,
                in_grade: '3',
                key: '',
            },
            rows: [],
            total: 0
        }
    }
    render(){
        const columns = [{
            title: "教练ID",
            dataIndex: "id",
            key: "id"
        },{
            title: "头像",
            dataIndex: "header_url",
            key: "header_url",
            className: 'q-avatar-big',
            render: (text, record) => <Avatar src={record.header_url} size="large" shape="square"/>
        },{
            title: "姓名",
            dataIndex: "name",
            key: "name"
        },{
            title: "性别",
            dataIndex: "sex",
            key: "sex"
        },{
            title: "手机号码",
            dataIndex: "phone",
            key: "phone"
        },{
            title: "级别",
            dataIndex: "grade",
            key: "grade"
        },{
            title: "注册时间",
            dataIndex: "create_time",
            key: "create_time"
        },{
            title: "状态",
            dataIndex: "status",
            key: "status"
        },{
            title: "操作",
            dataIndex: "operate",
            key: "operate",
            render: (text, record) => {
                let {id, name, grade } = record;
                let postId = id.split('-')[1];
                let control = <a onClick={() => this.startCoach(postId, name, grade)} style={{marginRight: '5px'}}>启用</a>;
                if(record.status === '正常'){
                    control = <a onClick={() => this.blockCoach(postId, name,grade)} style={{marginRight: '5px'}}>停用</a>;
                }
                return (<span>
                    {control}
                    <Link to={'/manage/coach/edit/' + postId}>修改</Link>
                </span>)
            }
        }];
        const { total, rows, params } = this.state;
        return (
            <CommonPageComponent title="教练管理" table={{dataSource: rows, columns, total, rowKey: 'id', onChange: (page) => this.getCoachList({page})}}>
                <SearchBarComponent
                    left={[{
                        label: "级别",
                        Element: Select,
                        props: {
                            style: {
                                width: '200px'
                            },
                            placeholder: "请选择教练级别",
                            defaultValue: params.in_grade,
                            onChange: (value)=> this.controlSelect(value)
                        },
                        children: [
                            <Option value="3" key="3">全部</Option>,
                            <Option value="1" key="1">主教</Option>,
                            <Option value="2" key="2">助教</Option>,
                        ]
                    },{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: "请输入关键字",
                            onChange: (e) => this.controlKey(e.target.value),
                            onPressEnter: (e) => this.getCoachList({key: e.target.value})
                        }
                    }]}
                    right={[{
                        Element: Button,
                        value: "打印"
                    },{
                        Element: Button,
                        value: "导出CSV",
                        props: {
                            onClick: () => this.props.outputCSV('MANAGE-COACH-EXPORT', {
                                in_grade: params.in_grade,
                                key: params.key
                            })
                        }
                    },{
                        Element: Link,
                        value: <Button type="primary">新增</Button>,
                        props: {
                            to: '/manage/coach/add'
                        }
                    }]}
                />
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getCoachList();
    }
    controlSelect(value){
        this.settleParams('in_grade', value);
        this.getCoachList({
            in_grade: value,
            page: 1
        });
    }
    getCoachList(params){
        let p = Object.assign({}, this.state.params, {
            ...params
        });
        this.props.loadData('MANAGE-COACH-LIST', p).then((res) => {
            let { rows, total } = res.content;
            this.setState({
                rows,
                total
            });
        }, (res) => {
            this.setState({
                rows: [],
                total: 0
            });
        })
    }
    blockCoach(id, name, grade){
        confirm({
            title: '停用教练账号',
            content: <span>您正在停用 {grade}<strong>{name}</strong> 的账号，确定后其将不能使用教练功能，是否继续？</span>,
            onOk: () => {
                this.operateCoach(id, 0);
            }
        });
    }
    startCoach(id, name, grade){
        confirm({
            title: '启用教练账号',
            content: <span>您正在启用 {grade}<strong>{name}</strong> 的账号，确定后其将能够使用教练功能，是否继续？</span>,
            onOk: () => {
                this.operateCoach(id, 1);
            }
        });
    }
    operateCoach(id, type){
        this.props.loadData('MANAGE-COACH-HANDLE', {
            trainer_id: id,
            type: type
        }).then((res) => {
            this.getCoachList();
        }, (res) => {
            notification.error({
                message: '启用/停用教练失败',
                description: '启动/停用教练失败的原因可能是 ' + res.msg + ' ,您可以重新尝试该操作或者联系网站管理员！'
            });
        });
    }
}
export default CoachManageList;