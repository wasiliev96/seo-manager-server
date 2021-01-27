import {monitoring, monitoringRunner} from "../src/services/uptime";
import puppeteer from 'puppeteer';
describe("uptime tests", () => {
    test("call", async (done) => {
        done();
    })
    test("run monitoring", async (done) => {
        jest.setTimeout(30000);
        // process.env.PUPPETEER_EXECUTABLE_PATH = `${process.cwd()}/node_modules/puppeteer/.local-chromium/linux-818858/chrome-linux/chrome`;
        // console.log(process.platform)
        // console.log(puppeteer.executablePath());
        // console.log(process.cwd());
        const trueResult = await monitoring('google.ru', 'body');
        const falseResult = await monitoring('wdawd', 'body');
        expect(trueResult).toBeTruthy();
        expect(falseResult).toBeFalsy();
        done();
    })
})
