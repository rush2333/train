import React from 'react';
import { Link } from 'react-router-dom';
import {
    Input,
    Button
} from 'antd';
import {
    SearchBarComponent,
    TableComponent
} from '../../../components';
import { moneyFormator } from '../../../utils';
import Utils from './utils';
let pageType = 'special';//初始化为special
const columns = [{
    title: '课程ID',
    dataIndex: 'id',
    key: 'id',
    render: (text, record) => {
        let id = record.id.split('-')[1];
        return (
            <Link to={'/course/'+ pageType + '/detail/' + id}>{record.id}</Link>
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
},{
    title: '报名时间',
    dataIndex: 'regi_time',
    render: (text, record) => (<span>{record.regi_begin} ~ {record.regi_end}</span>)
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
        <Link to={'/sign/'+ pageType +'/detail/' + record.course_id}>查看</Link>
    )
}];
class ClassList extends Utils{
    constructor(props){
        super(props);
        this.state = {
            params: {
                key: '',
                page: 1,
                row: 15
            },
            detailData: {
                rows: [],
                total: 0
            }
        };
        if(props.pageType === 'special'){
            this.tableURL = 'SIGNUP-SPECIAL-LIST';
            this.csvURL = 'SIGNUP-SPECIAL-EXPORT';
        }else{
            pageType = props.pageType;
            this.tableURL = 'SIGNUP-REGULAR-LIST';
            this.csvURL = 'SIGNUP-REGULAR-EXPORT';
        }
    }
    render(){
        let { params, detailData } = this.state;
        let csvParams = {
            key: params.key
        };
        return (
            <div>
                <SearchBarComponent
                    style={{marginTop: '0'}}
                    left={[{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: "请输入关键字",
                            onChange: (e) => this.controlKey(e.target.value),
                            onPressEnter: (e) => this.getClassList(true)
                        }
                    }]}
                    right={[{
                        Element: Button,
                        value: "打印"
                    },{
                        Element: Button,
                        value: "导出CSV",
                        props: {
                            onClick: () => this.props.outputCSV(this.csvURL, csvParams)
                        }
                    }]}/>
                <TableComponent columns={columns} dataSource={detailData.rows} total={detailData.total} rowKey="id" onChange={(page) => this.updateTable(page, () => this.getClassList(false))}/>
            </div>
        )
    }
    componentDidMount(){
        this.getClassList(false);
    }
    getClassList(shouldResetPage){
        let params = this.state.params;
        if(shouldResetPage) {params.page = 1;}
        let  post = {
            ...params
        };
        this.props.loadData(this.tableURL, post).then((res) => {
            this.setState({
                detailData: {
                    ...res.content
                }
            });
        }, (res) => {
            this.setState({
                detailData: {
                    rows: [],
                    total: 0
                }
            })
        });
    }
}
export default ClassList;