const nodemail = require('nodemailer');


const transporter = nodemail.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,       // true for 465, false for 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS   // 16-char app password
  }
});

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