'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollSchema = new Schema({
    question: String,
    answers: [String],
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    results: [{answer: Number}]
});

PollSchema
    .virtual('url')
    .get(function () {
        return '/polls/' + this.id + '-' + this.question;
    });

module.exports = mongoose.model('Poll', PollSchema);
