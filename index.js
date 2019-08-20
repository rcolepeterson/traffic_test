const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://www.londontraffic.org/";
axios
  .get(url)
  .then(response => {
    selectData(response.data);
  })
  .catch(error => {
    console.log(error);
  });

const selectData = element => {
  const data = [];
  const $ = cheerio.load(element);
  $("body div:nth-child(6) div.portlet-body h4").each((i, elem) => {
    console.log("title:", i, $(elem).text());
    console.log(
      "body:",
      $(elem)
        .closest("div")
        .find("p")
        .text()
    );
    data.push({ title: $(elem).text() });
  });

  console.log("data", data);
};

exports.trafficNews = (req, res) => {
  let message = req.query.message || req.body.message || "Hello World!";
  res.status(200).send(message);
};
