import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';
import AppComponent from './app/app';
const mount = document.getElementById('app');
window.onresize = function(){
    render();
};
const render = () => {
    ReactDOM.render(
        (<BrowserRouter>
            <CookiesProvider>
                <AppComponent rLocation={location} initHeight={window.innerHeight}/>
            </CookiesProvider>
        </BrowserRouter>),
        mount
    );
};
render();