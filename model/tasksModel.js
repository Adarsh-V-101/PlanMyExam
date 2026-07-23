const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    email: { type: String, required: true },
    subject: { type: String, required: true },
    goal:{type: String, required:true},
    startDate: { type: Date, required: true },
    examDate:{type: Date, required:true},
    tasks:[
        {
            dayNumber : { type: Number, required: true },
            title: { type: String, required: true },
            duration: { type: String, required: true}
        }
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
})

module.exports = mongoose.model('Task', taskSchema);