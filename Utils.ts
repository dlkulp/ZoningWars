import {webcrypto} from "crypto";

// Store elements in 1d array
export function store2Din1D(arr: any[], x: number, y: number, totalCol: number, val: any) {
	let k = x * totalCol + y;
	arr[k] = val;
}

export function get1DFrom2D(arr: any[], x: number, y: number, totalCol: number) {
	return arr[x * totalCol + y];
}

// Get a random number excluding the upper bound
export function getRandom(max: number, min: number = 0) {
	return getRandomInt(min, max-1);
}
// Get a random number including the upper bound
// https://stackoverflow.com/a/18230432/2525751
function getRandomInt(min: number, max: number): number {       
	// Create byte array and fill with 1 random number
	var byteArray = new Uint8Array(1);
	webcrypto.getRandomValues(byteArray);

	var range = max - min + 1;
	var max_range = 256;
	if (byteArray[0] >= Math.floor(max_range / range) * range)
		return getRandomInt(min, max);
	return min + (byteArray[0] % range);
}

export function get<T>(selector:string) {
	return <T>document.querySelector(selector);
}