import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const URL = 'http://localhost:5180/emoemo/';
const OUTPUT_DIR = '/tmp/emoji_samples';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const patterns = [
  { name: '01_おはよう_黄_ゴシック',    text: 'おは\nよう', colorLabel: '黄',       fontLabel: 'ゴシック' },
  { name: '02_おつかれ_ピンク_丸',      text: 'おつ\nかれ', colorLabel: 'ピンク',   fontLabel: '丸ゴシック' },
  { name: '03_よさそう_緑_ゴシック',    text: 'よさ\nそう', colorLabel: '緑',       fontLabel: 'ゴシック' },
  { name: '04_ええやん_青_モダン',      text: 'ええ\nやん', colorLabel: '青',       fontLabel: 'モダン' },
  { name: '05_lgtm_紫_ポップ',          text: 'lgtm',     colorLabel: '紫',       fontLabel: 'ポップ' },
  { name: '06_草_緑_明朝',              text: '草',       colorLabel: '緑',       fontLabel: '明朝体' },
  { name: '07_www_水色_手書き',          text: 'www',      colorLabel: '水色',     fontLabel: '手書き' },
  { name: '08_最高_赤_ポップ',          text: '最高',     colorLabel: '赤',       fontLabel: 'ポップ' },
  { name: '09_すごい_オレンジ_丸',      text: 'すご\nい',   colorLabel: 'オレンジ', fontLabel: '丸ゴシック' },
  { name: '10_了解_黒_明朝',            text: '了解',     colorLabel: '黒',       fontLabel: '明朝体' },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  acceptDownloads: true,
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();

for (const p of patterns) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // テキスト入力
  await page.fill('textarea', p.text);

  // 色選択（title属性で）
  await page.click(`button[title="${p.colorLabel}"]`);

  // フォント選択（font label テキストで探す）
  await page.click(`button:has-text("${p.fontLabel}")`);

  await page.waitForTimeout(800); // Canvas 再描画待ち

  // ダウンロード
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("ダウンロード")'),
  ]);
  const outPath = path.join(OUTPUT_DIR, `${p.name}.png`);
  await download.saveAs(outPath);
  console.log(`Saved: ${p.name}`);
}

await browser.close();
console.log(`\nDone. Output: ${OUTPUT_DIR}`);
