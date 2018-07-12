import React from 'react';
import './input.css'
export default class InputComponent extends React.Component{
    render(){
        let { error, help, wrapRef, ...others } = this.props;
        let hasError = typeof error === 'object' && error !== null ? true : typeof error === 'string' && error.length ;
        let hasHelp = typeof help === 'object' && help !== null ? true : typeof help === 'string' && help.length ;
        let dynamicRef = {};
        if(wrapRef){
            dynamicRef = {
                ref: wrapRef
            }
        }
        return (
            <span className={hasError? 'q-invalid q-input': 'q-valid q-input'}>
                <input type="text" className="ant-input" {...dynamicRef} {...others}/>
                <div className="q-msg-block">
                    {hasHelp ? (<span className="q-help-msg">{help}</span>) : null}
                    {hasError ? (<span className="q-error-msg">{error}</span>) : null}
                </div>
            </span>
        )
    }
}

