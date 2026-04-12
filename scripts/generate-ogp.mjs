import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// 背景: 白
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// 背景に薄い装飾パターン（絵文字風のテキストを散りばめる）
const decorEmojis = ['😀', '😎', '🎉', '✨', '👍', '🔥', '💬', '❤️', '🚀', '⭐', '😂', '🙌', '💯', '🤔', '👋'];
ctx.font = '32px serif';
ctx.globalAlpha = 0.08;
for (let i = 0; i < 60; i++) {
  const emoji = decorEmojis[i % decorEmojis.length];
  const x = Math.random() * WIDTH;
  const y = Math.random() * HEIGHT;
  ctx.fillText(emoji, x, y);
}
ctx.globalAlpha = 1.0;

// メインテキスト: 「かんたん」
ctx.font = 'bold 72px "Helvetica Neue", Arial, sans-serif';
ctx.fillStyle = '#333333';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('かんたん', WIDTH / 2, 200);

// 「emoji」部分をカラフルに
const emojiText = 'emoji';
const emojiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
const emojiStartX = WIDTH / 2 - 160;
ctx.font = 'bold 120px "Helvetica Neue", Arial, sans-serif';
ctx.textAlign = 'left';
let currentX = emojiStartX;
for (let i = 0; i < emojiText.length; i++) {
  ctx.fillStyle = emojiColors[i];
  ctx.fillText(emojiText[i], currentX, 330);
  currentX += ctx.measureText(emojiText[i]).width;
}

// 「メーカー」
ctx.font = 'bold 72px "Helvetica Neue", Arial, sans-serif';
ctx.fillStyle = '#333333';
ctx.textAlign = 'center';
ctx.fillText('メーカー', WIDTH / 2, 440);

// サービス名「emoemo」
ctx.font = 'bold 36px "Helvetica Neue", Arial, sans-serif';
ctx.fillStyle = '#999999';
ctx.fillText('emoemo', WIDTH / 2, 540);

// 下線アクセント
const lineWidth = 120;
const gradient = ctx.createLinearGradient(
  WIDTH / 2 - lineWidth / 2, 555,
  WIDTH / 2 + lineWidth / 2, 555
);
gradient.addColorStop(0, '#FF6B6B');
gradient.addColorStop(0.5, '#4ECDC4');
gradient.addColorStop(1, '#45B7D1');
ctx.strokeStyle = gradient;
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(WIDTH / 2 - lineWidth / 2, 560);
ctx.lineTo(WIDTH / 2 + lineWidth / 2, 560);
ctx.stroke();

// 出力
const outputPath = join(__dirname, '..', 'public', 'ogp.png');
writeFileSync(outputPath, canvas.toBuffer('image/png'));
console.log(`OGP画像を生成しました: ${outputPath}`);
console.log(`サイズ: ${WIDTH}x${HEIGHT}`);
