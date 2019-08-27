// axios
//   .get(url)
//   .then(response => {
//     selectData(response.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// const selectData = element => {
//   const data = [];
//   const $ = cheerio.load(element);
//   $("body div:nth-child(6) div.portlet-body h4").each((i, elem) => {
//     console.log("title:", i, $(elem).text());
//     console.log(
//       "body:",
//       $(elem)
//         .closest("div")
//         .find("p")
//         .text()
//     );
//     data.push({ title: $(elem).text() });
//   });

//   console.log("data", data);
// };

/*

console.log("we are working");
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const url = "https://www.londontraffic.org/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors()); // include before other routes

const selectData = element => {
  const data = [];
  const $ = cheerio.load(element);
  $("body div:nth-child(6) div.portlet-body h4").each((i, elem) => {
    data.push({ title: $(elem).text() });
  });
  return Promise.resolve(data[0].title);
};

app.get("/traffic", function(req, res) {
  axios
    .get(url)
    .then(response => {
      selectData(response.data).then(item => {
        console.log("item", item);
        res.setHeader("Content-Type", "application/json");
        //res.send(JSON.stringify({ traffic: item }));
        res.status(200).json({ type: "success", traffic: item.trim() });
      });
    })
    .catch(error => {
      console.log(error);
    });
});

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});

module.exports = (req, res) => {
  axios
    .get(url)
    .then(response => {
      selectData(response.data).then(item => {
        console.log("item", item);
        res.setHeader("Content-Type", "application/json");
        //res.send(JSON.stringify({ traffic: item }));
        res.status(200).json({ type: "success", traffic: item.trim() });
      });
    })
    .catch(error => {
      console.log(error);
    });
};



*/
