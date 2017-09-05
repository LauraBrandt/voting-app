'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollSchema = new Schema({
    question: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    answersObject: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
});

PollSchema
    .virtual('url')
    .get(function () {
        var questionNoSpaces = this.question.replace(/\s/g, "-");
        return this.id + '-' + questionNoSpaces;
    });
    
PollSchema
    .virtual('answers')
    .get(function () {
        return Object.keys(this.answersObject);
});

module.exports = mongoose.model('Poll', PollSchema);
