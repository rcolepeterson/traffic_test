const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const url = "https://www.londontraffic.org/";
const nodeMailer = require("nodemailer");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors()); // include before other routes

const selectData = element => {
  const data = [];
  const reasons = [];
  const $ = cheerio.load(element);
  $("body div:nth-child(6) div.portlet-body h4").each((i, elem) => {
    let issue = $(elem).text();
    if (issue === "No Significant Events") {
      issue =
        "A13, City Route [A1203] Limehouse Link (TUNNEL) (E14) (Tower Hamlets)";
    }

    data.push({ title: issue });
  });
  $("body div:nth-child(6) div.portlet-body p").each((i, elem) => {
    let reason = $(elem).text();
    let snippedReason = reason.split("]", 1)[0] + "]";
    if (snippedReason === "]") {
      snippedReason = "Congestion [Minor Disruption - Up To 15 Minutes Delay]";
    }

    reasons.push({ reason: snippedReason });
  });

  return Promise.resolve({ title: data[0].title, reason: reasons[0].reason });
};

// returns traffic info.
app.get("/info", function(req, res) {
  axios
    .get(url)
    .then(response => {
      selectData(response.data).then(item => {
        res.setHeader("Content-Type", "application/json");
        //res.send(JSON.stringify({ traffic: item }));
        res.status(200).json({ type: "success", loc: item });
      });
    })
    .catch(error => {
      console.log(error);
    });
});
// expect a user object
/*
email: user.email,
    country: user.country,
    name: user.display_name
    */
//send email to jason that some one has used the idle interventions app.
app.post("/send-email", function(req, res) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "colepeterson1775@gmail.com",
      pass: "uonemqayseqmjcty"
    }
  });
  let subject = `${req.body.email} used idleInterventions`;
  let msg = `<h1>email: ${req.body.email}</h1><p>country: ${
    req.body.country
  }</p><p>userName: ${req.body.name}</p>`;
  let mailOptions = {
    from: '"IdleInterventions" <noreply@gmail.com>', // sender address
    to: "rcolepeterson@gmail.com", // list of receivers
    subject: subject,
    text: msg, // plain text body
    html: msg // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
    res.status(200).json({ type: "success", info: info.response });
  });
});

app.get("/", function(req, res) {
  res.status(200).send("this is a traffic service pour vous. v1");
});

module.exports = {
  app
};

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});
