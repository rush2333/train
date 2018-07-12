import React from 'react';
import SignList from '../templates/sign-up-list';
import { Link } from 'react-router-dom';
import { moneyFormator } from '../utils';
const columns = [{
    title: '课程ID',
    dataIndex: 'id',
    key: 'id',
    render: (text, record) => {
        let id = record.id.split('-')[1];
        return (
            <Link to={'/course/special/detail/' + id}>{record.id}</Link>
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
        <Link to={'/sign/special/detail/' + record.course_id}>查看</Link>
    )
}];
class RegularCourseSignUpList extends SignList{
    constructor(props){
        super(props);
        this.pageConfig = {
            type: 'special',
            title: '特训班',
            api: {
                detailList: 'SIGNUP-COMMON-DETAILLIST',
                classList: 'SIGNUP-SPECIAL-LIST',
                detailCSV: 'SIGNUP-COMMON-DETAILEXPORT',
                classCSV: 'SIGNUP-SPECIAL-EXPORT'
            },
            classColumns: columns
        };
    }
}
export default RegularCourseSignUpList;