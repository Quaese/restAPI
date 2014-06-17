define([
    'mongoose'
], function (mongoose) {
    'use strict';

    var Schema = mongoose.Schema;

    // AccessToken
    var AccessToken = new Schema({
        userId: {
            type: String,
            required: true
        },
        secret: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            unique: true,
            required: true
        },
        refershToken: {
            type: String,
            unique: true,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        }
    });

    var AccessTokenModel = mongoose.model('AccessToken', AccessToken);

    return AccessTokenModel;
});