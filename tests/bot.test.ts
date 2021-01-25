import {sendMessage} from "../src/bot";

describe("Test bot", () => {
    test("send test message", async (done) => {
        const message = 'test';
        const resMessage = await sendMessage(message);
        expect(resMessage.text).toBe(message);
        done();
    })
})
