var mongoose = require('mongoose');
var schema = {
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    formId: {
        type: String
    },
    portfolioLink: {
        type: String
    },
    customMessage: {
        type: String
    },
    attachments: [{
        path: String,
        fileName: String
    }],
    lastModified: {
        type: Date
    }
}
module.exports = mongoose.model('Profile', schema);