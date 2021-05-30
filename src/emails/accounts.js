const sgMail=require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail=(email,name) =>{sgMail.send({
    from:'aryanstorm6@gmail.com',
    to:email,
    subject:'Welcome to the task manager',
    text:`Hi ${name}, Welcome to the task manager app`

})
}

const sendCancellationMail=(email,name)=>{
    sgMail.send({
        from:'aryanstorm6@gmail.com',
        to:email,
        subject:'Adios',
        text:'Hey '+name+' Thank you for using the task manager app! We really wish you continued using our app. Is there anything that we could have done to keep you on board? Please leave your valuable feedback'
    })
}

module.exports={
    sendWelcomeMail,
    sendCancellationMail:sendCancellationMail
}