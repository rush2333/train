import React from 'react';
import { Button } from 'antd';
import './index.css';
import imgSrc from '../../../images/logo.svg';
class PhoneComponent extends React.Component{
    render(){
        const { data } = this.props;
        const { title, classTime, registerTime, cost, tel, address, description } = data;
        return (
            <div className='phone'>
                <div className="phone-container">
                    <header className="phone-header"/>
                    <div className="phone-content">
                        <div className="phone-pane">
                            <header className="summary-header">
                                <div className="phone-logo-container">
                                    <div className="phone-logo-content">
                                        <div className="q-bare"/>
                                        <img src={imgSrc} className="phone-logo"/>
                                    </div>
                                </div>
                                <h3 className="summary-title">{title || '培训班名称'}</h3>
                            </header>
                            <div className="summary-main">
                                <div className="msg-group">
                                    <label className="msg-label">上课时间：</label>
                                    <div className="msg-detail">
                                        <span>{classTime}</span>
                                    </div>
                                </div>
                                {registerTime ? (
                                    <div className="msg-group">
                                        <label className="msg-label">报名时间：</label>
                                        <div className="msg-detail">
                                            <span>{registerTime}</span>
                                        </div>
                                    </div>
                                ):null}
                                <div className="msg-group">
                                    <label className="msg-label">报名费用：</label>
                                    <div className="msg-detail">
                                        <span>{cost || 0}元</span>
                                    </div>
                                </div>
                                <div className="msg-group">
                                    <label className="msg-label">咨询电话：</label>
                                    <div className="msg-detail">
                                        <span>{tel}</span>
                                    </div>
                                </div>
                                <div className="msg-group">
                                    <label className="msg-label">上课地点：</label>
                                    <div className="msg-detail">
                                        <div className="msg-area">
                                            <span>{address}</span>
                                        </div>
                                        <div className="msg-btn">
                                            <Button size="small" type="primary" ghost>导航</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="phone-pane">
                            <header className="detail-header">
                                <h3 className="detail-title">课程详情</h3>
                            </header>
                            <div className="detail-main" style={{wordWrap: 'break-word', wordBreak: 'normal'}} dangerouslySetInnerHTML={{__html: description}}/>
                        </div>
                    </div>
                    <div className="phone-btn-pane">
                        <Button type="primary" size="large">报名</Button>
                    </div>
                </div>
                <footer>
                    {/*hello world*/}
                </footer>
            </div>
        )
    }
}
export default PhoneComponent;

