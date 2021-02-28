const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

const url = 'https://www.digi.ro/auth/login';
if (!url) {
    throw "Please provide URL as a first argument";
}
async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.type('#signin-input-email', process.env.RDS_USERNAME);
    await page.type('#signin-input-password', process.env.RDS_PASSWORD);
    await page.screenshot({ path: 'screenshot1.png' });

    await Promise.all([
        page.click('#signin-submit-button'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await Promise.all([
        page.goto('https://www.digi.ro/my-account/invoices'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    let gdprSelectorToRemove = "#gdpr";

    await page.evaluate((sel) => {
        const elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }, gdprSelectorToRemove)

    await page.$$eval('.my-account-tbl-row', (el) => {
        console.log(`Element: ${el}\n`);
    });

    await page.screenshot({ path: 'screenshot2.png' });
    browser.close();
}
run();