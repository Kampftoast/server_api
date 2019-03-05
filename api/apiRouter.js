var createUserFile = require("./createAccount.js");
var loginFile = require("./login.js");
module.exports = {

    route: function (req, res) {
        var requestURl = req.params[0];
        if (req.body.csrf == undefined) {
            switch (requestURl) {
                case "/api/createaccount":
                    createUserFile.verifyInput(req.body, res);
                    break;
                case "/api/login":
                    loginFile.verifyInput(req.body, res);
                    break;
                default:
                    res.status(400).send("Unknown API call").end();
                    break;
            }
        } else[
            //crsf token required zone
        ]
    }
}
