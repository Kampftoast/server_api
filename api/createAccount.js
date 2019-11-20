var AWS = require("aws-sdk");
var bcrypt = require("bcrypt");
var docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });

module.exports = {

    verifyInput: function (data, res) {
        if (data != null && data.username != null && data.password != null) {
            console.log("All data present for new account");
            this.checkUserAlreadyExisting(data, res);
        } else {
            res.status(400).send("Failed to create Account. Required Information missing").end();
        }
    },
    checkUserAlreadyExisting: function (input, res) {
        const username = input.username;
        let accountExist = false;
        let me = this;
        console.log("checking user name alredy exist..");
        const params = {
            TableName: "User",
            ProjectionExpression: "#username",
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
                res.status(500).send("Internal Database Error. Please contact us").end();
            } else {
                data.Items.forEach(function (item) {
                    if (item.username == username) {
                        accountExist = true;
                        res.status(500).send("Username already exist").end();
                    }
                });
            }
            if (data != null && accountExist == false) {
                me.encryptPassword(input, res, me.createUserAccount);
            }
        });

    },
    createUserAccount: function (input, hash, res) {
        console.log("create new account");

        const params = {
            TableName: "User",
            Item: {
                "username": input.username,
                "password": hash
            }
        };

        docClient.put(params, function (err, data) {
            if (err) res.status(500).send("An error occured while creating dataset").end();
            else res.status(200).send("Your Account has been created").end();
        });
    },
    encryptPassword: function (input, res, callback) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) res.status(500).send(err).end();
            bcrypt.hash(input.password, salt, function (err, hash) {
                if (err) res.status(500).send(err).end();
                else callback(input, hash, res);
            });
        });
    }
}
