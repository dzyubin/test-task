const https = require('https')
const fs = require('fs')
const url = require('url')
const { table } = require('table')
const getHrefs = require('get-hrefs')

/**
 * Gets page content as a string for specified siteUrl
 * @param siteUrl string
 * @returns {Promise}
 */
module.exports.getPageContent = (siteUrl) => {
  return new Promise((resolve, reject) => {
    const { protocol, host, path, query } = siteUrl
    const options = { protocol, host, path, query }

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

/**
 * Writes search results into result.txt and logs data in tabulated form to stdout
 * @param pageContent string with HTML of the page
 * @param siteUrl
 * @param searchPhrase
 */
module.exports.writeNumberOfHits = (pageContent, siteUrl, searchPhrase) => {
  let re = new RegExp(searchPhrase, "gi");
  let result, indices = [];
  while ( (result = re.exec(pageContent)) ) {
    indices.push(result.index)
  }

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

/**
 * Parses page content and returns URL of the next page to search searchPhrase at
 * @param pageContent string with HTML of the page
 * @param siteUrl
 * @param searchPhrase
 * @param visitedURLs array
 * @returns object | null URL
 */
module.exports.getUrl = (pageContent, siteUrl, searchPhrase, visitedURLs) => {
  const allHrefs = getHrefs(pageContent, { forceHttps: true })
  const re = new RegExp(searchPhrase)

  let hrefs = allHrefs.filter(href => {
    return (
      re.exec(href)
      && href.indexOf('.jpg') < 0
      && href.indexOf('#') !== 0
      && visitedURLs.indexOf(href) === -1
    )
  })

  hrefs = hrefs.filter(href => {
    const hrefUrlObj = url.parse(href)

    return siteUrl.host !== hrefUrlObj.host
  })

  for (let i = 0; i < hrefs.length; i++) {
    if (hrefs[i]) return { urlObject: url.parse(hrefs[i]), href: hrefs[i] }
  }

  return null
}

/**
 * Logs URL, searchPhrase and number of hits (found searchPhrase on the page) to stdout
 * @param siteUrl
 * @param searchPhrase
 * @param indicesCount Number of hits
 */
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