import React from 'react';
import { Collapse, Row, Col } from 'antd';
import { CommonPageComponent } from '../components';
import { moneyFormator } from '../utils';
const { Panel } = Collapse;
import { weeks} from "../config/CONSTANT";
class RegularSpecialDetailTemplate extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: {
                cycle: '',
                course_detail: [],
                trainer: {},
                area: '',
                regi_begin: '',
                regi_end: ''
            }
        }
    }
    render(){
        const { data } = this.state;
        let cList = data.cycle.split(',');
        let wList = [];
        weeks.map((w) => {
            cList.forEach(c => {
                if(w.value === parseInt(c)){
                    wList.push(w.label);
                }
            })
        });
        let cdList = [];
        data.course_detail.map(cd => {
             cdList.push(cd.course_begin + '-' + cd.course_end);
        });
        const pageConfig = this.pageConfig;
        return (
            <CommonPageComponent title={pageConfig.value + '/课程信息'}>
                <div className="q-detail-container">
                    <Collapse bordered={false} defaultActiveKey={['0','1','2','3']}>
                        <Panel header='基础信息' key="0">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div className="q-detail-item">
                                        <label>课程名称：</label>
                                        <div>{data.name}</div>
                                    </div>
                                </Col>
                                <Col span={16}>
                                    <div className="q-detail-item">
                                        <label>上课时间：</label>
                                        <div>{wList.join('、') + ' ' + cdList.join('、')}</div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div className="q-detail-item">
                                        <label>上课地点：</label>
                                        <div>{data.area.split('/').join('') + data.address}</div>
                                    </div>
                                </Col>
                                {pageConfig.type === 'special'?(
                                    <Col span={14}>
                                        <div className="q-detail-item">
                                            <label>报名时间：</label>
                                            <div>{data.regi_begin + ' ~ ' + data.regi_end}</div>
                                        </div>
                                    </Col>
                                ):null}
                            </Row>
                        </Panel>
                        <Panel header='其他信息' key="1">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div className="q-detail-item">
                                        <label>报名费用：</label>
                                        <div>{moneyFormator(data.cost)}</div>
                                    </div>
                                </Col>
                                <Col span={16}>
                                    <div className="q-detail-item">
                                        <label>标准课程节数：</label>
                                        <div>{pageConfig.type === 'special' ? data.count_standard : data.count}节</div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div className="q-detail-item">
                                        <label>咨询电话：</label>
                                        <div>{data.tel}</div>
                                    </div>
                                </Col>
                                {pageConfig.type === 'special' ? (
                                    <Col span={14}>
                                        <div className="q-detail-item">
                                            <label>最少报名节数：</label>
                                            <div>{data.count_less}节</div>
                                        </div>
                                    </Col>
                                ):null}
                                <Col span={14}>
                                    <div className="q-detail-item">
                                        <label>带班主教：</label>
                                        <div>{data.trainer.name}</div>
                                    </div>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel header='比赛简介' key="2">
                            <Row>
                                <Col span={24}>
                                    <div className="q-detail-item">
                                        <label>比赛简介：</label>
                                        <div className="q-detail-description" dangerouslySetInnerHTML={{__html: data.description}}/>
                                    </div>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel header='其他' key="3">
                            <Row>
                                <Col span={24}>
                                    <div className="q-detail-item">
                                        <label>报名链接：</label>
                                        <div>{data.register_url}</div>
                                    </div>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </div>
            </CommonPageComponent>
        )
    }
    componentDidMount(){
        this.getCourseDetail();
    }
}
export default RegularSpecialDetailTemplate;