//--backend dependencies--
var express = require("express");
var apiRouter = require("./api/apiRouter.js");
var server = express();
var bodyParser = require("body-parser");

//accept JSON
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.post("*", function (req, res) {
    apiRouter.route(req, res);
}),

    server.get("*", function (req, res) {
        return handle(req, res);
    })



console.log("Server online");
server.listen(3001);


