'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollSchema = new Schema({
    question: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    answersObject: Schema.Types.Mixed
});

PollSchema
    .virtual('url')
    .get(function () {
        return '/polls/' + this.id + '-' + this.question;
    });
    
PollSchema
    .virtual('answers')
    .get(function () {
        return Object.keys(this.answersObject);
});

module.exports = mongoose.model('Poll', PollSchema);
