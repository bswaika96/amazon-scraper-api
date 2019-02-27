const ptr = require('puppeteer')

const pageLoadOptions = {
    waitUntil: 'networkidle0',
    timeout: 0
}

const exec = async (keyword) => {
    const browser = await ptr.launch()
    const amazon = await browser.newPage()

    amazon.on('load', () => {
        console.log(`Page Loaded: ${amazon.url()}`)
    })

    const amazon_url = process.env.AMAZON_BASE_URL
    const amazon_search = process.env.AMAZON_SEARCH_BOX_ID
    const amazon_search_button = process.env.AMAZON_SEARCH_BUTTON
    const amazon_search_results = process.env.AMAZON_RESULT_LIST
    
    await amazon.goto(amazon_url, pageLoadOptions)

    await amazon.focus(amazon_search)
    await amazon.keyboard.type(keyword)
    await amazon.click(amazon_search_button)

    await amazon.waitForNavigation(pageLoadOptions)

    await amazon.waitForSelector(amazon_search_results)

    const items = await amazon.evaluate(() => {
        const result = {
            data: []
        }
        const list = document.querySelectorAll('li.s-result-item .s-item-container h2')
        const images = document.querySelectorAll('li.s-result-item .s-item-container img.s-access-image')
        const prices = document.querySelectorAll('li.s-result-item .s-item-container span.s-price')
        const links = document.querySelectorAll('li.s-result-item .s-item-container a.s-access-detail-page')
        for(let i=0; i<5; i++){
            result.data.push({
                name: list[i].getAttribute('data-attribute'),
                image: images[i].getAttribute('src'),
                price: prices[i].textContent.trim(),
                link: links[i].getAttribute('href').split('')[0] === '/' ? `https://www.amazon.in${links[i].getAttribute('href')}` : links[i].getAttribute('href')
            })
        }
        return result
    })

    await browser.close()

    return items
}

const init = (req, res, next) => {
    const keyword = req.body.keyword

    exec(keyword)
        .then((data) => {
            res.send({
                status: 'success',
                result: data
            })
        })
        .catch((err) => {
            console.log(err)
            res.send({
                status: 'failure',
                error: err
            })
        })
}

module.exports = {
    init
}