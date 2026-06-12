const cron = require('node-cron')
const sendEmail = require('./mailer')
const userModel = require('../models/userModel')
const taskModel = require('../models/taskModel')
const {emailTemplate} = require('./emailTemplate')

const dailyReminder = ()=>{
    cron.schedule('0 6 * * *', async ()=>{
        console.log('Running daily reminder task...')
        
    })
}