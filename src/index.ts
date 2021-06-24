import got from 'got';
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import {createCanvas} from 'canvas'

interface colorChart {
  hex: string
  name: string
}

interface config {
  file: {
    width: number
    height: number
    mime: any
    ext: string
    path: string
  },
  uri: string
}

const config:config = {
  file: {
    width: 40,
    height: 40,
    mime: 'image/png',
    ext: '.png',
    path: './export/'
  },
  uri: 'https://www.w3schools.com/colors/colors_names.asp'
}

async function getColors() {

  try {
    const page = await got(config.uri);
    const $ = cheerio.load(page.body);

    const colors = Array.from($('div.colorbox'), a => {

      const aw = $(a);
      const hexvalue = aw.find('span.colorhexspan a').text()
      const colorname = aw.find('span.colornamespan ').text()

      return ({
        hex: hexvalue,
        name: colorname,
      })

    })

    return colors
  }
  catch (error) {
    return error
  }

}

async function processImages(data:colorChart[]) {

  try{
    for(let color of data) {
      const canvas = createCanvas(config.file.width, config.file.height)
      const ctx = canvas.getContext('2d')
  
      ctx.fillStyle = color.hex
      ctx.fillRect(0, 0, config.file.width, config.file.height)
  
      const buffer = canvas.toBuffer(config.file.mime)
      fs.writeFileSync(config.file.path + color.name + config.file.ext, buffer)
    }
  }
  catch (error) {
    return error
  }

}

getColors().then(colors => {
  processImages(colors).then(() => {
    console.log(`saved ${colors.length} colors.`)
  }).catch(e => {console.log(e)})
}).catch(e => {console.log(e)})
