const { port_spare}  = require('./constant');
module.exports = {
    port: port_spare,
    files: ["./dev/**/*.{html,css,js}"],
    server: {
        baseDir: "./dev/",
        routes: {
            "/node_modules": "node_modules"
        }
    }
};