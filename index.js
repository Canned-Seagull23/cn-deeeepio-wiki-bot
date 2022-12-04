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
    for (let i in Object.keys(animals)) {
        const animalId = animals[i];
        const animalName = translations[animalId.name + "-name"];
        console.log(animalName);
        yield getArticlePromise(animalName)
            .then(data => {
            console.log(data);
        })
            .catch(err => {
            console.error(err);
            console.log("Error fetching page " + animalName);
        });
    }
    let d = yield getArticlePromise("机械人测试");
    console.log(d);
    /*
        await appendArticlePromise("机械人测试", "== TEST ==", "Test")
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            });*/
}))();
