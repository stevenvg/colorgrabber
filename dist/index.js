"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = require("got");
const cheerio = require("cheerio");
const fs = require("fs");
const canvas_1 = require("canvas");
const config = {
    file: {
        width: 40,
        height: 40,
        mime: 'image/png',
        ext: '.png',
        path: './export/'
    },
    uri: 'https://www.w3schools.com/colors/colors_names.asp'
};
function getColors() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = yield got_1.default(config.uri);
            const $ = cheerio.load(page.body);
            const colors = Array.from($('div.colorbox'), a => {
                const aw = $(a);
                const hexvalue = aw.find('span.colorhexspan a').text();
                const colorname = aw.find('span.colornamespan ').text();
                return ({
                    hex: hexvalue,
                    name: colorname,
                });
            });
            return colors;
        }
        catch (error) {
            return error;
        }
    });
}
function processImages(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (let color of data) {
                const canvas = canvas_1.createCanvas(config.file.width, config.file.height);
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = color.hex;
                ctx.fillRect(0, 0, config.file.width, config.file.height);
                const buffer = canvas.toBuffer(config.file.mime);
                fs.writeFileSync(config.file.path + color.name + config.file.ext, buffer);
            }
        }
        catch (error) {
            return error;
        }
    });
}
getColors().then(colors => {
    processImages(colors).then(() => {
        console.log(`saved ${colors.length} colors.`);
    }).catch(e => { console.log(e); });
}).catch(e => { console.log(e); });
