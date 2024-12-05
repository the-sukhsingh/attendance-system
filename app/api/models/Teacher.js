const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
        },
    ],
    role:{
        type: String,
        default: "teacher",
    }
});


let Teacher;
if (mongoose.models.Teacher) {
    Teacher = mongoose.model('Teacher');
} else {
    Teacher = mongoose.model('Teacher', teacherSchema);
}

module.exports = Teacher;