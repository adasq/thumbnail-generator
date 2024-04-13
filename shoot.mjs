import fetch from 'node-fetch';
import nodeHtmlToImage from 'nhti';
import fs from 'node:fs';
import path from 'node:path';
import {JSDOM} from 'jsdom'
import {exec} from 'node:child_process'
import {glob, sync} from "glob";
import puppeteer from 'puppeteer';
import _ from 'lodash'

const cookies = [
    `parcelsChecksum=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; _cmuid=82f42ca7-128f-4473-ab92-b9339a545a86; gdpr_permission_given=1; __gfp_64b=-TURNEDOFF; ws3=LFari4pXUdinVCDTAQ1MjiIWwOuIvcitN; _ga=GA1.1.1508817072.1717242429; _tt_enable_cookie=1; OptOutOnRequest=groups=googleAnalytics:1,googleAdvertisingProducts:1,tikTok:1,allegroAdsNetwork:1,facebook:1; _fbp=fb.1.1723109651986.1352229301; _meta_googleGtag_ga=GA1.1.1508817072.1717242429; QXLSESSID=390d806a7efd7aaf13595020459fa2e5f6e7cfa60bcc68//00; ajs_anonymous_id=fd130a2a-60d6-4714-927d-a94a74319036; _meta_googleGtag_gcl_aw=GCL.1730240470.EAIaIQobChMI0dmmg9C0iQMV8IiDBx3m8QuGEAEYASACEgK85PD_BwE; _gcl_aw=GCL.1730240483.EAIaIQobChMI0dmmg9C0iQMV8IiDBx3m8QuGEAEYASACEgK85PD_BwE; _gcl_gs=2.1.k5$i1730240482$u259627354; _meta_facebookTag_sync=1730968680322; _ttp=Ame5vz5nZJm1lyuwVHs-Ary2Fzm.tt.1; _gcl_au=1.1.1648364547.1732800320; parcelsChecksum=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; __eoi=ID=2bacd6698adcaf81:T=1732796462:RT=1736112583:S=AA-Afja2XcU_olmVzbUaYN0jRVkS; wdctx=v5.5zqjcnECMUVmrIexHjcpf_4LjhOwOjWbG8oQVCjjEiqv70HrGKHynrijewcjdhWOrXBDxoYpJZC5f-dRV09TUhWXoARCK7GV7wwFyGSNHlyNuDyZ785PbdypQhrfizUu3_cHNY6bz1NuDhrZtA8NyTnt2bIrmKPj8WrCjixsR1yWK9NQl_4UM1RalKlo7XPi5TZPON346_r2wPZj-a45ejan5yUmHCEwXTGppNnsnGTGdzE.KE3gpG3fQZ-Gjd4zjd2SHA.Nq2NwJ_nsvs; _meta_googleGtag_session_id=1736164118; _meta_googleGtag_ga_session_count=313; _meta_googleGtag_ga_library_loaded=1736164538794; __rtbh.lid=%7B%22eventType%22%3A%22lid%22%2C%22id%22%3A%22vCeQTg2hQX37tkCaiZ1T%22%2C%22expiryDate%22%3A%222026-01-06T11%3A55%3A39.117Z%22%7D; _ga_G64531DSC4=GS1.1.1736164118.327.0.1736164539.18.0.0; datadome=4wmjoBLAcYIL4v87_178_KrPUCK0zb8Jkks8n~oQKf~yGD~XxKnI2Vw4JKWlA0f9QOLlULG0IuBfavSNOvHwSaqcgdpvKHwNkkjEUVHB5BhkbUYYpEkTAqoURwJiv~3x; __rtbh.uid=%7B%22eventType%22%3A%22uid%22%2C%22id%22%3A%226fa0db2a105c797e9ee8824220ed03fb3c3a46d17e990c6302fe31e4e384aa20%22%2C%22expiryDate%22%3A%222026-01-06T11%3A55%3A39.707Z%22%7D`,
    "_cmuid=1dc68e0f-1b57-4030-b66e-42c94650c10f; wdctx=v5.dl_bYVxyFxHGgKPd7IFU-1rcI8RglW0yxJj8ATC8WvNeh3TPXHCw2ncKwM8xfMMT6dd6_FXsh-uiI91889QxCo1X0ObuXwWmoGjTpVHyeLu6y1XK_cpsgf8sXo71mUU8YofczgVBx4IeNHctWtY0bgPxJjgW0xi0kdgotayRGkR2-irXdi4iAHhGl29kkfphIYyVYmW92TxGdwVnSwuGfqNRIEKPAvMvM3IyOrFJF-A.8Va3IhamTwagzaDW_0wCcA.iYlEtTLn3cE; gdpr_permission_given=1; __gfp_64b=-TURNEDOFF; datadome=KysLnQb9FM5KNMTX9AIY0vKRhG8j6iQuLaTyjtjb7MbW10UJ6_nL_zye2XbY2a~j8NNMqhl~avfEQqfg54VHFYMKHDJ_x5jWqd4QZ4QfwgDFdlB8EzXKyyK7mPtlNEJF", // new 1
    "_cmuid=1dc68e0f-1b57-4030-b66e-42c94650c10f; wdctx=v5.vs9nRZFyqRkJVWDHzhsaPaAoThwfY8rUym3z-niZP_BNKzy8CiumKuz0pWCBW-Zm6w0RWkP3lecr7PYmeOdY0Z7aVQLtFFDyue9c-g8SdTRdN1GCAuT2kSTwZREOaj9_kgHaNGx1q1RVQ00FP8L7fx3Xp58KkIaxsi2p2Gxg2fHhKiGerILYQ9xhAG1p-rJyoCXmVLFYlDGkMg8fl01_3wWwr56ZIZRWnGuxvTr_3qM.TNCs2uGGRxaIR7sC0nAAEg.fHwEoKUTlaI; __gfp_64b=-TURNEDOFF; datadome=F0Jfj6XA7Ka3VE0JqBwEpcJo~krjvjekHdXrPewEcTW2ZjqRGSkH6ArQazfQK4iJOwY_sqnoXoxBKOTRwPF74b4PP_Wc~XEhKY8qFXMF1aWT_i1JFMSgrLSKMRj7kFFv", // new 2
    "_cmuid=372afef3-7cae-4f32-8466-c0e0e33c7e4c; wdctx=v5.LXs-gcS8cd3S0OnKmYoZS0n19eZsWiEePTM73xhOnlB_Bk50EqdpiTpSW3OEt115jQQElt7duUiLWyowGFROBEfdv_WBPK7QOFxgXSETeq6A7g7JQLBbJrcTgXatmw1yD_1PZC3ABDpbi_2zQGZ9KzINmesiEodigcbcJ4q1XOyijRDX2lnHy-ouW42ZWT8OP8TCKmj3ujoHHiX7OJepVcpVMrtv90ImEUB561JewrY.FLNpH6kkSAOP-oDufcbBAw._vNQCsCBh_U; gdpr_permission_given=1; __gfp_64b=-TURNEDOFF; datadome=7voYT6SSLdVukJNnulfMIuZ1gr76_nRy6kC~jkuDchFSETZGmaL~p9muZbuqGeOu_Eqk8vyfjgACOUSDfpNdZE9kAs3A3ZAsYEK~ihQyW2Ta9cdJ7zklhAGH38~NXe1Z", // new 3
    "v5.LXs-gcS8cd3S0OnKmYoZS0n19eZsWiEePTM73xhOnlB_Bk50EqdpiTpSW3OEt115jQQElt7duUiLWyowGFROBEfdv_WBPK7QOFxgXSETeq6A7g7JQLBbJrcTgXatmw1yD_1PZC3ABDpbi_2zQGZ9KzINmesiEodigcbcJ4q1XOyijRDX2lnHy-ouW42ZWT8OP8TCKmj3ujoHHiX7OJepVcpVMrtv90ImEUB561JewrY.FLNpH6kkSAOP-oDufcbBAw._vNQCsCBh_U; _cmuid=b6d42846-3e8a-4d1d-9151-090334fed3d5; wdctx=v5.wbcAxZoIA_Ayx6ylvfOERwKJeCvqXRd8MjRQaBHEoxgA1Q3wKrQcGolXK5dGL3eQI76XLAkZKdA0zTNZcB4Dp2S4lNUHOKg8kcwJ4If5Z90u8tIDL9Q5etjtElKRR3SKJu6nTw1ZRrywcPVoOFjWnuhrkq7TXgqubuIxCFb1DhCSp8tQukiIPs-4pLyCCjZfIjrtQ_N8kWBRCjQTuFE5Vm_wdshtwD4aVgm7UXdXlnc.AgRLpHE2S4eLDAFu8T2Mgg.4_-uvqY3MEM; datadome=QX_aRY9ajLcMJhCD1egNDpEiCTHBbJPkXOVrVVQRsfTeXQKL1HfRYx_CUUUMjgE_TtsmALtFDxR0gnlCv~8d5HEQpXuK3~JNoeDMPesuuJYhZ~ALREUddeYt9zRgkEM_; gdpr_permission_given=1; __gfp_64b=-TURNEDOFF"
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function exec2(command) {
    return new Promise((resolve, reject) => {
        exec(command, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
            // if (error) {
            //     console.error(`Error executing command: ${error.message}`);
            // }
            // if (stderr) {
            //     console.error(`Shell error: ${stderr}`);
            // }
            console.log(`Output: ${stdout.length}`);
            resolve(stdout)
        });
    });
}

