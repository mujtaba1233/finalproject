const puppeteer = require('puppeteer');
const self = (module.exports = {
    convert: (htmlForConvert, options) => {
        let defaultOption = {
            browserOptions: {
                args: ['--font-render-hinting=none'],
            },
            pdfOptions: {
                printBackground: true,
            },
            waitForNetworkIdle: false,
        };
        if (options) {
            defaultOption.pdfOptions = { ...{ printBackground: true }, ...options };
        }
        // console.log(defaultOption);
        return new Promise(async (res, rej) => {
            const browser = await puppeteer.launch(defaultOption.browserOptions);
            const page = await browser.newPage();
            page.on('error', async (err) => {
                await browser.close();
                rej(err);
            });
            if (defaultOption.waitForNetworkIdle) {
                const html = self.createDataUri(self.fontFamily(htmlForConvert), 'text/html');
                await page.goto('data:text/html,' + html, {waitUntil: 'networkidle'});
                // await page.goto('data:text/html,' + html, { waitUntil: 'networkidle2' });
            }
            else {
                await page.setContent(htmlForConvert);
            }
            try {
                const pdf = await page.pdf(defaultOption.pdfOptions);
                await browser.close();
                res(pdf);
            }
            catch (err) {
                await browser.close();
                rej(new Error(`Error whilst generating PDF: ${err.message}`));
            }
        });
    },
})