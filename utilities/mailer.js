const nodemail = require('nodemailer');

const transporter = nodemail.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

const sendEmail = async ({to, subject, text})=>{
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    }  
    await transporter.sendMail(sendEmail);
};

module.exports = sendEmail;