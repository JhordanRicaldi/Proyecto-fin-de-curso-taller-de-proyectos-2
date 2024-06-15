import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "44aa9dd0968acf",
      pass: "de8c053b92a770"
    }
});


  

  
export default transporter;