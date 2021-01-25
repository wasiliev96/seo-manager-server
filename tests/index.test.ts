import {app} from '../src';
import  request  = require('supertest');


describe("Test the root path", () => {
    it("Should return 200 and {\"message\": \"Hello\"} object", async (done) => {
        request(app).get("/")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toMatchObject({"message": "Hello"})
                done()
            });
    })
});
