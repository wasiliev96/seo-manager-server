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
        const results =  await monitoringRunner();
        expect(results).toMatchObject([false,true])
        done();
    })
})
