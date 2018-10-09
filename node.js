const url = require('url')
const fs = require('fs')

const searchUtils = require('./functions')

let siteUrl = ""
let searchDepth = 3
let searchPhrase = ""
let initialSearchDepth = 0
let visitedURLs = []

process.argv.forEach(function (val, index, array) {
  siteUrl = url.parse(array[2])
  searchPhrase = array[3]
  searchDepth = parseInt(array[4], 10)
  initialSearchDepth = parseInt(array[4], 10)
});

try {
  fs.appendFile('result.txt', `===== Search results for <<${searchPhrase}>> =====\n`, () => {})
  search(siteUrl, searchDepth)
} catch (e) {
  console.log(e)
  throw e
}

/**
 * Searches number of times searchPhrase is encountered on the page and pages initial page has links to. Writes data
 * about the search results into result.txt
 * @param siteUrl string URL to search phrase on
 * @param searchDepth number Number of links to go through to search searchPhrase
 */
function search(siteUrl, searchDepth) {
  if (searchDepth < 1) {
    console.log('Search results saved to result.txt')
    fs.appendFile('result.txt', `===== End of search =====\n\n\n`, () => {})
    return
  }

  searchUtils.getPageContent(siteUrl)
    .then(pageContentRes => {
      searchUtils.writeNumberOfHits(pageContentRes, siteUrl, searchPhrase)

      const nextUrlData = searchUtils.getUrl(pageContentRes, siteUrl, searchPhrase, visitedURLs)

      if (nextUrlData) {
        visitedURLs.push(nextUrlData.href)
      }

      if (!nextUrlData || !nextUrlData.urlObject) {
        console.log(`Stopped at level of depth ${initialSearchDepth - searchDepth + 1}. No more links with '${searchPhrase}'\n`)
        console.log('Search results saved to result.txt')
        fs.appendFile('result.txt', `===== End of search =====\n\n\n`, () => {})
        return
      }

      if (!nextUrlData.urlObject.host) nextUrlData.urlObject.host = siteUrl.host

      searchDepth--

      search(nextUrlData.urlObject, searchDepth)
    })
    .catch(err => {
      console.log(err)
    })
}
