import got from 'got';
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import {createCanvas} from 'canvas'

const width = 40
const height = 40

async function getColors() {

  const w3schoolsUrl = 'https://www.w3schools.com/colors/colors_names.asp'

  try {
    const page = await got(w3schoolsUrl);
    const $ = cheerio.load(page.body);

    const colors = Array.from($('div.colorbox'), (a, i) => {

      const aw = $(a);
      const hexvalue = aw.find('span.colorhexspan a').text()
      const colorname = aw.find('span.colornamespan ').text()

      return ({
        id: i,
        hex: hexvalue,
        colorname: colorname,
      })

    })

    return colors
  }
  catch (error) {
    console.log(error)
  }

}

async function processImages(data) {

  try{
    for(let c of data) {
      const canvas = createCanvas(width, height)
      const context = canvas.getContext('2d')
  
      context.fillStyle = c.hex
      context.fillRect(0, 0, width, height)
  
      const buffer = canvas.toBuffer('image/png')
      fs.writeFileSync('./export/'+c.colorname+'.png', buffer)
    }
  }
  catch (error) {
    console.log(error)
  }

}

getColors().then(data => {
  processImages(data).then(() => {
    console.log(`saved ${data.length} colors.`)
  })
})
