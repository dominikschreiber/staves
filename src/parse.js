/**
 * @typedef {Object} Parsed
 * @prop {string} headline
 * @prop {string[]} notes
 * @prop {string[][]} texts
 */
/**
 * @param {string} raw 
 * @return {Parsed}
 */
export function parse(raw) {
	const split = raw
		.toString()
		.replace(/(^|\n)#[^\n]*(\n|$)/g, '$1') // remove # comments
		.split(/\n\n+/g);

	return {
		headline: split[0],
		notes: split[1]
			.replace(/([A-G])(b|n|v)?(\s|$)/g, '$1$2/4$3')
			.split('\n'),
		texts: split.slice(2).map(verse => verse
			.replace(/ /g, ',')
			.split('\n'))
	};
};