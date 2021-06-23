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
const width = 40;
const height = 40;
function getColors() {
    return __awaiter(this, void 0, void 0, function* () {
        const w3schoolsUrl = 'https://www.w3schools.com/colors/colors_names.asp';
        try {
            const page = yield got_1.default(w3schoolsUrl);
            const $ = cheerio.load(page.body);
            const colors = Array.from($('div.colorbox'), (a, i) => {
                const aw = $(a);
                const hexvalue = aw.find('span.colorhexspan a').text();
                const colorname = aw.find('span.colornamespan ').text();
                return ({
                    id: i,
                    hex: hexvalue,
                    colorname: colorname,
                });
            });
            return colors;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function processImages(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (let c of data) {
                const canvas = canvas_1.createCanvas(width, height);
                const context = canvas.getContext('2d');
                context.fillStyle = c.hex;
                context.fillRect(0, 0, width, height);
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync('./export/' + c.colorname + '.png', buffer);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
getColors().then(data => {
    processImages(data).then(() => {
        console.log(`saved ${data.length} colors.`);
    });
});
