const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_HOST,
  port: Number(process.env.SES_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  },
});

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Amazon SES Mail Sender</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Segoe UI',sans-serif;
}

body{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(135deg,#0f172a,#1e293b,#2563eb);
    padding:20px;
}

.container{
    width:100%;
    max-width:750px;
    background:white;
    border-radius:20px;
    padding:40px;
    box-shadow:0 25px 50px rgba(0,0,0,0.25);
}

.logo{
    text-align:center;
    font-size:60px;
    margin-bottom:10px;
}

h1{
    text-align:center;
    color:#1e293b;
    margin-bottom:10px;
}

.subtitle{
    text-align:center;
    color:#64748b;
    margin-bottom:30px;
}

.info-box{
    background:#eff6ff;
    border-left:5px solid #2563eb;
    padding:15px;
    border-radius:10px;
    margin-bottom:25px;
    color:#1e293b;
}

label{
    display:block;
    font-weight:600;
    margin-bottom:8px;
    color:#334155;
}

input,
textarea{
    width:100%;
    padding:14px;
    border:1px solid #cbd5e1;
    border-radius:10px;
    margin-bottom:20px;
    font-size:15px;
    transition:0.3s;
}

input:focus,
textarea:focus{
    outline:none;
    border-color:#2563eb;
    box-shadow:0 0 0 4px rgba(37,99,235,0.15);
}

textarea{
    min-height:220px;
    resize:vertical;
}

button{
    width:100%;
    border:none;
    padding:15px;
    border-radius:10px;
    font-size:16px;
    font-weight:bold;
    color:white;
    cursor:pointer;
    background:linear-gradient(135deg,#2563eb,#1d4ed8);
    transition:0.3s;
}

button:hover{
    transform:translateY(-2px);
    box-shadow:0 10px 25px rgba(37,99,235,0.35);
}

.footer{
    margin-top:25px;
    text-align:center;
    color:#94a3b8;
    font-size:13px;
}
</style>
</head>

<body>

<div class="container">

    <div class="logo">📧</div>

    <h1>Amazon SES Mail Sender</h1>

    <p class="subtitle">
        Send emails securely using Amazon SES SMTP
    </p>

    <div class="info-box">
        Verified sender and recipient addresses are configured through environment variables.
    </div>

    <form method="POST" action="/send">

        <label>Subject</label>
        <input
            type="text"
            name="subject"
            placeholder="Enter email subject"
            required
        >

        <label>Message</label>
        <textarea
            name="message"
            placeholder="Type your email message..."
            required
        ></textarea>

        <button type="submit">
            Send Email
        </button>

    </form>

    <div class="footer">
        Powered by Amazon SES • Node.js • Docker
    </div>

</div>

</body>
</html>
`);
});

app.post("/send", async (req, res) => {
  const { subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: subject,
      text: message,
    });

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    body{
      font-family:Segoe UI,sans-serif;
      background:#f8fafc;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
    }

    .card{
      background:white;
      padding:40px;
      border-radius:20px;
      text-align:center;
      box-shadow:0 15px 40px rgba(0,0,0,.1);
    }

    h2{
      color:#16a34a;
      margin-bottom:15px;
    }

    a{
      text-decoration:none;
      color:white;
      background:#2563eb;
      padding:12px 20px;
      border-radius:10px;
      display:inline-block;
      margin-top:20px;
    }
    </style>
    </head>

    <body>
      <div class="card">
        <h2>✅ Email Sent Successfully</h2>
        <p>Your message has been delivered using Amazon SES.</p>
        <a href="/">Send Another Email</a>
      </div>
    </body>
    </html>
    `);

  } catch (error) {
    console.error(error);

    res.status(500).send(`
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    body{
      font-family:Segoe UI,sans-serif;
      background:#fef2f2;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
    }

    .card{
      background:white;
      padding:40px;
      border-radius:20px;
      text-align:center;
      box-shadow:0 15px 40px rgba(0,0,0,.1);
      max-width:700px;
    }

    h2{
      color:#dc2626;
      margin-bottom:15px;
    }

    pre{
      text-align:left;
      background:#f8fafc;
      padding:15px;
      border-radius:10px;
      overflow:auto;
    }

    a{
      text-decoration:none;
      color:white;
      background:#2563eb;
      padding:12px 20px;
      border-radius:10px;
      display:inline-block;
      margin-top:20px;
    }
    </style>
    </head>

    <body>
      <div class="card">
        <h2>❌ Email Sending Failed</h2>
        <pre>${error.message}</pre>
        <a href="/">Go Back</a>
      </div>
    </body>
    </html>
    `);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:" + (process.env.PORT || 3000));
});
