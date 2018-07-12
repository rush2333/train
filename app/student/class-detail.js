import React from 'react';
import { Link } from 'react-router-dom';
import CommonPage from '../templates/common-page';
import { Input, Button } from 'antd';
import { CommonPageComponent, SearchBarComponent} from '../components/index';
import { moneyFormator } from '../utils/';
class StudentClassDetail extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                key: '',
                page: 1,
                row:15,
                openid: props.match.params.openid,
                course_id: props.match.params.course_id
            },
            rows: [],
            total: 0,
            user: '/上课明细'
        }
    }
    render(){
        const columns = [
            {
                title: '课程名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '上课地点',
                dataIndex: 'address',
                key: 'address'
            }, {
                title: '上课时间',
                dataIndex: 'course_time',
                key: 'course_time',
            }, {
                title: '考勤时间',
                dataIndex: 'attend_time',
                key: 'attend_time',
            }, {
                title: '出勤情况',
                dataIndex: 'type',
                key: 'type'
            }, {
                title: '剩余课程节数',
                dataIndex: 'count',
                key: 'count',
            }
        ];
        const { rows, total, params, user } = this.state;
        return (
            <CommonPageComponent title={"学员管理" + user } table={{dataSource: rows, columns, total, rowKey: 'id'}}>
                <SearchBarComponent
                    left={[{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: '请输入关键字',
                            onChange: (e) => this.controlKeyParams(e.target.value),
                            onPressEnter: (e) => this.getStudentDetail(true)
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
                                openid: params.openid,
                                course_id: params.course_id
                            })
                        }
                    }]}/>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getStudentDetail();
    }
    getStudentDetail(shouldResetPage){
        let params = this.state.params;
        let post = {
            ...params
        };
        if(shouldResetPage){
            post.page = 1;
        }
        this.props.loadData('MANAGE-STUDENT-CLASSDETAIL', post).then((res) => {
            let { rows, total } = res.content;
            let user = rows[0] && ('/' + rows[0].name + '/上课明细') || '/上课明细';
            this.setState({
                rows: rows,
                total: total,
                user: user
            });
        }, (res) => {
            this.setState({
                rows: [],
                total: 0
            });
        });
    }
    controlKeyParams(value){
        this.setState(prev => {
            return {
                params: {
                    ...prev.params,
                    key: value
                }
            }
        })
    }
}

export default StudentClassDetail;