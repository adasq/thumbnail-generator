import fetch from 'node-fetch';
import nodeHtmlToImage from 'nhti';
import fs from 'node:fs';
import {JSDOM} from 'jsdom'



const cookies = [
    "_cmuid=1dc68e0f-1b57-4030-b66e-42c94650c10f; wdctx=v5.dl_bYVxyFxHGgKPd7IFU-1rcI8RglW0yxJj8ATC8WvNeh3TPXHCw2ncKwM8xfMMT6dd6_FXsh-uiI91889QxCo1X0ObuXwWmoGjTpVHyeLu6y1XK_cpsgf8sXo71mUU8YofczgVBx4IeNHctWtY0bgPxJjgW0xi0kdgotayRGkR2-irXdi4iAHhGl29kkfphIYyVYmW92TxGdwVnSwuGfqNRIEKPAvMvM3IyOrFJF-A.8Va3IhamTwagzaDW_0wCcA.iYlEtTLn3cE; gdpr_permission_given=1; __gfp_64b=-TURNEDOFF; datadome=KysLnQb9FM5KNMTX9AIY0vKRhG8j6iQuLaTyjtjb7MbW10UJ6_nL_zye2XbY2a~j8NNMqhl~avfEQqfg54VHFYMKHDJ_x5jWqd4QZ4QfwgDFdlB8EzXKyyK7mPtlNEJF", // new 1
    "_cmuid=1dc68e0f-1b57-4030-b66e-42c94650c10f; wdctx=v5.vs9nRZFyqRkJVWDHzhsaPaAoThwfY8rUym3z-niZP_BNKzy8CiumKuz0pWCBW-Zm6w0RWkP3lecr7PYmeOdY0Z7aVQLtFFDyue9c-g8SdTRdN1GCAuT2kSTwZREOaj9_kgHaNGx1q1RVQ00FP8L7fx3Xp58KkIaxsi2p2Gxg2fHhKiGerILYQ9xhAG1p-rJyoCXmVLFYlDGkMg8fl01_3wWwr56ZIZRWnGuxvTr_3qM.TNCs2uGGRxaIR7sC0nAAEg.fHwEoKUTlaI; __gfp_64b=-TURNEDOFF; datadome=F0Jfj6XA7Ka3VE0JqBwEpcJo~krjvjekHdXrPewEcTW2ZjqRGSkH6ArQazfQK4iJOwY_sqnoXoxBKOTRwPF74b4PP_Wc~XEhKY8qFXMF1aWT_i1JFMSgrLSKMRj7kFFv", // new 2
    "_cmuid=372afef3-7cae-4f32-8466-c0e0e33c7e4c; wdctx=v5.LXs-gcS8cd3S0OnKmYoZS0n19eZsWiEePTM73xhOnlB_Bk50EqdpiTpSW3OEt115jQQElt7duUiLWyowGFROBEfdv_WBPK7QOFxgXSETeq6A7g7JQLBbJrcTgXatmw1yD_1PZC3ABDpbi_2zQGZ9KzINmesiEodigcbcJ4q1XOyijRDX2lnHy-ouW42ZWT8OP8TCKmj3ujoHHiX7OJepVcpVMrtv90ImEUB561JewrY.FLNpH6kkSAOP-oDufcbBAw._vNQCsCBh_U; gdpr_permission_given=1; __gfp_64b=-TURNEDOFF; datadome=7voYT6SSLdVukJNnulfMIuZ1gr76_nRy6kC~jkuDchFSETZGmaL~p9muZbuqGeOu_Eqk8vyfjgACOUSDfpNdZE9kAs3A3ZAsYEK~ihQyW2Ta9cdJ7zklhAGH38~NXe1Z", // new 3
    "v5.LXs-gcS8cd3S0OnKmYoZS0n19eZsWiEePTM73xhOnlB_Bk50EqdpiTpSW3OEt115jQQElt7duUiLWyowGFROBEfdv_WBPK7QOFxgXSETeq6A7g7JQLBbJrcTgXatmw1yD_1PZC3ABDpbi_2zQGZ9KzINmesiEodigcbcJ4q1XOyijRDX2lnHy-ouW42ZWT8OP8TCKmj3ujoHHiX7OJepVcpVMrtv90ImEUB561JewrY.FLNpH6kkSAOP-oDufcbBAw._vNQCsCBh_U; _cmuid=b6d42846-3e8a-4d1d-9151-090334fed3d5; wdctx=v5.wbcAxZoIA_Ayx6ylvfOERwKJeCvqXRd8MjRQaBHEoxgA1Q3wKrQcGolXK5dGL3eQI76XLAkZKdA0zTNZcB4Dp2S4lNUHOKg8kcwJ4If5Z90u8tIDL9Q5etjtElKRR3SKJu6nTw1ZRrywcPVoOFjWnuhrkq7TXgqubuIxCFb1DhCSp8tQukiIPs-4pLyCCjZfIjrtQ_N8kWBRCjQTuFE5Vm_wdshtwD4aVgm7UXdXlnc.AgRLpHE2S4eLDAFu8T2Mgg.4_-uvqY3MEM; datadome=QX_aRY9ajLcMJhCD1egNDpEiCTHBbJPkXOVrVVQRsfTeXQKL1HfRYx_CUUUMjgE_TtsmALtFDxR0gnlCv~8d5HEQpXuK3~JNoeDMPesuuJYhZ~ALREUddeYt9zRgkEM_; gdpr_permission_given=1; __gfp_64b=-TURNEDOFF"
]
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export const shoot = async ({url, params}, output) => {
    const cookieIndex = getRandomInt(cookies.length);
    console.log({ cookieIndex})
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
            "cookie": cookies[cookieIndex]
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
    if (!elem) {
        return html;
    }
    dom.window.document.body.innerHTML = '<style>body {width: 1248px !important}</style>';
    dom.window.document.body.appendChild(elem)

    html = dom.serialize()
    console.log(html.length)

    return await nodeHtmlToImage({
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
        html
    })
}

if(process.env.CI) {
    ;(async () => {
        console.log('CI!');
        fs.writeFileSync('./test.png', await shoot({}))
        console.log('done!');

    })()
}