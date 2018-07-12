import React, { Component } from 'react';
class SearchBarComponent extends Component{
    render(){
        const { left=[], right=[], ...other } = this.props;
        return (
            <form className="q-search-bar" action="javascript:;" {...other}>
                <div className="q-search-bar-left">
                    {left.map((C,index) =><div className="q-form-group q-horizontal q-mrg-b0" key={index}>
                        <label className="q-form-label">{C.label + "："}</label>
                        <C.Element {...C.props}>{C.children}</C.Element>
                    </div>)}
                </div>
                <div className="q-search-bar-right">
                    {right.map((Comp ,index)  => <Comp.Element key={index} {...Comp.props}>{Comp.value}</Comp.Element>)}
                </div>
            </form>
        )
    }
}

export default SearchBarComponent;