import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer';

/**
 * @param {string[]} vextabs 
 * @param {string} [outfile='out.pdf'] 
 * @param {boolean} [shouldUseSvg=false] 
 * @param {number} [width=1024]
 * @param {number} [height=800]
 * @return {Promise<void>}
 */
export async function toPdf(vextabs, outfile='out.pdf', shouldUseSvg=false, width=1024, height=800) {
	const scripts = await Promise.all((shouldUseSvg ? [
		readFile(fileURLToPath(import.meta.resolve('raphael/raphael-min.js')), 'utf-8')
	] : []).concat([
		readFile(fileURLToPath(import.meta.resolve('vextab/releases/vextab-div.js')), 'utf-8')
	]));

	const browser = await puppeteer.launch({headless: 'new'});
	let i = 1;
	for (const vextab of vextabs) {
		const filename = outfile.replace('.pdf', `-${String(i++).padStart(2, '0')}.pdf`);
		const page = await browser.newPage();
		await page.setContent(createHtmlForVextab(vextab, width, scripts));
		await writeFile(filename, await page.pdf({height, width}));
		await page.close();
	}
	await browser.close();
};

/**
 * @param {string} vextab 
 * @param {string[]} scripts 
 * @return {string}
 */
function createHtmlForVextab(vextab, width, scripts = []) {
	return `<!doctype html>
<html>
	<head>
		<style>body{height:100vh;margin:0;display:flex;align-items:center;justify-content:center}</style>
		${scripts.filter(Boolean).map(_ => `<script>${_}</script>`).join('\n\t\t')}
	</head>
	<body>
		<div class="vex-tabdiv" width=${width-32} scale=1.0 editor=false>${vextab}</div>
	</body>
</html>`;
}