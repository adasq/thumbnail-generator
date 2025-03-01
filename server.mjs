import {createThumbnail} from './thumbnail.mjs'
import Hapi from '@hapi/hapi';
import fs from 'node:fs';
import nodeHtmlToImage from 'nhti';
import {shoot} from "./shoot.mjs";
// console.log = () => {}
;(async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            return 'hi';
        }
    });

    server.route({
        method: 'POST',
        path: '/thumbnail',
        config: {
            payload: {
                maxBytes: 209715200,
            }
        },
        handler: async (request, h) => {
            console.log('request.query')
            console.log(request.query)
            console.log('request.payload')
            console.log(request.payload)

            const {templateUrl, ...params} = request.payload;
            console.log('params', params)
            console.log('templateUrl', templateUrl)

            if (!templateUrl) return 'no templateUrl specified';

            try {
                const image = await createThumbnail({
                    templateUrl,
                    params
                })
                const response = h.response(image);
                response.type('image/jpg');
                return response;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/html',
        config: {
            payload: {
                // maxBytes: 209715200,
            }
        },
        handler: async (request, h) => {
            console.log('request.query')
            console.log(request.query)
            console.log('request.payload')
            console.log(request.payload)

            let {html} = request.payload;
            // html = fs.readFileSync('./page.html').toString();
            console.log('params', html)

            try {
                const image = await nodeHtmlToImage({
                    quality: 100,
                    type: 'png',
                    transparent: true,
                    waitUntil: 'load',
                    timeout: 1000 * 60 * 5,
                    puppeteerArgs: {
                        headless: true,
                        timeout: 1000 * 60 * 5,
                        args: [
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                        ]
                    },
                    content: {},
                    html: html
                })
                const response = h.response(image);
                response.type('image/jpg');
                return response;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/thumbnail',
        handler: async (request, h) => {
            console.log('request.query')
            console.log(request.query)
            console.log('request.payload')
            console.log(request.payload)

            const {templateUrl, ...params} = request.query;
            console.log('params', params)

            if (!templateUrl) return 'no templateUrl specified';

            try {
                const image = await createThumbnail({
                    templateUrl,
                    params
                })
                const response = h.response(image);
                response.type('image/png');
                return response;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/shoot',
        handler: async (request, h) => {
            console.log('request.query')
            console.log(request.query)
            console.log('request.payload')
            console.log(request.payload)

            let {url} = request.query;

            if (url) {
                url = decodeURIComponent(url);
            } else {
                url = 'https://allegro.pl/oferta/zelatyna-spozywcza-240-bloom-1kg-na-stawy-jakosc-10749361730?utm_source=notification&utm_medium=cartWithPayment&utm_campaign=cef7b135-c856-4150-84eb-687c2d87cdd6&snapshot=MjAyMy0wNS0xOFQyMDowMTozNy41NDYzNjlaO2J1eWVyO2I5NWY2N2RlMTI3ZDVkYjU0Nzc0NmM0YjE1MzJkM2U5YzA0OTNmYTlmZmQ5NDUwMDYxYWE3Y2NmZjQwOTdmMzA%253D'
            }


            console.log(url);

            try {
                const image = await shoot({
                    url
                })
                const response = h.response(image)

                response.type('image/png')
                response.header('Content-Disposition', 'inline; filename="screenshot.png"');
                return response;
            } catch (err) {
                console.log(err);
                return err;
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
})()
