import React from 'react';
import './index.css';
class Statistics extends React.Component{
    render(){
        const { children } = this.props;
        return (
            <div className="q-statistics">{children}</div>
        )
    }
}
Statistics.Item = class extends React.Component{
    render(){
        const { label, detail } = this.props;
        return (
            <div className="q-statistics-item">
                <label className="q-item-label">{label}</label>
                <div className="q-item-detail">{detail}</div>
            </div>
        )
    }
};
export default Statistics;
