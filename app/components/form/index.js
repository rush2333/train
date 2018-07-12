import React, { Component } from 'react';
import './index.css';
class FormComponent extends Component{
    render(){
        let { direction, children, className='',labelWidth, ...others } = this.props;
        let renderElements = React.Children.map(children, (ele,idx) =>{
            let np = {
                ...ele.props
            };
            if(labelWidth){
                np.labelWidth = labelWidth;
            }
            return React.cloneElement(ele, np);
        });
        let classNames = 'form';
        if(direction === 'vertical'){
            classNames += ' form-vertical'
        }else{
            classNames += ' form-horizontal'
        }
        classNames += ' ' + className + ' ';
        return (
            <form action="javascript:;" className={classNames}>{renderElements}</form>
        )
    }
}
FormComponent.Group = class extends Component{
    render(){
        const { label, labelWidth, marginBottom, children, ...others } = this.props;
        return (
            <div className='form-group' style={{marginBottom: marginBottom?marginBottom:'25px'}}>
                <label className="form-label" style={{width: labelWidth ? labelWidth : 'inherit'}}>{label}：</label>
                <div className='form-detail' {...others}>{children}</div>
            </div>
        )
    }
};
export default FormComponent;