/**
 * @typedef {Object} Parsed
 * @prop {string} headline
 * @prop {Object<string, string[]>} typedefs
 * @prop {{text: string[], type: string}[]} types
 */
/**
 * @param {string} raw 
 * @return {Parsed}
 */
export function parse(raw) {
	const [headline, ...sections] = raw
		.toString()
		.split(/\n\n+/g);

	return {
		headline,
		typedefs: Object.fromEntries(sections
			.filter(_ => _.startsWith('# @typedef '))
			.map(_ => [
				_.split('\n')[0].substring('# @typedef '.length).trim(),
				_.split('\n').slice(1).map(_ => _.replace(/([A-G])(b|n|v)?(\s|$)/g, '$1$2/4$3'))
			])),
		types: sections
			.filter(_ => _.startsWith('# @type '))
			.map(_ => ({
				type: _.split('\n')[0].substring('# @type '.length).trim(),
				text: _.split('\n').slice(1).map(_ => _.replace(/ /g, ','))
			}))
	};
};