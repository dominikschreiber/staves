import {zip} from './util.js';

/**
 * <p>converts a parsed .staves file like</p>
 * <pre>{
 *   headline: <String>,
 *   notes: [<String>, ...],
 *   texts: [[<String>, ...], ...]
 * }</pre>
 * <p>into a list of .vextab files, e.g.</p>
 * <pre>[
 *   '<options>\n\n<headline>\n<notes-line>\n<text-line>\n\n...',
 *   ...
 * ]</pre>
 * <p>where each .vextab file fits on a single page
 * defined by --width and --height command-line
 * arguments and each entry in the parsed .staves
 * texts creates a new page</p>
 * @param {import('./parse.js').Parsed} parsed
 * @param {number} stavesPerPage
 * @return {string[]}
 */
export function toVextabs(parsed, stavesPerPage) {
	return parsed.types
		// => [<text>, ...]
		.map(({text, type}) =>
			// => [<notes>, ...]
			zip(parsed.typedefs[type], text)
			// => [[<notes>, <text>], ...]
			.map(createTabstave(parsed.headline))
			// => [<headline>\n<notes-line>\n<text-line>, ...]
			.reduce(createSubArrays(stavesPerPage), [[]])
			// => [[<headline>\n<notes-line>\n<text-line> x stavesPerPage], ...]
			.map(vextabs => vextabs.join('\n\n'))
		)
		// => [[<headline>\n<notes-line>\n<text-line>\n\n x stavesPerPage, ...], ...]
		.flat()
		// => [<headline>\n<notes-line>\n<text-line>\n\n x stavesPerPage, ...]
		.map(createPage);
		// => [<options>\n\n<headline>\n<notes-line>\n<text-line>\n\n..., ...]
};

/**
 * @param {string} tabstaves 
 * @return {string}
 */
function createPage(tabstaves) {
	return 'options space=0 stave-distance=40\n\n' + tabstaves;
}

/**
 * @template T
 * @param {number} length 
 * @return {function(T[][], T): T[][]}
 */
function createSubArrays(length) {
	return function(prev, now) {
		if (prev[prev.length - 1].length < length) {
			prev[prev.length - 1].push(now);
		} else {
			prev.push([now]);
		}
		return prev;
	};
}

/**
 * @param {string} headline 
 * @return {function([string, string]): string}
 */
function createTabstave(headline) {
	return function([notes, text]) {
		return [
			headline,
			convertNotesLine(notes),
			convertTextLine(text)
		].join('\n');
	};
}

/**
 * @param {string} notes 
 * @return {string}
 */
function convertNotesLine(notes) {
	return 'notes ' + notes;
}

/**
 * @param {string} text 
 * @return {string}
 */
function convertTextLine(text) {
	return 'text ++,.11,.font=Arial-14-normal,' + text;
}