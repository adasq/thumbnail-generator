import fetch from 'node-fetch';
import nodeHtmlToImage from 'node-html-to-image';
import fs from 'node:fs';
import {JSDOM} from 'jsdom'


export const shoot = async ({url, params}, output) => {
    let html = await fetch(url || "https://allegro.pl/oferta/biocaps-witamina-k2-mk-7-natto-d3-2000-60k-formeds-6759495734", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "pl-PL,pl;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-device-memory": "8",
            "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-full-version-list": "\"Not?A_Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"108.0.5359.124\", \"Google Chrome\";v=\"108.0.5359.124\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "upgrade-insecure-requests": "1",
            "viewport-width": "1920",
            "cookie": "_cmuid=dszny46a-hypy-59d8-6f8h-whh52aq9aekz; mdLogger=false; ws3=LFzdM40jsMgJv3oTLJIEBkhWo4S2KVJzq; gdpr_permission_given=1; _tt_enable_cookie=1; _ttp=0fd85786-d2cc-4ed1-9beb-5a0d09e5a679; __gads=ID=2ef79365abc145d3:T=1661925606:S=ALNI_MaINnYfihkSfxCgzVJqOF1N2z9kRw; _gcl_au=1.1.767871679.1667394186; QXLSESSID=a7d286b803cf234a73045a04a9cf2d7b4b5b4b27030b7b//02; __gpi=UID=00000b2526892dea:T=1669211814:RT=1669272357:S=ALNI_MaIIYHpktk4EsuICWYWQfimNFWmGw; kampyleUserSession=1669277445936; kampyleUserSessionsCount=10; kampyleSessionPageCounter=1; wdctx=v4.cc1xNerEa_f2uQWyiN18KPQ1aFdUS8oyhH44WbFtYboUmjzy5Uecpp3A5Xp-Tu9bY0GkF6RzL13Ykx6lcBWozYtJAFdYSxa9ZubdgD7dS9YDr9gQHTtMrh8zQK5m42_1w1KIXiKENO3kB_H2r6klxsOWkzXwEYxz7bwzUJ9cMIVVbZRPF5NBuQyMjskUURdeR57NDRYF79oxsWRhQ9Cbv3RHQMIw6j58iHGW2ieBdilmFuURIYSfJ1J5Oss; _gid=GA1.2.283522026.1671657607; __gfp_64b=h5Hbggb6J5MrJvrPLJiyLyhq6UPNRWuHWYr3wywP2eH.W7|1650353942; _ga_G64531DSC4=GS1.1.1671657607.19.1.1671657629.38.0.0; _ga=GA1.1.1622472428.1650353944; datadome=7bo7RZtowaUSy2UrBOgBUgNz3QRXk4sLk6ROLg1otPqygN4CablUGss4po4fxEu0OCPIpzN2cu~HBDNFWanqtFMopMDJwZd9KUW7LC-Gg34EotaC2UQd9FMK2PRfedp6"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    }).then(a => a.text())

    console.log(html.length)

    html = html.replace('<body>', `<body><style>body {width: 1248px !important}</style>`)
    // fs.writeFileSync('test.html', html)
    // html = fs.readFileSync('test.html').toString()
// fs.writeFileSync('test.html', html)


    var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    html = html.replace(scriptRegex, "");

    const dom = new JSDOM(html);
    const elem = dom.window.document.querySelector('[data-box-name="allegro.showoffer.columns"]')
    dom.window.document.body.innerHTML = '<style>body {width: 1248px !important}</style>';
    dom.window.document.body.appendChild(elem)

    html = dom.serialize()
    console.log(html.length)

    return await nodeHtmlToImage({
        quality: 100,
        type: 'png',
        transparent: true,
        waitUntil: 'load',
        puppeteerArgs: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        },
        content: {},
        html
    })
}
