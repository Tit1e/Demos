const BASE_URL = 'https://wiki.biligame.com';
const superagent = require("superagent");
const cheerio = require("cheerio");

/**
 * 获取页面内容方法
 * @param {String} query 爬取的页面后缀
 */
function getContent(query) {
  return new Promise((resolve, reject) => {
    superagent.get(`${BASE_URL}/dongsen/${query}`).end((err, sres) => {
      if (err) {
        return reject(err)
      }
      resolve(cheerio.load(sres.text));
    })
  })
}

module.exports = {
  getContent
}