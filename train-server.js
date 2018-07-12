const express = require('express');
const compression = require("compression");
const fallback = require("express-history-api-fallback");
const app = new express();
app.use(compression());
app.use('/images', express.static('images'));
app.use('/build', express.static('build'));
app.use(fallback("build/index.html", {
    root: process.cwd()
}));
app.listen(4002, () =>{
    "use strict";
    console.info('server has started');
});