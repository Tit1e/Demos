const fs = require("fs");
const os = require("os");
const { getContent } = require('./getContent.js')



async function getInfo(list, index, func, update_time) {
  let name = list[index];
  let otherInfo = {};
  try {
    otherInfo = await func(name).catch(() => {
      if (index < list.length - 1) {
        index += 1;
        getInfo(list, index, func, update_time);
      }
    });
  } catch (error) {
    // 出错跳过进入下一个小动物
    if (index < list.length - 1) {
      index += 1;
      getInfo(list, index, func, update_time);
      return;
    }
  }
  // os.EOL 用于换行 http://nodejs.cn/api/os/os_eol.html
  fs.appendFile("animals.txt", JSON.stringify(otherInfo) + os.EOL, (err) => {
    if (err) {
      throw err;
    } else {
      if (index < list.length - 1) {
        index += 1;
        getInfo(list, index, func, update_time);
      }
    }
  });
}

/**
 * 获取小动物信息
 * @param {String} url 小动物页面后缀
 */
async function animalInfo(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const $ = await getContent(url).catch(err => {
        reject()
      })
      const list = ['birthday', 'character', 'mantra', 'hobby', 'style', 'color', 'vioce', 'ethnicity', 'motto', 'foreign_name']
      const nodes = $(".box-poke-left .box-poke")
      const str = $(".box-poke-left .box-title-1").text()
      const name = str.substr(0, str.length -1)
      const sex = str.substr(-1) === '♂' ? '男' : '女'
      const image = $(".box-poke-right").find('img').attr('src')
      const info = {
        name,
        sex,
        image,
      }
      for (let i = 0; i < list.length; i++){
        const attr = list[i]
        const text = nodes.eq(i).find('.box-font').text()
        if (attr === 'birthday') {
          info[attr] = text.replace('月', '-').replace('日', '')
        } else {
          info[attr] = text
        }
      }
      info.birth_month = info.birthday.split('-').shift()
      resolve(info)
    } catch (error) {
      reject(url + '出错啦')
    }
  })
}

/**
 * 爬取小动物页面
 * @param {Date} update_time 爬虫执行时间，非必须
 * @param {*} url 小动物页面的后缀
 */
async function getAnimals(update_time, url) {
  const $ = await getContent(url)
  const nodes = $("#CardSelectTr tbody tr")
  const animals = []
  const LENGTH = nodes.length
  for (let i = 1; i < LENGTH; i++){
    let $element = $(nodes[i]);
    if ($element.find('td').eq(0).find('a').text() !== '40pxString') {
      // 获取小动物链接后缀
      const url = $element.find('td').eq(0).find('a').attr('href').substr(9)
      animals.push(url)
    }
  }

  // 删除 animals.txt，开始获取数据前，清除旧数据
  fs.unlink('animals.txt', function (error) {
    if (error) {
      console.log(error);
      return false;
    }
  })
  // 递归获取信息
  let index = 0
  getInfo(animals, index, animalInfo, update_time)
}

// 我们爬取的页面是 https://wiki.biligame.com/dongsen/%E5%B0%8F%E5%8A%A8%E7%89%A9%E5%9B%BE%E9%89%B4
const now = new Date()
const query = encodeURIComponent('小动物图鉴')
getAnimals(now, query)