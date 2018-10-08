const express = require('express')
const url = require('url')
const fs = require('fs')
const https = require('https')
const util = require('util')

const searchUtils = require('./functions')

let siteUrl = ""
let searchDepth = 3
let searchPhrase = ""

process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);

  siteUrl = url.parse(array[2])
  searchPhrase = array[3]
  searchDepth = parseInt(array[4], 10)
});

/*searchUtils.getPageContent(siteUrl)
  .then(res => {
    if (searchDepth === 0) return

    // console.log(res)
    // console.log(siteUrl)
    pageContent = res

    searchUtils.writeNumberOfHits(pageContent, siteUrl, searchPhrase)

    let nextUrl = searchUtils.getUrl(pageContent, searchPhrase)
    // console.log(nextUrl)
    if (!nextUrl.host) nextUrl.host = siteUrl.host
    // console.log(nextUrl)

    siteUrl = searchUtils.getUrl


    // siteUrl = nextUrl
    // console.log(siteUrl)
  })*/
try {
  fs.appendFile('result.txt', `===== Search results for <<${searchPhrase}>> =====\n`, () => {})
  search(siteUrl, searchDepth)
} catch (e) {
  console.log(e)
  throw e
}

function search(siteUrl, searchDepth) {
  if (searchDepth < 1) {
    console.log('Saved to result.txt')
    fs.appendFile('result.txt', `===== End of search =====\n\n\n`, () => {})
    return
  }

  searchUtils.getPageContent(siteUrl)
    .then(pageContentRes => {

      searchUtils.writeNumberOfHits(pageContentRes, siteUrl, searchPhrase)

      let nextUrl = searchUtils.getUrl(pageContentRes, siteUrl, searchPhrase)
      if (!nextUrl.host) nextUrl.host = siteUrl.host

      searchDepth--

      search(nextUrl, searchDepth)
    })
    .catch(err => {
      console.log(err)
    })
}
