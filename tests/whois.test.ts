import {
    checkDomain,
    daysToExpire,
    getUserDomainsList,
    getUsersIdList,
    runChecker,
    whoisRunner
} from "../src/services/whois";
import moment from "moment";

describe("Whois parser test", () => {
    test("must return expiry date of passed domain", async (done) => {
        const domainToCheck = 'google.com';
        const expDate = await checkDomain(domainToCheck);
        console.log(expDate);
        expect(expDate).toBeTruthy();
        expect(moment(expDate)).toBeTruthy()
        done();
    });
    test("should return days to expire as string", (done) => {
        const expInDays = daysToExpire(new Date())
        console.log(expInDays);
        expect(expInDays).toBeTruthy();
        expect(!isNaN(expInDays)).toBeTruthy();
        done();
    })
    test("should return user data from db", async (done) => {
        const userId = `600ea8f14de4984228e07cbc`;
        const userData = await getUserDomainsList(userId);
        console.log(userData);
        expect(Array.isArray(userData)).toBeTruthy();
        done();
    })

    test("should return [hostname, expiryDate] with correct data", async (done) => {
        const resultsArray = await runChecker(`600ea8f14de4984228e07cbc`);
        // console.log(resultsArray);
        expect(Array.isArray(resultsArray)).toBeTruthy();
        for (const item of resultsArray) {
            expect(typeof item.hostname).toBe('string');
            expect(item.hostname.length >= 4).toBeTruthy();
            expect(typeof item.expiryDate).toBe('string');
            // console.log(moment(item.expiryDate).date());
            expect(typeof moment(item.expiryDate).date()).toBe('number');
        }
        done()
    })
    test("should return users ids list", async (done) => {
        const usersIdList = await getUsersIdList();
        console.log(usersIdList);
        expect(Array.isArray(usersIdList)).toBeTruthy();
        expect(usersIdList.length > 0).toBeTruthy();
        done();
    })

    test("whois runner", async(done)=>{
        const usersIdList = await getUsersIdList();
        const results = await whoisRunner(usersIdList);
        console.log(JSON.stringify(results, null, 4));
        expect(Array.isArray(results)).toBeTruthy();
        done();
    })
})
