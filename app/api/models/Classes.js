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
      name: {
        type: String,
        required: true,
      },
      rollNo: {
        type: String,
        required: true,
      },
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
          name:{
            type: String,
            required: true
          },
          rollNo: {
            type: String,
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