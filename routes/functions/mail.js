function email(){
    return "energyproject2019@mail.ru";
}

function getMailTransporter(){
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'Mail.ru',
        secure: false, // use SSL
        port: 25, // port for secure SMTP
        auth: {
            user: email(),
            pass: 'energy2019.02'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    return transporter;
};


module.exports = {email, getMailTransporter};
