'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    oauthID: String,
    displayName: String
});

module.exports = mongoose.model('User', UserSchema);
