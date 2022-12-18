import fetch from 'node-fetch';
import nodeHtmlToImage from 'node-html-to-image';

export const createThumbnail = async ({ templateUrl, params }, output) => {
    const html = await fetch(templateUrl).then(a => a.text())

    let template = html
        .replace(/https:\/\/codesandbox.io/g, 'https://codesandbox2.io')
        .replace('PARAMS = {}', `PARAMS = ${JSON.stringify(params || {})}`)

    Object.entries(params).map(([key, value]) => {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value); 
    });
    

    return await nodeHtmlToImage({
        output: output || './dist/thumbnail.png',
        quality: 100,
        type: 'png',
        transparent: true,
        puppeteerArgs: {
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
            ]
        },
        content: {},
        html: template
    })
}
