var AWS = require("aws-sdk");
var bcrypt = require("bcrypt");
var docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });


module.exports = {
    verifyInput: function (data, res) {

        if (data != undefined && data.username != undefined && data.password != undefined) {
            this.getUserData(data, res);
        } else {
            res.status(403).status("Required Login information missing").end();
        }
    },
    getUserData: function (userdata, res) {
        var username = userdata.username;
        var iteration = 0;
        var userItem;
        var me = this;


        console.log("getting username..");
        var params = {
            TableName: "User",
            Select: "ALL_ATTRIBUTES",
            KeyConditionExpression: "#username = :usernameInput",
            ExpressionAttributeNames: {
                "#username": "username",
            },
            ExpressionAttributeValues: {
                ":usernameInput": username
            }
        };

        docClient.query(params, function (err, data) {
            if (err) {
                console.log(err)
                res.status(500).send("Internal Database Error.Please contact us").end();
            } else {
                data.Items.forEach(function (item) {
                    if (item.username == username) {
                        accountExist = true;
                        iteration++;
                        userItem = item;
                    }
                });
            }
            if (data.Count == 0) {
                res.status(404).send("Unkown Username").end();
            } else if (iteration == data.Count) {
                me.decryptUserPassword(userdata, userItem.password, res);
            }
        });

    },
    decryptUserPassword: function (userdata, userHash, resCall) {
        bcrypt.compare(userdata.password, userHash, function (err, res) {
            if (res) resCall.status(200).send("Login successfull").end();
            else resCall.status(500).send("Wrong password!").end();
        });
    },
}