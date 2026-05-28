const mongoose = require('mongoose')



const taskSchema = new mongoose.Schema({
    date: { type: String, required: true },
    email: { type: String, required: true },
    tasks:[
        {
            subject: { type: String, required: true },
            title: { type: String, required: true },
            duration: { type: String, required: true}
        }
    ]
})

module.exports = mongoose.model('Task', taskSchema);