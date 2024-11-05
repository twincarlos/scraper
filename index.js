const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { parsePlayerLookup, parsePlayerInfo } = require('./parse');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = 3000;

app.get('/usatt/player-lookup/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const url = `https://usatt.simplycompete.com/userAccount/s2?citizenship=&gamesEligibility=&gender=&minAge=&maxAge=&minTrnRating=&maxTrnRating=&minLeagueRating=&maxLeagueRating=&state=&region=Any+Region&favorites=&q=${keyword}&displayColumns=First+Name&displayColumns=Last+Name&displayColumns=USATT%23&displayColumns=Location&displayColumns=Home+Club&displayColumns=Tournament+Rating&pageSize=1000`;
  if (!url) {
    return res.status(400).json({ error: 'URL query parameter is required' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://usatt.simplycompete.com/',
    });
    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.content();

    res.json(parsePlayerLookup(content));
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Scraping failed", details: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.get('/usatt/player-info/:playerId', async (req, res) => {
  const { playerId } = req.params;
  const url = `https://usatt.simplycompete.com/userAccount/up/${playerId}`;
  if (!url) {
    return res.status(400).json({ error: 'URL query parameter is required' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.content();

    res.json(parsePlayerInfo(content));
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Scraping failed", details: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));