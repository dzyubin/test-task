const https = require('https')
const fs = require('fs')
const util = require('util')
const url = require('url')

const { table } = require('table')
const getHrefs = require('get-hrefs')

module.exports.getPageContent = (siteUrl) => {
  return new Promise((resolve, reject) => {
    const { protocol, host, path } = siteUrl
    const options = { protocol, host, path }

    if (protocol === 'https:') options.port = 443

    let request = https.request(options, function (res) {
      let pageContent = ''

      res.on('data', function (chunk) {
        pageContent += chunk
      });

      res.on('end', function () {
        resolve(pageContent)
      });
    });

    request.on('error', function (e) {
      console.log(e.message)
      reject(e.message)
    });

    request.end()
  })
}

module.exports.writeNumberOfHits = (siteContent, siteUrl, searchPhrase) => {
  let re = new RegExp(searchPhrase, "gi");
  let result, indices = [];
  while ( (result = re.exec(siteContent)) ) {
    indices.push(result.index)
  }

  /*const data = [
    [siteUrl.host + siteUrl.path, searchPhrase, `${indices.length} hits!`]
  ]

  const config = {
    columns: {
      0: {
        width: 50,
        truncate: 50
      }
    }
  }

  const output = table(data, config)
  console.log(output)*/

  logTabulatedResult(siteUrl, searchPhrase, indices.length)

  fs.appendFile(
    'result.txt',
    `${siteUrl.host}${siteUrl.path}\n\tHits: ${indices.length} | Search Phrase: ${searchPhrase}\n\n`,
    // output,
    function (err) {
      if (err) throw err
    }
  )
}

module.exports.getUrl = (pageContent, siteUrl, searchPhrase) => {
  const allHrefs = getHrefs(pageContent, { forceHttps: true })
  const re = new RegExp(searchPhrase)

  let hrefs = allHrefs.filter(href => {
    return (re.exec(href) && href.indexOf('.jpg') < 0)
  })

  hrefs = hrefs.filter(href => {
    const hrefUrlObj = url.parse(href)

    return siteUrl.host !== hrefUrlObj.host
  })

  return url.parse(hrefs[0])
}

function logTabulatedResult(siteUrl, searchPhrase, indicesCount) {
  const data = [
    [siteUrl.host + siteUrl.path, searchPhrase, `${indicesCount} hits!`]
  ]

  const config = {
    columns: {
      0: {
        width: 50,
        truncate: 50
      }
    }
  }

  console.log(table(data, config))
}