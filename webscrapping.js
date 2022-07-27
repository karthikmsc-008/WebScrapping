const https = require("https");
const http = require("http");

const options = {
  hostname: "thehindu.com",
  port: 443,
  path: "/latest-news",
  method: "GET",
};
let Values = [];
const req = https.get("https://www.thehindu.com/latest-news/", (res) => {
  let data = "";
  res.on("data", (d) => {
    data += d;
  });
  res.on("end", () => {
    let data1 = data.replace(/(\r\n|\n|\r)/gm, "");

    var checker = /<ul.*?<\/ul>/g;

    let val = [];
    let value = data1.match(checker);
    for (let i = 0; i < value.length; i++) {
      if (value[i].includes('class="latest-news"')) {
        val.push(value[i]);
      }
    }
    var checker1 = /<a.*?<\/a>/g;
    var checker2 = />.*<\/a>/g;
    var href = /href=".*"/g;
    let ar = [];
    let ar1 = [];
    let ar2 = [];
    let url;
    let head;

    for (let j = 0; j < val.length; j++) {
      ar = val[j].match(checker1);
      for (let k = 0; k < ar.length; k++) {
        ar2 = ar[k].match(href);
        ar1 = ar[k].match(checker2);
        let a = ar2[0].trim().split(" ")[0];
        url = a.substring(6, a.length - 1);
        head = ar1[0].trim().substring(1, ar1[0].length - 4);
        Values[k] = {
          Title: head,
          Link: url,
        };
      }
    }
   // console.log(Values);
  });
});

req.on("error", (error) => {
  console.error(error);
});
req.end();
http
  .createServer(function (req, res) {
    res.writeHead(200);
    res.write(JSON.stringify(Values));
    res.end("Finally");
  })
  .listen(3000);
