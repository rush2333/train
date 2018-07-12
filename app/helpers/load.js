import React from 'react';
import { Redirect } from 'react-router-dom';
import API from '../config/api';
import Fetch from '../helpers/fetch';
import { Modal } from 'antd';
class Loader extends React.Component{
    constructor(props){
        super(props);
        let compURL = props.compURL || "component-not-found.js";
        this.state = {
            mod: require("../" + compURL).default,
            outdated: false
        };
    }
    render(){
        let { cookies, match, ...rest } = this.props;
        let Mod = this.state.mod;
        let outDated = this.state.outdated;
        if (outDated) return <Redirect to="/login" push={true}/>;

        return Mod?<Mod
            match={match}
            cookies={cookies}
            loadData={(api, postData, finallyFn) => this.loadData(api, postData, finallyFn)}
            outputCSV={(api, postData) => this.outputCSV(api, postData)}
            {...rest}
        />: null;
    }
    loadData(api, postData, finallyFn){
        return Fetch.post(API[api], postData, finallyFn).then((res) => {
            return new Promise((resolve, reject) => {
                if(finallyFn && typeof finallyFn === 'function'){
                    finallyFn();
                }
                if(res.code === 1 || res.retCode === 1){
                    resolve(res);
                }else{
                    if(res.code === 1000){
                        return ;
                        Modal.warning({
                            title: '身份验证过期',
                            content: '您离上次操作已经有一段时间了，为了给您提供更好的服务，需要重新登录！',
                            onOk: () => this.setState({
                                outdated: true
                            })
                        })
                    }else{
                        reject(res);
                    }
                }
            });
        });;
    }
    outputCSV(api, postData={}){
        let searchStr = '?';
        Object.keys(postData).map((k,i) => {
            if(i === 0){
                searchStr += k + '=' + postData[k];
            }else{
                searchStr += '&' + k + '=' + postData[k];
            }
        });
        return window.open(location.origin + API[api] + searchStr);
    }
}
export default Loader;