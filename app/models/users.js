'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    oauthID: String,
    displayName: String,
	polls: [{ type: Schema.Types.ObjectId, ref: 'Poll' }]
});

module.exports = mongoose.model('User', UserSchema);
