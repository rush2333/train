const express = require('express');
const compression = require("compression");
const fallback = require("express-history-api-fallback");
const React = require('react');
const ReactDOM = require('react-dom/server');
const ReactRouterDOM = require('react-router-dom');
const cookiesMiddleware = require('universal-cookie-express');
const CookiesProvider = require('react-cookie').CookiesProvider;
const AppComp = require('./build/app.server.js').library.default;
const routes = require('./build/routes.server.js').library;
const manifestConfig = require('./build/manifest.json');
const app = new express();
const StaticRouter = ReactRouterDOM.StaticRouter;
app.use(compression());
app.use(cookiesMiddleware());
app.use((req, res, next) => {
    let build = /^\/build\//;
    let images = /^\/images\//;
    if(build.test(req.url) || images.test(req.url)){
        next();
    }else{
        const context = {};
        const rLocation = {
            pathname: req.url
        };
        let content = ReactDOM.renderToString(
            React.createElement(
                StaticRouter,
                {
                    context,
                    location: {
                        url: req.url
                    }
                },
                React.createElement(
                    CookiesProvider,
                    {
                        cookies: req.universalCookies
                    },
                    React.createElement(
                        AppComp,
                        {
                            rLocation
                        }
                    )
                )
            )
        );
        res.send(renderPage(content));
    }
});
app.use('/images', express.static('images'));
app.use('/wangeditor', express.static('node_modules/wangeditor'));
app.use('/build', express.static('build'));
app.use(fallback("build/index.html", {
    root: process.cwd()
}));
app.listen(4002, () =>{
    "use strict";
    console.info('server has started');
});
function renderPage(content) {
    let indexCss = '/build/' + manifestConfig['index.css'];
    let indexJs = '/build/' + manifestConfig['index.js'];
    let manifestJs = '/build/' + manifestConfig['manifest.js'];
    let vendorJs = '/build/' + manifestConfig['vendor.js'];
    return(
`
    <!doctype html>
    <head>
          <meta charset="UTF-8">
        <title>羽毛球培训系统</title>
        <link type="image/x-icon" rel="shortcut icon" href="/images/logo.svg">  
        <link rel="stylesheet" href=${indexCss}>
    </head>
    <body>
        <div id="app">${content}</div>
        <script src=${manifestJs}></script>
        <script src=${vendorJs}></script>
        <script src=${indexJs}></script>
    </body>
`)
}