function fetchUrl() {
    return exec2(`curl -sS 'https://allegro.pl/oferta/nasiona-konopi-luskane-500g-11335715273?AUUUUUU=13_09_06&utm_medium=afiliacja&utm_source=ctr_2&utm_campaign=76054d7f-ca30-4d11-a152-9f610300b6f6' \\
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \\
  -H 'accept-language: pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7' \\
  -H 'cache-control: no-cache' \\
  -H 'cookie: parcelsChecksum=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; _cmuid=82f42ca7-128f-4473-ab92-b9339a545a86; gdpr_permission_given=1; __gfp_64b=-TURNEDOFF; ws3=LFari4pXUdinVCDTAQ1MjiIWwOuIvcitN; _ga=GA1.1.1508817072.1717242429; _tt_enable_cookie=1; OptOutOnRequest=groups=googleAnalytics:1,googleAdvertisingProducts:1,tikTok:1,allegroAdsNetwork:1,facebook:1; _fbp=fb.1.1723109651986.1352229301; _meta_googleGtag_ga=GA1.1.1508817072.1717242429; QXLSESSID=390d806a7efd7aaf13595020459fa2e5f6e7cfa60bcc68//00; ajs_anonymous_id=fd130a2a-60d6-4714-927d-a94a74319036; _meta_googleGtag_gcl_aw=GCL.1730240470.EAIaIQobChMI0dmmg9C0iQMV8IiDBx3m8QuGEAEYASACEgK85PD_BwE; _gcl_aw=GCL.1730240483.EAIaIQobChMI0dmmg9C0iQMV8IiDBx3m8QuGEAEYASACEgK85PD_BwE; _gcl_gs=2.1.k5$i1730240482$u259627354; _meta_facebookTag_sync=1730968680322; _ttp=Ame5vz5nZJm1lyuwVHs-Ary2Fzm.tt.1; _gcl_au=1.1.1648364547.1732800320; parcelsChecksum=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; __eoi=ID=2bacd6698adcaf81:T=1732796462:RT=1736112583:S=AA-Afja2XcU_olmVzbUaYN0jRVkS; wdctx=v5.5zqjcnECMUVmrIexHjcpf_4LjhOwOjWbG8oQVCjjEiqv70HrGKHynrijewcjdhWOrXBDxoYpJZC5f-dRV09TUhWXoARCK7GV7wwFyGSNHlyNuDyZ785PbdypQhrfizUu3_cHNY6bz1NuDhrZtA8NyTnt2bIrmKPj8WrCjixsR1yWK9NQl_4UM1RalKlo7XPi5TZPON346_r2wPZj-a45ejan5yUmHCEwXTGppNnsnGTGdzE.KE3gpG3fQZ-Gjd4zjd2SHA.Nq2NwJ_nsvs; _meta_googleGtag_session_id=1736164118; _meta_googleGtag_ga_session_count=313; _meta_googleGtag_ga_library_loaded=1736164538794; __rtbh.lid=%7B%22eventType%22%3A%22lid%22%2C%22id%22%3A%22vCeQTg2hQX37tkCaiZ1T%22%2C%22expiryDate%22%3A%222026-01-06T11%3A55%3A39.117Z%22%7D; _ga_G64531DSC4=GS1.1.1736164118.327.0.1736164539.18.0.0; datadome=4wmjoBLAcYIL4v87_178_KrPUCK0zb8Jkks8n~oQKf~yGD~XxKnI2Vw4JKWlA0f9QOLlULG0IuBfavSNOvHwSaqcgdpvKHwNkkjEUVHB5BhkbUYYpEkTAqoURwJiv~3x; __rtbh.uid=%7B%22eventType%22%3A%22uid%22%2C%22id%22%3A%226fa0db2a105c797e9ee8824220ed03fb3c3a46d17e990c6302fe31e4e384aa20%22%2C%22expiryDate%22%3A%222026-01-06T11%3A55%3A39.707Z%22%7D' \\
  -H 'dnt: 1' \\
  -H 'dpr: 1' \\
  -H 'pragma: no-cache' \\
  -H 'priority: u=0, i' \\
  -H 'sec-ch-device-memory: 8' \\
  -H 'sec-ch-prefers-color-scheme: dark' \\
  -H 'sec-ch-prefers-reduced-motion: no-preference' \\
  -H 'sec-ch-ua: "Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"' \\
  -H 'sec-ch-ua-arch: "arm"' \\
  -H 'sec-ch-ua-full-version-list: "Google Chrome";v="131.0.6778.205", "Chromium";v="131.0.6778.205", "Not_A Brand";v="24.0.0.0"' \\
  -H 'sec-ch-ua-mobile: ?0' \\
  -H 'sec-ch-ua-model: ""' \\
  -H 'sec-ch-ua-platform: "macOS"' \\
  -H 'sec-ch-viewport-height: 413' \\
  -H 'sec-fetch-dest: document' \\
  -H 'sec-fetch-mode: navigate' \\
  -H 'sec-fetch-site: none' \\
  -H 'sec-fetch-user: ?1' \\
  -H 'upgrade-insecure-requests: 1' \\
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 ESSA' \\
  -H 'viewport-width: 1920'`)
}

