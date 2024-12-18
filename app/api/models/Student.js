const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
    role:{
        type: String,
        default: "student",
    },

});

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

module.exports = Student;