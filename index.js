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
const bot = require('nodemw');
const https = require('https');
// Create client
const client = new bot("config.json");
// Constants
const CONSTANTS = {
    API_URL: "apibeta.deeeep.io",
    CROWDL_API_URL: "api.crowdl.io"
};
const CDWB_TAGS = {
    skintable: {
        all: {
            start: "skintable/all/start",
            end: "skintable/all/end"
        },
        normal: {
            start: "skintable/normal/start",
            end: "skintable/normal/end"
        },
        seasonal: {
            start: "skintable/seasonal/start",
            end: "skintable/seasonal/end"
        },
        unrealistic: {
            start: "skintable/unrealistic/start",
            end: "skintable/unrealistic/end"
        }
    }
};
// Data
let translations = {};
let animals = {};
// Promises
function fetch(host, path) {
    return new Promise((resolve, reject) => {
        https.request({
            host,
            path
        }, (res) => {
            var str = '';
            res.on('data', (c) => {
                str += c;
            });
            res.on('end', () => { resolve(str); });
        }).end();
    });
}
function logInPromise() {
    return new Promise((resolve, reject) => {
        client.logIn((err) => {
            if (err)
                return reject(err);
            resolve("");
        });
    });
}
function getArticlePromise(article) {
    return new Promise((resolve, reject) => {
        client.getArticle(article, (err, data) => {
            if (err)
                return reject(err);
            resolve(data);
        });
    });
}
function editArticlePromise(title, content, summary, minor) {
    return new Promise((resolve, reject) => {
        client.edit(title, content, summary, minor, (err, res) => {
            if (err)
                return reject(err);
            resolve(res);
        });
    });
}
function appendArticlePromise(title, content, summary) {
    return new Promise((resolve, reject) => {
        client.append(title, content, summary, (err, res) => {
            if (err)
                return reject(err);
            resolve(res);
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(CONSTANTS.API_URL, "/animals")
        .then((data) => {
        animals = JSON.parse(data);
    });
    yield fetch(CONSTANTS.CROWDL_API_URL, "/deeeep/cdn/zh.json")
        .then((data) => {
        translations = JSON.parse(data);
    });
    ;
    yield logInPromise()
        .then(() => {
        console.log("Client logged in");
    })
        .catch((err) => {
        console.error(err);
        console.log("Logging in failed");
    });
    // Get all animal articles
    /*
        for (let i in Object.keys(animals)) {
            const animalId = animals[i];
            const animalName = translations[animalId.name + "-name"];
            if (animalName === undefined) continue;
            console.log(animalName)
            const data = await getArticlePromise(animalName)
                .catch(err => {
                    console.error(err);
                    console.log("Error fetching page " + animalName);
                });
            if (data === undefined) continue;
            console.log(data);
            const lines = data.split('\n')
                let tags = [];
    for (let i in lines) {
        if (lines[i].startsWith("<!--@cdwb/")) {
            tags.push({
                line: i,
                tag: lines[i].slice(10, -3)
            });
        };
    }
        }*/
    const animalId = 0;
    let skins = [];
    let realisticSkins = [];
    let seasonalSkins = [];
    let unrealisticSkins = [];
    yield fetch(CONSTANTS.API_URL, "/skins?cat=all&animalId=" + animalId)
        .then((data) => {
        skins = JSON.parse(data);
    });
    realisticSkins = skins.filter(skin => skin.category == "real");
    seasonalSkins = skins.filter(skin => skin.category == "season");
    unrealisticSkins = skins.filter(skin => skin.category == "unrealistic");
    console.log(realisticSkins);
    console.log(seasonalSkins);
    console.log(unrealisticSkins);
    let d = yield getArticlePromise("机械人测试");
    console.log(d);
    const lines = d.split('\n');
    let tags = [];
    for (let i in lines) {
        if (lines[i].startsWith("<!--@cdwb/")) {
            tags.push({
                line: Number(i),
                tag: lines[i].slice(10, -3)
            });
        }
        ;
    }
    console.log(tags);
    if (tags.filter(tag => tag.tag == CDWB_TAGS.skintable.all.start).length != 0) {
        console.log('x');
        const startln = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.all.start)[0].line;
        const endln = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.all.end)[0].line;
        const table = lines.slice(startln + 1, endln - 1);
        const normalStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.normal.start)[0].line;
        const normalEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.normal.end)[0].line;
        const normalSection = lines.slice(normalStartLn + 1, normalEndLn - 1);
        const seasonalStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.seasonal.start)[0].line;
        const seasonalEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.seasonal.end)[0].line;
        const seasonalSection = lines.slice(seasonalStartLn + 1, seasonalEndLn - 1);
        const unrealisticStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.unrealistic.start)[0].line;
        const unrealisticEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.unrealistic.end)[0].line;
        const unrealisticSection = lines.slice(unrealisticStartLn + 1, unrealisticEndLn - 1);
        console.log(table);
        console.log(normalStartLn);
        console.log(normalEndLn);
        console.log(normalSection);
    }
    /*
        await appendArticlePromise("机械人测试", "== TEST ==", "Test")
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            });*/
}))();
