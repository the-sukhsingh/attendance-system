const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  attendance: [
    {
      date: {
        type: Date,
        required: true,
      },
      attended: [
        {
          studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
          },
          present: {
            type: Boolean,
            required: true,
            default: false
          },
        },
      ],
    },
  ],
});

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

module.exports = Class;