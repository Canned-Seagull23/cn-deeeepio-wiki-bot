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
const { GoogleTranslator } = require('@translate-tools/core/translators/GoogleTranslator');
// Create client
const client = new bot("config.json");
// Constants
const CONSTANTS = {
    API_URL: "apibeta.deeeep.io",
    CROWDL_API_URL: "api.crowdl.io",
    TRANSLATE_SRC_LANG: "en",
    TRANSLATE_TARGET_LANG: "zh"
};
const CDWB_TAGS = {
    skintable: {
        all: {
            start: "skintable/all/start",
            end: "skintable/all/end"
        },
        realistic: {
            start: "skintable/realistic/start",
            end: "skintable/realistic/end"
        },
        seasonal: {
            start: "skintable/seasonal/start",
            end: "skintable/seasonal/end"
        },
        unrealistic: {
            start: "skintable/unrealistic/start",
            end: "skintable/unrealistic/end"
        },
        table: {
            end: "skintable/table/end"
        }
    },
    edit: {
        skins: {
            add: "edit/skins/add",
            uploadimg: "edit/skins/uploadimg"
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
function uploadByUrlPromise(name, url, summary) {
    return new Promise((resolve, reject) => {
        client.uploadByUrl(name, url, summary, (err) => {
            if (err)
                reject(err);
            resolve("");
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    let edit = false;
    let editSummary = "";
    const animalId = 0;
    let skins = [];
    let undocumentedSkins = [];
    let realisticSkins = [];
    let seasonalSkins = [];
    let unrealisticSkins = [];
    yield fetch(CONSTANTS.API_URL, "/skins?cat=all&animalId=" + animalId)
        .then((data) => {
        skins = JSON.parse(data);
    }).catch(e => {
        console.error(e);
        console.log("Error loading skins");
    });
    realisticSkins = skins.filter(skin => skin.category == "real");
    seasonalSkins = skins.filter(skin => skin.category == "season");
    unrealisticSkins = skins.filter(skin => skin.category == "unrealistic");
    let d = yield getArticlePromise("机械人测试");
    //console.log(d);
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
        let documentedSkins = [];
        const realisticStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.realistic.start)[0].line;
        const realisticEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.realistic.end)[0].line;
        const realisticSection = lines.slice(realisticStartLn + 1, realisticEndLn - 1);
        let realisticSkinEntries = [];
        let realisticRow = [];
        for (let i in realisticSection) {
            if (realisticSection[i] == "|-" || Number(i) == realisticSection.length) {
                realisticSkinEntries.push(realisticRow);
                realisticRow = [];
                continue;
            }
            else {
                realisticRow.push(realisticSection[i]);
            }
            ;
        }
        for (let i in realisticSkinEntries) {
            if (isNaN(realisticSkinEntries[i][2].slice(1)))
                continue;
            documentedSkins.push(Number(realisticSkinEntries[i][2].slice(1)));
        }
        const seasonalStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.seasonal.start)[0].line;
        const seasonalEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.seasonal.end)[0].line;
        const seasonalSection = lines.slice(seasonalStartLn + 1, seasonalEndLn);
        let seasonalSkinEntries = [];
        let seasonalRow = [];
        for (let i in seasonalSection) {
            if (seasonalSection[i] == "|-" || Number(i) == seasonalSection.length - 1) {
                seasonalSkinEntries.push(seasonalRow);
                seasonalRow = [];
                continue;
            }
            else {
                seasonalRow.push(seasonalSection[i]);
            }
            ;
        }
        for (let i in seasonalSkinEntries) {
            if (isNaN(seasonalSkinEntries[i][2].slice(1)))
                continue;
            documentedSkins.push(Number(seasonalSkinEntries[i][2].slice(1)));
        }
        const unrealisticStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.unrealistic.start)[0].line;
        const unrealisticEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.unrealistic.end)[0].line;
        const unrealisticSection = lines.slice(unrealisticStartLn + 1, unrealisticEndLn);
        let unrealisticSkinEntries = [];
        let unrealisticRow = [];
        for (let i in unrealisticSection) {
            if (unrealisticSection[i] == "|-" || Number(i) == unrealisticSection.length - 1) {
                unrealisticSkinEntries.push(unrealisticRow);
                unrealisticRow = [];
                continue;
            }
            else {
                unrealisticRow.push(unrealisticSection[i]);
            }
            ;
        }
        for (let i in unrealisticSkinEntries) {
            if (isNaN(unrealisticSkinEntries[i][2].slice(1)))
                continue;
            documentedSkins.push(Number(unrealisticSkinEntries[i][2].slice(1)));
        }
        for (let i in skins) {
            if (!documentedSkins.includes(skins[i].id)) {
                undocumentedSkins.push(skins[i]);
            }
            ;
        }
        if (!undocumentedSkins.length)
            edit = true;
        for (let i in undocumentedSkins) {
            const skin = undocumentedSkins[i];
            let skinData = {};
            yield fetch(CONSTANTS.API_URL, "/skins/" + skin.id)
                .then((data) => {
                skinData = JSON.parse(data);
            });
            let section = [];
            if (undocumentedSkins[i].category == "real") {
                section = realisticSection;
            }
            else if (undocumentedSkins[i].category == "season") {
                section = seasonalSection;
            }
            else {
                section = unrealisticSection;
            }
            ;
            const translator = new GoogleTranslator({
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
                },
            });
            const skinName = yield translator
                .translate(skin.name, CONSTANTS.TRANSLATE_SRC_LANG, CONSTANTS.TRANSLATE_TARGET_LANG);
            const skinDesc = yield translator
                .translate(skinData.description, CONSTANTS.TRANSLATE_SRC_LANG, CONSTANTS.TRANSLATE_TARGET_LANG);
            console.log(skinDesc);
            section.push(...[
                `|-`,
                `|[https://beta.deeeep.io/store/skins/${skin.id} （自动翻译） ${skinName}]`,
                `[https://beta.deeeep.io/store/skins/${skin.id} ${skin.name}]`,
                `|${skin.id}`,
                `|${skin.user_username}`,
                `|${skin.created_at.split('-')[0]}年${skin.created_at.split('-')[1]}月${skin.created_at.split('-')[2].split("T")[0]}日`,
                `|${skin.price} [[File:Coin.png|15px|link=]]`,
                `|${(_a = skin.attributes) !== null && _a !== void 0 ? _a : "无"}`,
                `|（自动翻译） ${skinDesc}`,
                `|[[File:${skin.id}.png|100px|center]]`
            ]);
            yield uploadByUrlPromise(skin.id + ".png", "https://cdn.deeeep.io/custom/skins/" + skin.asset, "<@cdwb/edit/skins/uploadimg|" + skin.id);
        }
        let offset = 0;
        lines.splice(realisticStartLn + 1, realisticEndLn - realisticStartLn - 1, ...realisticSection);
        offset += realisticSection.length - (realisticEndLn - realisticStartLn - 1);
        lines.splice(seasonalStartLn + 1 + offset, seasonalEndLn - seasonalStartLn - 1, ...seasonalSection);
        offset += seasonalSection.length - (seasonalEndLn - seasonalStartLn - 1);
        lines.splice(unrealisticStartLn + 1 + offset, unrealisticEndLn - unrealisticStartLn - 1, ...unrealisticSection);
        let undocumentedCodes = [];
        for (let i in undocumentedSkins) {
            undocumentedCodes.push(undocumentedSkins[i].id);
        }
        editSummary += `<@cdwb/${CDWB_TAGS.edit.skins.add}|${undocumentedCodes}>.`;
    }
    console.log(lines.join('\n'));
    yield editArticlePromise("机械人测试", lines.join('\n'), editSummary, false);
    /*
        await appendArticlePromise("机械人测试", "== TEST ==", "Test")
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            });*/
}))();
