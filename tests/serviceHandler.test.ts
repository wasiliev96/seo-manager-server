import {getAllUsersDomainsArray, updateUsersData} from "../src/services";

describe("Test services/index.ts", ()=>{
    test("should return all users data array", async(done)=>{
        const usersData = await updateUsersData();
        console.log(usersData)
        expect(Array.isArray(usersData)).toBeTruthy();
        done();
    });

    test("should return all users domains array", async(done)=>{
        const domains = await getAllUsersDomainsArray();
        console.log(domains);
        expect(Array.isArray(domains)).toBeTruthy();
        done();
    })
})
