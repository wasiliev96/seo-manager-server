import User from "../src/database/models/User";
import mongoose = require('mongoose');

beforeAll((done) => {
    mongoose.connect(
        'mongodb://localhost:27017/test',
        {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log(`Connection established`);
        done();
    });
});

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
    test("Push model", async (done) => {
        let error = null;
        let dbUser: any;
        let validUser: any;
        try {
            validUser = new User({
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
            await validUser.save();
            dbUser = await User.findOne({userId: validUser.userId});

        } catch (e) {
            console.log(e);
            error = e;
        }
        expect(error).toBeNull();
        expect(JSON.stringify(dbUser)).toMatch(JSON.stringify(validUser ))
        done()
    })
})

afterAll((done) => {
    mongoose.connection.db.dropDatabase().then(() => {
        mongoose.connection.close()
        done()
    })
})
