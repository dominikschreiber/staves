/**
 * @template T
 * @template U
 * @param {T[]} arr1 
 * @param {U[]} arr2 
 * @return {[T,U][]}
 */
export function zip(arr1, arr2) {
	return arr1.map((_, i) => [_, arr2[i]]);
}
