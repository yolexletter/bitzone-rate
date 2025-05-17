
const puppeteer = require("puppeteer");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto("https://app.bitzone.space/currency", { waitUntil: "networkidle2" });

  const hybridRate = await page.evaluate(() => {
    const el = [...document.querySelectorAll("body *")].find(e =>
      e.textContent.includes("Гибридный курс")
    );
    const match = el?.textContent?.match(/1 USDT = ([\d.]+) RUB/);
    return match ? match[1] : null;
  });

  await browser.close();

  res.setHeader("Content-Type", "application/json");
  res.send({ hybridRate });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
