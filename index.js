const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const url = "https://www.londontraffic.org/";
const urlNYC =
  "https://traffic.api.here.com/traffic/6.3/incidents.json?app_id=EJdxxsO8hXrE0JVWwxQk&app_code=rb6BECpUj0omaaeibHeVZw&bbox=41.72886531117612,-74.62237437500002;39.68242929874689,-73.39190562500002&criticality=major&maxresults=1";
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
      snippedReason = "Congestion [Minor Disruption - Up To 25 Minutes Delay]";
    }

    reasons.push({ reason: snippedReason });
  });
  let myreason = "";
  if (reasons[0].reason) {
    myreason = reasons[0].reason;
  }

  return Promise.resolve({ title: data[0].title, reason: myreason });
};

// returns traffic info. LONDON.
app.get("/info", function(req, res) {
  axios
    .get(url)
    .then(response => {
      selectData(response.data).then(item => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ type: "success", loc: item });
      });
    })
    .catch(error => {
      console.log(error);
      let item = {
        title:
          "A30 westbound between A308 and M25 | Westbound | Congestion South East Surrey",
        reason: "Congestion [Minor Disruption - Up To 25 Minutes Delay]"
      };
      res.status(200).json({ type: "success", loc: item });
    });
});

// selectContent - NYC -

const selectDataNYC = dataTraffic => {
  const data = [];
  const reasons = [];
  let myreason =
    dataTraffic.TRAFFIC_ITEMS.TRAFFIC_ITEM[0].TRAFFIC_ITEM_DESCRIPTION[0].value;
  let title = "Heavy Traffic: LOTS OF SLOW TRAFFIC";

  return Promise.resolve({
    title: title,
    reason: myreason,
    timestamp: dataTraffic.TIMESTAMP
  });
};

// returns traffic info. LONDON.
app.get("/infonyc", function(req, res) {
  axios
    .get(urlNYC)
    .then(response => {
      selectDataNYC(response.data).then(item => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ type: "success", traffic: item });
      });
    })
    .catch(error => {
      console.log(error);
      let item = {
        title: "Heavy Traffic: LOTS OF SLOW TRAFFIC",
        reason: "At West St - Construction work.",
        timestamp: new Date()
      };
      res.status(200).json({ type: "success", traffic: item });
    });
});

/*
Send email to Jason and Cole for analytics.
expect a user object
    {
      email: user.email,
      country: user.country,
      name: user.display_name
    }
    */
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
  let msg = `<h1>email: ${req.body.email}</h1><p>country: ${req.body.country}</p><p>userName: ${req.body.name}</p>`;
  let mailOptions = {
    from: '"IdleInterventions" <noreply@gmail.com>', // sender address
    to: "jason.carmel@Possible.com, rcolepeterson@gmail.com", // list of receivers
    subject: subject,
    text: msg, // plain text body
    html: msg // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    //console.log("Message %s sent: %s", info.messageId, info.response);
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
  //console.log(`App listening on port ${port}`);
});
