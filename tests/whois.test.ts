import {checkDomain, daysToExpire, getUserDomainsList, runChecker} from "../src/services/whois";
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
        const expInDays = daysToExpire(`2028-09-14T04:00:00Z`)
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

    test("should return [hostname, expiryDate] with correct data", async(done)=>{
        const resultsArray = await runChecker(`600ea8f14de4984228e07cbc`, 240);
        // console.log(resultsArray);
        expect(Array.isArray(resultsArray)).toBeTruthy();
        for(const item of resultsArray){
            expect(typeof item.hostname).toBe('string');
            expect(item.hostname.length>=4).toBeTruthy();
            expect(typeof item.expiryDate).toBe('string');
            expect(item.expiryDate.length===20).toBeTruthy();
            // console.log(moment(item.expiryDate).date());
            expect(typeof moment(item.expiryDate).date()).toBe('number');
        }
        done()
    })
})
