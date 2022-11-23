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
// Create client
const client = new bot("config.json");
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield logInPromise()
        .then(() => {
        console.log("Client logged in");
    })
        .catch((err) => {
        console.error(err);
        console.log("Logging in failed");
    });
    yield getArticlePromise("机械人测试")
        .then(data => {
        console.log(data);
    })
        .catch(err => {
        console.error(err);
    });
}))();
