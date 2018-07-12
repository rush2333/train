import React from 'react';
import CommonPage from '../templates/common-page';
import { Link } from 'react-router-dom';
import { Input, Button, message, Modal,Popover } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CommonPageComponent, SearchBarComponent } from "../components";
import { weeks} from "../config/CONSTANT";
const { confirm } = Modal;
class CourseList extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                key: '',
                page: 1,
                row: 15
            },
            rows: [],
            total: 0
        }
    }
    render(){
        const { rows, total, params } = this.state;
        let pageConfig = this.pageConfig;
        let addURL = '/course/'+ pageConfig.type +'/add';
        let outputApi = 'COURSE-' + pageConfig.type.toUpperCase() + '-EXPORT';
        const columns = [
            {
                title: '课程ID',
                dataIndex: 'id',
                key: 'id',
            }, {
                title: '课程名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '课程时间',
                dataIndex: 'course_time',
                key: 'course_time',
                className: 'q-td-course-time',
                render: (text, record) => {
                    let c = record.cycle.split(',');
                    let ws = [];
                    weeks.map(w => {
                        let v = w.value.toString();
                        c.forEach(item => {
                            if(v === item){
                                ws.push(w.label);
                            }
                        });
                    });
                    if(ws.length === 7) return '全周' + ' ' + record.course_time;
                    return ws.join() + ' ' + record.course_time;
                }
            }, {
                title: '课程节数',
                dataIndex: 'count',
                key: 'count',
            }, {
                title: '带班主教',
                dataIndex: 'trainer',
                key: 'trainer',
            }, {
                title: '发布时间',
                dataIndex: 'create_time',
                key: 'create_time',
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
            }, {
                title: '报名链接',
                dataIndex: 'register_url',
                key: 'register_url',
                render: (text, record) => {
                    let content = (
                        <div>
                        {record.detail.map((d, i) => (
                            <CopyToClipboard
                                key={i}
                                text={d.register_url}
                                onCopy={() => this.copyURL()}
                            >
                                <p style={{lineHeight: '32px'}}><a>{d.course_begin + '~' + d.course_end}</a></p>
                            </CopyToClipboard>))
                       }
                        </div>
                    );
                    return (
                        <Popover content={content} title="请选择您要复制的课程报名链接" trigger="click">
                            <a>点击复制</a>
                        </Popover>
                    )
                }
            }, {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (text, record) => {
                    let id = record.id.split('-')[1];
                    return (<span className="q-link-line">
                        <Link to={'/course/' + pageConfig.type + '/edit/' + id}>修改</Link>
                        {record.status === '正常' ? (<a onClick={() => this.stopCourse(id, record.name, record.id)}>停止</a>): <span style={{opacity: '0'}}>停止</span>}
                        <Link to={'/course/' + pageConfig.type + '/detail/' + id}>查看</Link>
                    </span>)
                }
            }
        ];
        let table = {
            dataSource: rows,
            columns,
            total,
            rowKey: 'id',
            onChange: (page, pageSize) => this.getCourseList({page})
        };
        return (
            <CommonPageComponent title={pageConfig.title} table={table}>
                <SearchBarComponent
                    left={[{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: '请输入关键字',
                            onChange: (e) => this.controlKey(e.target.value),
                            onPressEnter: (e) => this.getCourseList({
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
                            onClick: () => this.props.outputCSV(outputApi, {
                                key: params.key
                            })
                        }
                    },{
                        Element: Link,
                        value: <Button type="primary">新增</Button>,
                        props: {
                            to: addURL
                        }
                    }]}/>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getCourseList();
    }
    getCourseList(params){
        let p = Object.assign({}, this.state.params, {
            ...params
        });
        let api = 'COURSE-' + this.pageConfig.type.toUpperCase() + '-LIST';
        this.props.loadData(api, p).then((res) => {
            const { rows, total } = res.content;
            this.setState({
                rows,
                total
            })
        }, (res) => {
            this.setState({
                rows: [],
                total: 0
            })
        });
    }
    copyURL(){
        message.success('复制成功');
    }
    stopCourse(id, courseName, courseID){
        confirm({
            title: '停止课程',
            content: (<span>您正在进行停止 <strong>{courseName}</strong>(id：{courseID}) 操作，该操作不可逆，是否确认？</span>),
            onOk: () => {
                let api = 'COURSE-' + this.pageConfig.type.toUpperCase() + '-DELETE';
                this.props.loadData(api,{
                    course_id: id
                }).then((res) => {
                    this.getCourseList();
                }, (res) => {});
            }
        })

    }
}
export default CourseList;