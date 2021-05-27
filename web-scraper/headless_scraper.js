const puppeteer = require('puppeteer');
const path = require('path');
const info = require('./config.js');

// Constants
const invoiceDropdown = '#navbarNavDropdown > ul.navbar-nav.mr-auto > li';
const downloadPath = path.join(__dirname, '/Invoice Downloads');

// Web scraper function that uses puppeteer to navigate the CondoWorks
// website to a specific page, download a PDF invoice and return its file path
async function ScrapeInvoice() {
  // Launch CondoWorks login page on chronium
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('https://app-dev.condoworks.co/');
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  // Login with username and password
  await page.type('input[name="Email"]', info.USERNAME);
  await page.type('input[name="Password"]', info.PASSWORD);
  await page.click('#btnSubmit');

  // Navigate to Invoices -> All
  await page.waitForSelector(invoiceDropdown);
  await page.click(invoiceDropdown);
  await page.click(invoiceDropdown + '> div > a:nth-child(1)');

  // Enter invoice # search into the Invoice # field
  await page.waitForSelector(`a[title="View/Edit"]`);
  await page.type('input[name="invoices.InvoiceNumber"]', info.INVOICE_SEARCH);

  // Find and click the magnifying glass in the invoice row with # info.INVOICE_NUM
  const numField = await page.$(`td[title="${info.INVOICE_NUM}"]`);
  const invoiceRow = await numField.getProperty('parentNode');
  const magGlass = await invoiceRow.$('td[data-label=" "] > a > button > i');

  if (magGlass) {
    await magGlass.click();
  }

  // Wait for page to load and set download configurations
  await page.waitForNavigation();
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  // Download pdf and shortly wait to allow download to finish
  const downloadButton = await page.$('a[title="Download file"]');
  await downloadButton.click();
  await page.waitForTimeout(5000);

  // Find name of downloaded file and output file path
  const downloadName = await page.evaluate((obj) => {
    return obj.getAttribute('download');
  }, downloadButton);
  console.log(downloadPath + `/${downloadName}.pdf`);

  // Close Browser and end processes
  browser.close();
}

// Call web scraper
ScrapeInvoice();
