import nodemailer from 'nodemailer';
import config from '../config';

class MailSenderService {
  static async sendMail(recipientEmail, verificationCode, subject) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mail.email,
        pass: config.mail.password
      }
    });


    let mailOptions = {
      from: config.fromEmail,
      to: recipientEmail,
      subject: subject,
      text: `Your verification code is: ${verificationCode}` // Plain text body
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log(`Mail sent to ${recipientEmail}: ${info.messageId}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default MailSenderService;

