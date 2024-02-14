const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    full_name: {
        type: String,
        trim: true,
        required: true
    },
    email: { 
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    company_name: {
        type: String,
        trim: true,
    },
    project_name: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        trim: true,    
    },
    file: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Contact', ContactSchema)


