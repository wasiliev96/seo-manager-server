import {default as request} from 'supertest';
import {app} from '../src';

describe("Test the root path", () => {
    it("Should return 200 and hello message", async (done) => {
        // const result = await request(app).get("/");
        // // const regex = new RegExp("hello world", "i");
        // // expect(result.text).toEqual(regex);
        // // @ts-ignore
        // expect(result.statusCode).toEqual(200);
         request(app)
            .get("/")
            .expect(200)
            .end((err,res)=>{
                if (err) return done(err)
                expect(res.body).toMatchObject({'message': 'Hello'})
                done()
            })
    });
});
