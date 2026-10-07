var puppeteer = require('puppeteer');

(async () => {
    var browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { 
            width: 1920, height: 1080 
        },
        args: ["--window-size=1920,1080"]
    });
    var page = await browser.newPage();
    page.setViewport({ 
        width: 1920, 
        height: 1080 
        })
        await page.goto('https://www.fnnews.com/news/202610071432146879?utm_source=naver&utm_medium=naver_newsstand&utm_campaign=fnnews&pg=nv_newsstand')
        await page.waitForSelector("body")    // body 태그가 화면에 보여줄때까지 기다리기

        await page.screenshot({ 
            path: "capture.png", 
            fullPage: true 
        })  // 전체 페이지 스크린샷 캡처

        var text = await page.evaluate(() => document.body.innerText)  // 페이지의 body 태그 안에 있는 텍스트 가져오기
        console.log(text)  // 콘솔에 출력
})()