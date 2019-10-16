require("dotenv").config();
const nodemailer  = require("nodemailer"),
      hbs         = require("nodemailer-express-handlebars"),
      { google }  = require("googleapis"),
      OAuth2      = google.auth.OAuth2;

function sendEmail() {

  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.refresh_token
  });
  const accessToken = oauth2Client.getAccessToken();
  
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "schedulingapp742@gmail.com",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.refresh_token,
      accessToken: accessToken
    }
  });
  
  const mailOptions = {
    from: "schedulingapp742@gmail.com",
    to: "schedulingapp742@gmail.com",
    subject: "This is a test Email with OAuth",
    generateTextFromHTML: true,
    html: "<b>test</b>"
  };
  
  smtpTransport.sendMail(mailOptions, (error, response) => {
     error ? console.log(error) : console.log(response);
     smtpTransport.close();
  });

};

module.exports = sendEmail;