export const shoot = async ({url, params}, output) => {
    const cookieIndex = 0 // getRandomInt(cookies.length);
    console.log({cookieIndex, url})


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

// Navigate the page to a URL.
    await page.goto('https://developer.chrome.com/');

// Set screen size.

    const sss = await page.screenshot({fullPage: true});
    fs.writeFileSync('test2.png', sss)
    return sss


    let html = await fetchUrl(url)


    html = html.replace('<body>', `<body><style>body {width: 1248px !important}</style>`)
    // fs.writeFileSync('test.html', html)
    // html = fs.readFileSync('test.html').toString()
// fs.writeFileSync('test.html', html)


    var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    html = html.replace(scriptRegex, "");

    const dom = new JSDOM(html);
    const elem = dom.window.document.querySelector('[data-box-name="allegro.showoffer.columns"]')
    if (!elem) {
        return html;
    }
    dom.window.document.body.innerHTML = '<style>body {width: 1248px !important}</style>';
    dom.window.document.body.appendChild(elem)

    html = dom.serialize()
    console.log(html.length)

// Or import puppeteer from 'puppeteer-core';

// Launch the browser and open a new blank page

}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

const findLastBy = async (eci = "ZG1W") => {
    let browser;
    console.log('findLastBy')
    const start = Date.now();

    async function addNewPage(browser) {
        const page = await browser.newPage();
// Navigate the page to a URL.
        await page.goto('https://ekw.ms.gov.pl/eukw_ogol/menu.do');
        await wait(1000);
// Set screen size.
        await page.setViewport({width: 1080, height: 1024});

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' + Date.now());
        console.log('new page...')
        await page.goto('https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW');
        await wait(1000);
        return page;
    }

    async function restartBrowser() {
        if (browser) {
            await browser.close()
        }
        browser = await puppeteer.launch({
            // executablePath: '/usr/bin/chromium-browser',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }


    await restartBrowser()
    let page = await addNewPage(browser)
    await wait(1000);


    let totalAttempts = 0;
    let MAX = 1_000_000;
    let PREFIX = 0;
    let notFoundCount = 0;
    do {
        const num = PREFIX + MAX + notFoundCount
        const item = get(eci, num);
        console.log(`@@@@@@@@@@@@@@@@`, num)

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' + Date.now());
            // if(cookies && cookies.length) {
            //     await page.setCookie(...cookies[getRandomNumber(0, cookies.length-1)])
            // }
            console.log(item)
            const html = await page.evaluate(({item}) => {
                const {eci, nr, control} = item;
                return fetch("https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW?q=" + Date.now(), {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"macOS\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    "referrer": "https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW?komunikaty=true&kontakt=true&okienkoSerwisowe=false&qq=" + Date.now(),
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `kodEci=${eci}&numerKw=${nr}&cyfraKontrolna=${control}&wyszukaj=Submit&sth=` + Date.now(),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(a => a.text())
            }, {item});

            const dom = new JSDOM(html);
            const isFail = `Request Rejected` === dom.window.document.title
            const notFound = dom.window.document.body.innerHTML.includes('nie została odnaleziona')
            console.log(`===== #${++totalAttempts}`, dom.window.document.title, {isFail, notFound})

            if (isFail) throw 'isFail';

            if (notFound) {
                notFoundCount++
                console.log('Not Found #', notFoundCount)
                if (notFoundCount === 3) {
                    notFoundCount = 0;
                    MAX = Math.round(MAX / 2)
                    continue;
                }

                continue;
            }

            PREFIX = PREFIX + MAX

            await wait(getRandomNumber(100, 200))
            // orderOfMagnitude = orderOfMagnitude + 1
        } catch (err) {
            console.log(err);
            const mins = (Date.now() - +start) / 1000 / 60;
            await wait(getRandomNumber(10_000))
            await restartBrowser(browser)
            page = await addNewPage(browser)
            await wait(getRandomNumber(4_000))
        }
    } while (true)
    console.log('Done')
    browser.close()

    // browser.close()
}

async function run2() {
    let browser;
    browser = await puppeteer.launch({
        // executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });


    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 2000});
// Navigate the page to a URL.
//     await page.goto('https://allegro.pl/');

    // const url = 'https://allegro.pl/oferta/woda-w-butlach-18-9-l-3-szt-12753187410?utm_medium=afiliacja&utm_source=ctr_2&utm_campaign=76054d7f-ca30-4d11-a152-9f610300b6f6&utm_content=3eb9c49274e7#'
    // const result = await fetch(`https://api.scrapfly.io/scrape?tags=player,project:default&asp=true&render_js=false&rendering_wait=1001&key=scp-live-ff5d6c84e35b41c1bb60189b7b6be79b&url=${encodeURI(url)}`).then(a => a.json())
    // const html = result.result.content
    // fs.writeFileSync('offer.html', result.result.content)

    let html = fs.readFileSync('offer.html').toString()
    // console.log(html);

    html = html.replace('<body>', `<body><style>body {width: 1248px !important}</style>`)
    // fs.writeFileSync('test.html', html)
    // html = fs.readFileSync('test.html').toString()
// fs.writeFileSync('test.html', html)


    var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    html = html.replace(scriptRegex, "");
    // html = html.replaceAll(`data-src="`, ` src="`);

    const dom = new JSDOM(html);


    const imgs = [...dom.window.document.querySelectorAll('img')];
    imgs.forEach(elem => {
        if(elem.getAttribute('src') === 'https://assets.allegrostatic.com/metrum/metrum-placeholder/placeholder-405f0677c6.svg') {
            elem.setAttribute('src', elem.getAttribute('data-src'))
            elem.setAttribute('srcset', '')
        }

    })

    const elem = dom.window.document.querySelector('[data-box-name="allegro.showoffer.columns"]')
    if (!elem) {
        return html;
    }
    dom.window.document.body.innerHTML = '<style>body {width: 1248px !important}</style>';
    dom.window.document.body.appendChild(elem)

    html = dom.serialize()


    const htmlContent = `
    ${html}
  `;
    await page.setContent(htmlContent);

    await wait(5000);

    const sss = await page.screenshot({fullPage: true});
    fs.writeFileSync('test2.png', sss)
    console.log('Done')
    // browser.close()
// Set screen size.

}

const run = async ({times, nrs} = {}) => {
    let browser;

    const start = Date.now();

    async function addNewPage(browser) {
        const page = await browser.newPage();
// Navigate the page to a URL.
        await page.goto('https://ekw.ms.gov.pl/eukw_ogol/menu.do');
        await wait(1000);
// Set screen size.
        await page.setViewport({width: 1080, height: 1024});

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' + Date.now());
        console.log('new page...')
        await page.goto('https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW');
        await wait(1000);
        return page;
    }

    async function restartBrowser() {
        if (browser) {
            await browser.close()
        }
        browser = await puppeteer.launch({
            // executablePath: '/usr/bin/chromium-browser',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }


    await restartBrowser()
    let page = await addNewPage(browser)
    await wait(1000);
    let totalAttempts = 0;
    let notFoundIteration = 0;
    for (let i = 0; i < nrs.length; i++) {
        console.log(`@@@@@@@@@@@@@@@@`, `${i}/${nrs.length}`)
        if (fileExists(`./dist/${nrs[i].eci}/${nrs[i].nr}.DIO.html`)) {
            console.log('exists')
            continue
        }

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' + Date.now());
            // if(cookies && cookies.length) {
            //     await page.setCookie(...cookies[getRandomNumber(0, cookies.length-1)])
            // }
            console.log(nrs[i])
            const html = await page.evaluate(({item}) => {
                const {eci, nr, control} = item;
                return fetch("https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW?q=" + Date.now(), {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"macOS\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    "referrer": "https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW?komunikaty=true&kontakt=true&okienkoSerwisowe=false&qq=" + Date.now(),
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `kodEci=${eci}&numerKw=${nr}&cyfraKontrolna=${control}&wyszukaj=Submit&sth=` + Date.now(),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(a => a.text())
            }, {item: nrs[i]});

            const dom = new JSDOM(html);
            const isFail = `Request Rejected` === dom.window.document.title
            const notFound = dom.window.document.body.innerHTML.includes('nie została odnaleziona')
            const uuidElem = dom.window.document.body.querySelector('[id="uuid"]');
            console.log(`===== #${++totalAttempts}`, dom.window.document.title, {isFail, notFound})

            if (isFail) throw 'isFail';

            if (notFound) {
                notFoundIteration++;
                console.log('Not Found', notFoundIteration)
                fs.writeFileSync(`dist/${nrs[i].eci}/${nrs[i].nr}.html`, '404')
                fs.writeFileSync(`dist/${nrs[i].eci}/${nrs[i].nr}.DIO.html`, '404')
                continue;
            }
            notFoundIteration = 0;
            nrs[i].uuid = uuidElem.getAttribute('value')

            const html2 = await page.evaluate(({item}) => {
                const {eci, nr, control, uuid} = item;
                return fetch("https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/pokazWydruk?q=" + Date.now(), {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"macOS\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    "referrer": "https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW?komunikaty=true&kontakt=true&okienkoSerwisowe=false&qq=" + Date.now(),
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `dzialKsiegi=DIO&kodWydzialu=${eci}&nrKw=${nr}&cyfraK=${control}&uuid=${uuid}&przyciskWydrukZupelny=`,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(a => a.text())
            }, {item: nrs[i]});

            const dom2 = new JSDOM(html2);
            const text = dom2.window.document.body.textContent;
            const isFail2 = !text.includes(nrs[i].nr)
            console.log(`===== #${totalAttempts} DIO`, text.replaceAll(/\s+\t+/g, ' ').substring(0, 50), {isFail2})

            if (isFail2) {
                throw 'isFail2';
            }
            // const notFound = dom.window.document.body.innerHTML.includes('nie została odnaleziona')
            // const uuidElem = dom.window.document.body.querySelector('[id="uuid"]');


            // console.log((new JSDOM(html2)).window.document.body.textContent)


            fs.writeFileSync(`dist/${nrs[i].eci}/${nrs[i].nr}.html`, dom.window.document.body.innerHTML)
            fs.writeFileSync(`dist/${nrs[i].eci}/${nrs[i].nr}.DIO.html`, dom2.window.document.body.innerHTML)


            // if (totalAttempts % 3 === 0) {
            //     page.reload();
            // }


            try {
                console.log(Array.from(dom.window.document.querySelectorAll('.content .content-column-50'))
                    .map(elem => elem.textContent.replaceAll(/\s+\t/g, '').trim())
                    .filter(Boolean)
                    .join('\n'))
            } catch (err) {
                console.log(err)
            }

            await wait(getRandomNumber(100, 200))
        } catch (err) {
            console.log(err);
            i = i - 1;
            const mins = (Date.now() - +start) / 1000 / 60;
            console.log({mins, i, queriesPerMinute: (i / mins).toFixed(2)})
            await wait(getRandomNumber(10_000))
            await restartBrowser(browser)
            page = await addNewPage(browser)
            await wait(getRandomNumber(4_000))
        }
    }
    console.log('Done')
    browser.close()

    // browser.close()
}

function algorytmCRC(c) {
    var k = 12;
    var g = 5;
    var f = 4;
    var a = "ABCDEFGHIJKLMNOPRSTUWYZ";
    var l = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    var j = [0, 1, 3];
    var d = 0;
    var b;
    c = c.toUpperCase();
    for (var h = 0; h < j.length; h++) {
        b = a.indexOf(c.substr([j[h]], 1));
        d += (b + 1) * l[j[h]]
    }
    if (!isNaN(c.substr(2, 1))) {
        d += (c.substr(2, 1) - 0) * l[2]
    } else {
        b = a.indexOf(c.substr(2, 1));
        d += (b + 1) * l[2]
    }
    for (var e = f; e < k; e++) {
        d += (c.substr(e, 1) - 0) * l[e]
    }
    return (d % 10)
}


function generateValidInput() {
    const maxLength = 7; // Remaining numeric characters for length 13 total
    const maxNumber = Math.pow(10, maxLength); // Limits to 9 digits (000000000 to 999999999)
    const pattern = ["ZG1W", 7, 0]

    // return console.log(maxNumber)
    const all = []
    let total = 1;
    for (let i = 0; i < maxNumber / 100; i++) {
        let numericPart = i.toString().padStart(maxLength, '0'); // Pad with zeros for fixed length
        let inputString = pattern[0] + numericPart + pattern[1];
        if (algorytmCRC(inputString) === pattern[2]) {
            console.log(++total, pattern[0], numericPart + pattern[1]);
            all.push({
                eci: pattern[0],
                nr: numericPart + pattern[1],
                control: pattern[2]
            })
        }
    }
    return all; // Fallback if no valid string is found (very unlikely)
}

function getNext(eci, nr) {
    const nextNum = ((+nr + 1)).toString().padStart(8, '0')
    const control = algorytmCRC(eci + nextNum);

    return {eci, nr: nextNum, control}; // Pad with zeros for fixed length
}

function get(eci, nr) {
    const nextNum = ((+nr)).toString().padStart(8, '0')
    const control = algorytmCRC(eci + nextNum);

    return {eci, nr: nextNum, control}; // Pad with zeros for fixed length
}

run2();
// setTimeout(run, 2000)
// setTimeout(run, 4000)

(async () => {
    return;
    let list = [];

    // const polna28Numbers = _.repeat('1', 378992).split("").map((q, a) => a).filter((num) => num % 10 === 1 && get('PO1P', num).control === 5).map(num => get('PO1P', num));
    //
    // return await run({
    //     nrs: polna28Numbers,
    // })

    // return await findLastBy("PO1P")

    /*
            @@@@@@@@@@@@@@@@ 855/5000
        { eci: 'PO1P', nr: '00379912', control: 7 }
        ===== #153 EUKW - Wykaz Ksiąg Wieczystych { isFail: false, notFound: true }
        Not Found 100
     */
    const start = 379057;
    for (let i = start; i < start + 5000; i++) {
        list.push(get('PO1P', i))
    }
    return await run({nrs: list})

    // return await findLastBy("ZG1W")


    const max = 28500;

    for (let i = 0; i < max; i++) {
        list.push(get('ZG1W', i))
    }

    return await run({
        nrs: list || generateValidInput()
    })

        // await run({
        //     nrs: [{eci: 'PO1P', nr: '00001994', control: 5}]
        // })
        ;

    do {
        await run(100000);
        await wait(15_000) // 10 minutes
        // await run(getRandomNumber(6, 12));
        // await wait(getRandomNumber(25_000, 40_000)) // 10 minutes
        console.log('thx')
    } while (true)
})()

function getRandomNumber(start, end = start) {
    if (start > end) {
        throw new Error("Start must be less than or equal to end.");
    }
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        return false;
    }
}