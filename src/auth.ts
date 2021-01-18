import express from "express";
import admin from 'firebase-admin';

import serviceAccount from './config/fbServiceAccountKey.json'
import {ServiceAccount} from "firebase-admin/lib/credential";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: "https://fbauthdemo-2a451.firebaseio.com"
});

const authorized = false

function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(req.headers)
    if (req.headers.authtoken) {
        // @ts-ignore
        admin.auth().verifyIdToken(req.headers.authtoken)
            .then(() => {
                next()
            }).catch(() => {
            res.status(403).send('Unauthorized')
        });
    } else {
        res.status(403).send('Unauthorized')
    }
}

export {
    checkAuth
}
