import {readFile} from 'node:fs/promises';
import {parse} from './parse.js';
import {toPdf} from './toPdf.js';
import {toVextabs} from './toVextabs.js';

function stavesPerPage(width, height) {
	// 3.9 is empirically found
	return Math.round(3.9 / (width / height));
}

export default async function({
	I: infile,
	O: outfile = infile.substring(infile.lastIndexOf('/') + 1).replace('.staves', '.pdf'),
	W: width,
	H: height,
	S: shouldUseSvg
}) {
	return toPdf(
		toVextabs(
			parse(await readFile(infile, 'utf-8')),
			stavesPerPage(width, height)
		),
		outfile,
		shouldUseSvg,
		width,
		height
	);
};