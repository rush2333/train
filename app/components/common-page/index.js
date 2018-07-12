import React, { Component } from 'react';
import { Button } from 'antd';
import TableComponent from '../table';
import './index.css';
class CommonPageComponent extends Component{
    render(){
        const { className='', bordered, title, table=false, pageFooter, children } = this.props;
        let renderTable = null;
        let renderFooter = null;
        if(table){
            renderTable = (<TableComponent {...table}/>);
        }
        if(pageFooter){
            let { ok, cancel } = pageFooter;
            renderFooter = (<footer className="q-page-footer"><Button onClick={cancel.onClick}>{cancel.value}</Button><Button disabled={ok.disabled === true} type="primary" onClick={ok.onClick}>{ok.value}</Button></footer>)
        }
        return (<section className={className}>
            <h1 className="q-page-title" style={bordered === false ? {borderBottom: 'none'}:{}}>{title}</h1>
            <div className="q-page-content">
                {children}
                {renderTable}
            </div>
            {renderFooter}
        </section>)
    }

}
export default CommonPageComponent;