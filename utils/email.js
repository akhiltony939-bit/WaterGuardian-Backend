const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({

    service:"gmail",

    auth:{

        user:process.env.EMAIL_USER,

        pass:process.env.EMAIL_PASS

    }

});



async function sendEmail(to,subject,message){


    try{


        await transporter.sendMail({

            from:process.env.EMAIL_USER,

            to:to,

            subject:subject,

            html:message

        });


        console.log("✅ Email Sent");


    }

    catch(error){

        console.log(
            "❌ Email Error:",
            error.message
        );

    }

}



module.exports = sendEmail;