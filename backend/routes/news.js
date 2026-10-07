var express = require('express')
var router = express.Router()
var puppeteer = require('puppeteer')

var path = require('path')
var fs = require('fs')
var outputDir = path.join(__dirname, '../output')  // 이미지 저장 경로

if(!fs.existsSync(outputDir)) {     // output dir 이 없을경우
    fs.mkdirSync(outputDir)   // output dir 생성
}
var uuid = require('uuid')
var uuidv4 = uuid.v4

var OpenAI = require("openai");
var openai = new OpenAI()

router.post('/summary', async (req, res) => {

    try {

        var url = req.body.url

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
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        })
        await page.waitForSelector("body")    // body 태그가 화면에 보여줄때까지 기다리기
        var fileName = uuidv4() + ".png"   // 파일 이름 생성
        var filePath = path.join(outputDir, fileName)   // 파일이 저장될 경로
        await page.screenshot({ 
            path: filePath, 
            fullPage: true 
        })  // 전체 페이지 스크린샷 캡처

        var text = await page.evaluate(() => document.body.innerText)  // 페이지의 body 태그 안에 있는 텍스트 가져오기

        var imageBuffer = fs.readFileSync(filePath)  // 파일을 읽어서 buffer에 저장
        var base64Image = imageBuffer.toString('base64')  // buffer를 base64로 변환

        var response = await openai.responses.create({
            model: "gpt-6-luna",
            input: [
                {
                    role: "system",
                    content: "주어진 뉴스기사 풀페이지 캡쳐를 읽고 뉴스기사에 해당하는 내용 3줄로 요약해줘"
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "input_image",
                            image_url: `data:image/png;base64,${base64Image}`,
                            detail: "auto",
                        },
                    ],
                },
            ],
        });
        var summary = response.output_text
        res.json({ 
            success: true,
            summary: summary 
        })

    } catch(error) {

        console.error("에러 발생:")
        console.error(error)

        res.status(500).json({
            success: false,
            error: error.message
        })

    }
})


module.exports = router