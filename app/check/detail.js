import React from 'react';
import CommonPage from '../templates/common-page';
import { Input, Button } from 'antd';
import { CommonPageComponent, SearchBarComponent, CardComponent, StatisticsComponent } from '../components/index';
class CheckDetailList extends CommonPage{
    constructor(props){
        super(props);
        this.state = {
            params: {
                key: '',
                page: 1,
                row: 15,
                attend_id: props.match.params.id
            },
            rows: [],
            total: 0,
            statistic: {}
        }
    }
    render(){
        const columns = [
            {
                title: '学员ID',
                dataIndex: 'id',
                key: 'id',
            }, {
                title: '学员姓名',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '学员性别',
                dataIndex: 'sex',
                key: 'sex',
            }, {
                title: '联系电话',
                dataIndex: 'phone',
                key: 'phone',
            }, {
                title: '出勤情况',
                dataIndex: 'type',
                key: 'type',
            }, {
                title: '历史请假次数',
                dataIndex: 'leave_count',
                key: 'leave_count',
            }, {
                title: "剩余课程节数",
                dataIndex: 'count',
                key: 'count'
            }
        ];
        const { rows, total, statistic, params } = this.state;
        return (
            <CommonPageComponent title="考勤管理/考勤详情" table={{dataSource: rows, columns, rowKey: 'id' , total, onChange: (page) => this.getCheckDetailList({page})}}>
                <SearchBarComponent
                    left={[{
                        label: "搜索",
                        Element: Input,
                        props: {
                            placeholder: '请输入关键字',
                            onChange: (e) => this.controlKey(e.target.value),
                            onPressEnter: (e) => this.getCheckDetailList({
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
                            onClick: () => this.props.outputCSV('MANAGE-ATTENDANCE-EXPORT', params)
                        }
                    }]}/>
                <CardComponent title="数据统计">
                    <StatisticsComponent>
                        <StatisticsComponent.Item label="学员人数-总" detail={statistic.all_count || 0}/>
                        <StatisticsComponent.Item label="出勤人数" detail={statistic.attend_count || 0}/>
                        <StatisticsComponent.Item label="请假人数" detail={statistic.leave_count || 0}/>
                        <StatisticsComponent.Item label="旷课人数" detail={statistic.cut_count || 0}/>
                    </StatisticsComponent>
                </CardComponent>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getCheckDetailList();
    }
    getCheckDetailList(params){
        let p = Object.assign({}, this.state.params, {
            ...params
        });
        this.props.loadData('MANAGE-ATTENDANCE-DETAIL', p).then((res) => {
            let { rows, total, statistic } = res.content;
            if(!statistic){
                statistic = {};
            }
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

export default CheckDetailList;