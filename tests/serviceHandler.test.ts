import {getAllUsersDomainsArray, updateUsersData, getUptimeErrorsMessage, ServiceHandler} from "../src/services";
import {monitoringRunner} from "../src/services/uptime";

describe("Test services/index.ts", () => {
    test("should return all users data array", async (done) => {
        const usersData = await updateUsersData();
        console.log(usersData)
        expect(Array.isArray(usersData)).toBeTruthy();
        done();
    });

    test("should return all users domains array", async (done) => {
        const domains = await getAllUsersDomainsArray();
        console.log(domains);
        expect(Array.isArray(domains)).toBeTruthy();
        done();
    })

    test('should return message from uptime results', async (done) => {
        jest.setTimeout(60_000);
        const results = await monitoringRunner();
        const validatingMessage = await getUptimeErrorsMessage(results);
        console.info('\x1b[36m%s\x1b[0m', validatingMessage);
        expect(typeof validatingMessage).toBe('string');
        expect(validatingMessage?.includes(`Can't access to list of domains`)).toBeTruthy();
        done();
    })
    test('should return null if no errors', async (done) => {
        jest.setTimeout(60_000);
        const trueResults = [{hostname: 'google.com', accessAccepted: true}]
        const validatingMessage = await getUptimeErrorsMessage(trueResults);
        expect(validatingMessage).toBeFalsy();
        done();
    })
    test('Should send error message to tg', async (done) => {
        jest.setTimeout(60_000);
        const sh = new ServiceHandler();
        const message = await sh.runUptimesOnce();
        expect(message).toBeTruthy();
        expect(message?.text.includes(`Can't access to list of domains`));
        done();
    })

    test('running whois', async (done) => {
        const sh = new ServiceHandler();
        await sh.runWhoisOnce();
        done();
    })

    test("uptimes loop", async (done) => {
        jest.setTimeout(60_000 * 5)
        const sh = new ServiceHandler();
        await sh.runUptimesLoop();
        done();
    })

    test("whois loop", async (done) => {
        jest.setTimeout(60_000 * 5)
        const sh = new ServiceHandler();
        await sh.runWhoisLoop();
        done();
    })

    test("run all once loop", async (done) => {
        jest.setTimeout(60_000 * 5)
        const sh = new ServiceHandler();
        const [uptimeResults, whoisResults] = await sh.runAllOnce();
        console.log(`runAllOnce results:\nuptime results:\n`, uptimeResults, '\nwhois results\n', whoisResults)
        for (const result of [uptimeResults, whoisResults]) {
            expect(result?.message_id).toBeTruthy();
            expect((result?.text as string).length > 0).toBeTruthy();
        }
        done();
    })
    test("run all infinite loop", async (done) => {
        jest.setTimeout(60_000 * 5)
        const sh = new ServiceHandler(20_000, 1_000*60);
        await sh.runAllLoop();
        done();
    })
})
