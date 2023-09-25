const puppeteer = require('puppeteer')
const fs = require('fs').promises;

async function start(){
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    
    
    //Digite aqui o nome do Pokémon:
    const pokemon = 'pokemon-name';
    
    const Pokemon = pokemon[0].toUpperCase() + pokemon.slice(1).toLowerCase();
    await page.goto('https://pokemon.fandom.com/pt-br/wiki/Pokédex_Nacional')

    await page.waitForSelector(".global-navigation__search.global-navigation__icon")
    const search = await page.$(".global-navigation__search.global-navigation__icon")
    await page.evaluate(search => search.click(), search)

    await page.waitForSelector(".SearchInput-module_input__LhjJF")
    await page.type(".SearchInput-module_input__LhjJF",Pokemon, {delay: 0})
    await page.keyboard.press('Enter')

    await page.waitForSelector(".mw-search-exists a")

    const search2 = await page.$(".mw-search-exists a")

    await Promise.all([
        page.evaluate(search2 => search2.click(), search2),
        page.waitForNavigation(),
    ])

    const tipotudo = await page.$eval('#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(2)', el => el.textContent)
    const tipo = tipotudo.trim()
    //Decidi usar o .trim() porque precisei aumentar a tabela, gerando espaços vazios.

    const nometipo = await page.$eval('#mw-content-text > div > p:nth-child(3)', el => el.textContent)
    //OBS: A exemplo do Poliwrath e do Golduck, é necessário mudar um número do 'nth-child' para o programa rodar.

    const categoria = await page.$eval('#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(1)', el => el.textContent)
    const altura = await page.$eval('#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(1)', el => el.textContent)
    const peso = await page.$eval('#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(2)', el => el.textContent)
    const genero = await page.$eval('#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(9) > td', el => el.textContent)

    console.log("\n"+nometipo)
    console.log("Pokémon citado: "+Pokemon)
    console.log("Tipo(s): "+tipo)
    /*Decidi alertar ambos os tipos porque tem Pokémons que não têm o tipo na tabela e outros que não têm no parágrafo...
    Se o site fosse mais completo e organizado, acho que eu não teria tanta dor de cabeça assim.*/

    console.log("Categoria: "+categoria+"Altura: "+altura+"Peso: "+peso+"Distribuição de Gênero: "+genero)

    await browser.close()
}

start()
