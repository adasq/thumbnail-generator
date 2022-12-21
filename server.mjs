import {createThumbnail} from './thumbnail.mjs'
import Hapi from '@hapi/hapi';
import {shoot} from "./shoot.mjs";

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
            url = decodeURIComponent(url);

            console.log(url);

            try {
                const image = await shoot({
                    url
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

    await server.start();
    console.log('Server running on %s', server.info.uri);
})()
