'use strict';

import AWS from 'aws-sdk';

AWS.config.update({
    signatureVersion: 'v4',
    region: process.env.AWS_REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
});

const s3 = new AWS.S3();

export const handler = async (event, context) => {
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));
    try {
        let s3Params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: JSON.parse(event.body).filename,
            Expires: parseInt(process.env.AWS_S3_URL_EXPIRATION)
        }

        console.log('Params: ', s3Params)
        let url = await s3.getSignedUrlPromise('getObject', s3Params)

        let response = JSON.stringify({
            url: url
        });
        console.log(response);

        return {
            statusCode: 200,
            body: response
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500
        };
    }
};
