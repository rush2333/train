import 'babel-polyfill';
import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import WithoutNav from './includes/without-nav'
import WithNav from './includes/with-nav'
import { routes_without_nav, routes_with_nav } from './config/routes';
import Loader from "./helpers/load";
import "../css/app.css"
class App extends React.Component{
    render(){
        let { rLocation, initHeight, cookies } = this.props;
        let without_nav = false;
        let len = routes_without_nav.length;
        for(let index = 0;index < len; index++){
            let pathname = routes_without_nav[index].pathname;
            if(rLocation.pathname === pathname){
                without_nav = true;
                break;
            }else{
                let index = pathname.indexOf(':');
                if(index !== -1){
                    let reg = new RegExp(pathname.slice(0,index));
                    if(reg.test(rLocation.pathname)){
                        without_nav = true;
                        break;
                    }
                }
            }
        }
        return without_nav ?
            (<WithoutNav initHeight={initHeight} cookies={cookies} pathname={rLocation.pathname}>
            {
                routes_without_nav.map(r => (
                    <Route path={r.pathname} key={r.pathname} render={({match}) => (<Loader match={match} compURL={r.compURL} cookies={cookies}/>)}/>
                ))
            }
            </WithoutNav>)
            :
            (<WithNav pathname={rLocation.pathname} initHeight={initHeight} cookies={cookies}>
                <Switch>
                {
                    routes_with_nav.map(r => (
                        <Route exact={true} path={r.pathname} key={r.pathname} render={({match}) => (<Loader match={match} compURL={r.compURL} cookies={cookies}/>)}/>
                    ))
                }
                {
                    !!cookies.get('_p') ? <Redirect to="/course/regular/list"/>: <Redirect to="/login"/>
                }
                </Switch>
            </WithNav>);
    }
}

export default withCookies(App);