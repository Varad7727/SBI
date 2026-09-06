require('dotenv').config();
const nodemailer = require('nodemailer');
//transporter is used for contacting smtp serveer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"DEUTCHE-BANK" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const sendRegistrationEmail=async(usermail,name)=>{
  const subject = 'Welcome to DEUTCHE-BANK';
  const text = `Hello ${name},\n\nThank you for registering with DEUTCHE-BANK. We are excited to have you on board!`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering with DEUTCHE-BANK. We are excited to have you on board!</p>`;
  await sendEmail(usermail, subject, text, html);
};

const sendTransactionEmail=async(userEmail,name,amount,toAccount)=>{
  const subject = 'Transaction Confirmation';
  const text = `Hello ${name},\n\nYour transaction of amount ${amount} to account ${toAccount} has been successfully completed.`;
  const html = `<p>Hello ${name},</p><p>Your transaction of amount ${amount} to account ${toAccount} has been successfully completed.</p>`;
  await sendEmail(userEmail, subject, text, html);
} 
const sendTransactionEmailFailed=async(userEmail,name,amount,toAccount)=>{
  const subject = 'Transaction Failed';
  const text = `Hello ${name},\n\nYour transaction of amount ${amount} to account ${toAccount} has failed.`;
  const html = `<p>Hello ${name},</p><p>Your transaction of amount ${amount} to account ${toAccount} has failed.</p>`;
  await sendEmail(userEmail, subject, text, html);
} 

module.exports = { sendEmail, sendRegistrationEmail, sendTransactionEmail, sendTransactionEmailFailed };
