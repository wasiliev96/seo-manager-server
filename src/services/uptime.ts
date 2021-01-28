/*
MIT License

Copyright (c) 2020 David Barton
*/

import puppeteer from 'puppeteer';
import moment from "moment";
import {getAllUsersDomainsArray} from "./index";
// const request = require('request')
let browserWSEndpoint: any;
export const monitoring = async (page: any, url: string, selector: string) => {
    const maxRetry = 5;
    let failed = false;
    let cause = 'unknown error';
    let responseCode = null;
    let tryNumber = 1;

    let response: any;
    let browseSuccess = false;
    console.log(`monitoring ${url}...`)
    try {
        let browser: any;
        if (browserWSEndpoint) {
            browser = await puppeteer.connect({browserWSEndpoint});
        } else {
            browser = await puppeteer.launch({headless: true})
            browserWSEndpoint = await browser.wsEndpoint()
        }
        await page.setDefaultNavigationTimeout(0);
        while (tryNumber <= maxRetry) {
            const hostRedirectChain: any = [];
            if (browseSuccess) break;
            console.log('\x1b[36m%s\x1b[0m', `try # ${tryNumber}`)
            await page.goto('about:blank')
            response = await page.goto(`https://${url}`, {waitUntil: 'domcontentloaded'});
            const scrName = `./screenshots/${url}_${moment().format(`DD-MM-YYYY-HH-mm`)}.png`;
            console.info('\x1b[36m%s\x1b[0m', `screenshot name: ${scrName}`);
            await page.screenshot({path: scrName});
            const chain = response?.request().redirectChain();
            if (chain?.length) {
                for (const r of chain) {
                    hostRedirectChain.push({url: r.url(), statusCode: r.response()?.status()})
                    // console.info('\x1b[36m%s\x1b[0m', r.method() + ' ' + r.response()?.status() + ' ' + r.url());
                }
                hostRedirectChain.push({url: response.url(), statusCode: response.status()})
                console.info('\x1b[36m%s\x1b[0m', `chain:`, hostRedirectChain)
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
            } else if (responseCode) {
                console.info(`HEALTH CHECK PASSED on ${url} with HTTP ${responseCode}`);
            } else {
                console.error(
                    `HEALTH CHECK FAILED on ${url} with HTTP ${responseCode} (${cause})`
                );
            }
            tryNumber++;
        }

        console.log(`monitoring ${url}...success!`)
    } catch (e: any) {
        failed = true;
        // console.log(e);
        cause = e.message;
        console.error(`HEALTH CHECK FAILED on ${url} with HTTP ${e.code} (${cause})`);
    }
    return !failed;
}
// const siteConfig = [
//     {
//         "site": "google.com",
//         "selector": "body"
//     }
// ]
const getSitesConfig = async () => {
    const domainsList = await getAllUsersDomainsArray();
    // console.log(domainsList)
    return domainsList.map((domain: string) => ({hostname: domain, selector: "body"}))
}

export async function monitoringRunner(): Promise<[{ hostname: string, accessAccepted: boolean }]> {
    const results: any = [];
    const browser = await puppeteer.launch({headless: true})
    browserWSEndpoint = await browser.wsEndpoint();
    const page = await browser.newPage()
    const iPhone = puppeteer.devices['iPhone 6'];

    await page.emulate(iPhone);
    for (const siteData of await getSitesConfig()) {
        console.log(`sitedata:`, siteData)
        const site = siteData.hostname
        const selector = siteData.selector
        try {
            const result = await monitoring(page, site, selector);
            results.push({hostname: site, accessAccepted: result});
        } catch (e) {
            console.error(e);
        }
    }
    await browser.close();
    return results;
}
