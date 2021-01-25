import User from "../src/database/models/User";
import mongoose = require('mongoose');
import {addDomainToUser, addUser, removeDomainById} from "../src/database/api";

// beforeAll((done) => {
// });

describe("Mongoose CRUD", () => {
    // it('should be invalid if name is empty', (done) => {
    //     expect(1).toBe(2)
    //     done()
    // });
    test('Fails to create invalid User model', async (done) => {
        let error = null;
        const invalidUser = new User({
            date: new Date(),
            statusCode: 200,
            responseTime: 1.32,
        })
        // await state.save();
        try {
            const user = new User(invalidUser);
            await user.validate();
        } catch (e) {
            error = e;
        }

        expect(error).not.toBeNull();
        done();
    });

    test('Success  to create valid User model', async (done) => {
        let error = null;
        const validUser = new User({
            userId: Math.random().toString(),
            domains: [
                {
                    hostname: 'google.com',
                    uptimes: [
                        {
                            date: new Date(),
                            statusCode: 200,
                            responseTime: 300
                        }
                    ]
                }
            ]
        })
        // await state.save();
        try {
            const user = new User(validUser);
            await user.validate();
        } catch (e) {
            error = e;
        }

        expect(error).toBeNull();
        done();
    });


});

describe("MongoDB CRUD", () => {
    test("Should validate, upload to DB and find in DB User model", async (done) => {

        // mongoose.connect(
        //     'mongodb://localhost:27017/test',
        //     {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
        // const db = mongoose.connection;
        // db.on('error', console.error.bind(console, 'connection error:'));
        // db.once('open', () => {
        //     console.log(`Connection established`);
        //     done();
        // });
        let error = null;
        let dbUser: any;
        let validUser = null;
        let savedUser = null;
        try {
            validUser = {
                username: Math.random().toString(36).substring(7),
            };
            savedUser = await addUser(validUser)
            dbUser = await User.findById(savedUser?._id);

        } catch (e) {
            console.log(e);
            error = e;
        }
        expect(error).toBeNull();
        expect(JSON.stringify(dbUser)).toMatch(JSON.stringify(savedUser))
        done()
    })
    test("Should add domain to exist User model record", async (done) => {
        const hostname = 'yandex.com';
        const userId = `600e936fd9739420f4ff627b`;
        let resUser: any = null;
        try {
            await addDomainToUser(userId, hostname);
            await User.findById(userId, (err: Error, user: any) => {
                if (err) {
                    console.log(err);
                    resUser = err;
                }
                resUser = user;
                expect(resUser.domains.find((domain:any)=>domain.hostname===hostname)).toBeTruthy();
            });
        } catch (e) {
            console.log(e)
        }
        done();
    })

    test("Shoud delete domain from User.domains", async () => {
        const userId = `600e936fd9739420f4ff627b`;
        const domainId = `600ea7252d01f93410c54be4`
        await removeDomainById(userId, domainId);
        const resUser = await User.findById(userId);
        // console.log(resUser.domains);
        expect(resUser.domains.find((domain: any) => domain._id === domainId)).toBe(undefined);
    })
})

// afterAll((done) => {
//     // mongoose.connection.db.dropDatabase().then(() => {
//     //     mongoose.connection.close()
//     //     done()
//     // })
//
//     // mongoose.connection.close()
//     // done()
// })
