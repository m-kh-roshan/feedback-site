const nodemailer = require('nodemailer')

const sendMail = async(to, subject, text, html, next) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: `"feedback-site" <${process.env.MAIL_FROM}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
        headers: {
            "x-liara-tag": "test_email"
        }
    }

    const info = await transporter.sendMail(mailOptions)

    return info
}

function confirmEmailBody (token, username) {
    const confirmLink = `${process.env.BASE_URL}/api/v1/users/confirmEmail?token=${token}`
    const body = `<h1> Confirm Email </h1>
    <p>Hello dear ${username} <br> 
    We appriciate you for register in my site. Please click on botttom link to confirm your mail.
    <a href="${confirmLink}"><button>confirm email link</button></a></p>`

    return body
}


function resetPasswordBody (token, username) {
    const confirmLink = `${process.env.FRONTEND_URL}/api/v1/users/resetPassword?token=${token}`
    const body = `<h1> Reset Password </h1>
    <p>Hello dear ${username} <br> 
    Please click on botttom link to reset your password.
    if you don't sent this request just ignore this
    <a href="${confirmLink}"><button>confirm email link</button></a></p>`

    return body
}

module.exports = {sendMail, confirmEmailBody, resetPasswordBody}