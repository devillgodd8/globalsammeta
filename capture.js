const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const pages = [
        { name: 'home', url: 'http://localhost:3000/' },
        { name: 'about', url: 'http://localhost:3000/about-us' },
        { name: 'track', url: 'http://localhost:3000/track-order' }
    ];
    const viewports = [
        { width: 1440, height: 900, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 375, height: 812, name: 'mobile' }
    ];

    for (const pageInfo of pages) {
        for (const vp of viewports) {
            const page = await browser.newPage();
            await page.setViewport({ width: vp.width, height: vp.height });
            await page.goto(pageInfo.url, { waitUntil: 'networkidle2' });
            // wait a little bit for animations
            await new Promise(r => setTimeout(r, 1000));
            await page.screenshot({ path: `${pageInfo.name}-${vp.name}.png`, fullPage: true });
            await page.close();
        }
    }

    await browser.close();
})();
