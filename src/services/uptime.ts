/*
MIT License

Copyright (c) 2020 David Barton
*/

import puppeteer from 'puppeteer';
import moment from "moment";
// const request = require('request')
let browserWSEndpoint: any;
export const monitoring = async (url: string, selector: string) => {
    const maxRetry = 5;
    let failed = false;
    let cause = 'unknown error';
    let responseCode = null;
    let tryNumber = 1;

    let page: any;
    let response: any;
    let browseSuccess = false;
    try {
        let browser: any;
        if (browserWSEndpoint) {
            browser = await puppeteer.connect({browserWSEndpoint});
        } else {
            browser = await puppeteer.launch({headless: true})
            browserWSEndpoint = await browser.wsEndpoint()
        }
        while (tryNumber <= maxRetry) {
            if (browseSuccess) break;
            console.log('\x1b[36m%s\x1b[0m', `try # ${tryNumber}`)
            page = await browser.newPage();
            response = await page.goto(`https://${url}`);
            const scrName = `./screenshots/${url}_${moment().format(`DD-MM-YYYY-HH-mm`)}.png`;
            console.info('\x1b[36m%s\x1b[0m', `screenshot name: ${scrName}`);
            await page.screenshot({path: scrName});
            const chain = response?.request().redirectChain();
            if (chain?.length) {
                for (const r of chain) {
                    console.info('\x1b[36m%s\x1b[0m', r.method() + ' ' + r.response()?.status() + ' ' + r.url());
                }
                console.info('\x1b[36m%s\x1b[0m', `response url: ${response.url()}`)
                responseCode = chain[0].response()?.status();
            } else {
                responseCode = response?.status()
            }
            if (responseCode === 200) await page.waitForSelector(selector);
            browseSuccess = true;
            if (responseCode && responseCode > 302) {
                console.error(
                    `HEALTH CHECK FAILED on ${url} with HTTP ${responseCode} (${cause})`
                );
            } else {
                console.info(`HEALTH CHECK PASSED on ${url} with HTTP ${responseCode}`);
            }
            tryNumber++;
        }

        await browser.close();
    } catch (e: any) {
        failed = true;
        // console.log(e);
        cause = e.message;
        console.error(`HEALTH CHECK FAILED on ${url} with HTTP ${e.code} (${cause})`);
    }
    return !failed;
}
const siteConfig = [
    {
        "site": "google.com",
        "selector": "body"
    }
]

export async function monitoringRunner() {
    const browser = await puppeteer.launch({headless: true})
    browserWSEndpoint = await browser.wsEndpoint()

    for (const siteData of siteConfig) {
        const site = siteData.site
        const selector = siteData.selector
        try {
            await monitoring(site, selector)
        } catch (e) {
            console.error(e);
        }
    }
    await browser.close()
}
