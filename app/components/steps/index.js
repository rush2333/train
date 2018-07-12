import React from 'react';
import "./index.css";
class StepsComponent extends React.Component{
    render(){
        let { current, children, className='', ...other } = this.props;
        if(current === undefined || current < 0 || current > children.length){
            current = 0;
        }
        let steps = React.Children.map(children, (ele,index) => {
            let np;
            if(index === current){
                np = {
                    className: 'q-active q-steps-item'
                }
            }
            return React.cloneElement(ele,np);
        });
        return (
            <div className={"q-steps " + className} {...other}>{steps}</div>
        )
    }
}
StepsComponent.Item = class extends React.Component{
    render(){
        const { children, ...other } = this.props;
        return (
            <div className="q-steps-item " {...other}>
               {children}
            </div>
        )
    }
};
export default StepsComponent;