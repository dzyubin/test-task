const express = require('express')
const url = require('url')
const fs = require('fs')
const https = require('https')
const sys = require('sys')
// const http = require('http');
const htmlParser = require('htmlparser')
const getHrefs = require('get-hrefs')
const app = express()
const port = 3002

app.get('/', (req, res) => res.send('Hello World!'))

let siteUrl = ""
let depth = 3
let searchPhrase = ""

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);

  // console.log(array)

  siteUrl = array[2]
  depth = parseInt(array[3], 10)
  searchPhrase = array[4]

});

const parsePageContent = (siteContent, siteUrl) => {
  // const str = sit
  console.log(searchPhrase)
  // let regex = /dogs/gi;
  let re = new RegExp(searchPhrase, "gi");
  let result, indices = [];
  while ( (result = re.exec(siteContent)) ) {
    indices.push(result.index)
  }

  console.log(indices.length)
  // console.log(siteContent)

  fs.appendFile('result.txt', `${siteUrl.host}${siteUrl.path} | ${indices.length}\n`, function (err) {
    if (err) throw err
    console.log('Saved!')
  })
}

/*for (let i = 0; i < 1; i =+ 1) {
  let request = https.request(options, function (res) {
    let pageContent = '';
    res.on('data', function (chunk) {
      pageContent += chunk;
    });
    res.on('end', function () {
      // console.log(data);
      parsePageContent(pageContent)
      // getPageContent(getChildUrl(pageContent))
      getChildUrl(pageContent)
    });
  });

  request.on('error', function (e) {
    console.log(e.message);
  });

  request.end();
}*/

const getChildUrl = (pageContent) => {
  const hrefs = getHrefs(pageContent, { forceHttps: true })

  const re = new RegExp(/.*dogs.*/)
  hrefs.forEach(hr => {
    // console.log(hr)
    if (re.exec(hr)) console.log(hr)
  })


  // console.log(arr.input)

  return
  const handler = new htmlParser.DefaultHandler(function (error, dom) {
    if (error)
      console.log(error)
    else
      console.log("done parsing")
  });

  let parser = new htmlParser.Parser(handler)
  parser.parseComplete(pageContent)
  sys.puts(sys.inspect(handler.dom, false, null))
}

const getPageContent = (siteUrl) => {
  if (depth === 0) return

  siteUrl = url.parse(siteUrl)
  console.log(url)

  const { protocol, host, path } = siteUrl

  const options = {
    protocol,
    host,
    path
  }

  if (protocol === 'https:')  options.port = 443

  let request = https.request(options, function (res) {
    let pageContent = '';
    res.on('data', function (chunk) {
      pageContent += chunk;
    });
    res.on('end', function () {
      // console.log(data);
      parsePageContent(pageContent, siteUrl)
      getChildUrl(pageContent)
      // depth =- 1
      // getPageContent()
    });
  });

  request.on('error', function (e) {
    console.log(e.message);
  });

  request.end();
}

getPageContent(siteUrl)

const getHref = (arr) => {
  arr.forEach(href => {
    // console.log(href)
    // console.log("\n")
    const re = new RegExp(searchPhrase)
    if ( href.match(re) ) {
      // console.log(href)
      return href
    }
    // console.log(arr2)
  })
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))