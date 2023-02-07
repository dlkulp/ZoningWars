import {Schema, type} from "@colyseus/schema";
import { Cards } from "./Types";
import { getRandom } from "../../Utils";

export class Deck extends Schema {
	@type(["number"])
	private drawPile: Cards[];

	@type(["number"])
	discard: Cards[];

	private ratios = {
		[Cards.House]: 14,
		[Cards.Apartment]: 14,
		[Cards.Store]: 12,
		[Cards.Factory]: 12,
		[Cards.University]: 4,
		[Cards.Park]: 10,
		[Cards.Airport]: 6,
		[Cards.MovieTheater]: 8,
		[Cards.Landfill]: 10,
		[Cards.WaterTreatmentPlant]: 4,
		[Cards.Stadium]: 4,
		[Cards.Bank]: 4
	}

	getHand(numCards: number = 1): Cards[] {
		if (this.drawPile.length > numCards)
			return this.drawPile.splice(0, numCards);
		if (this.drawPile.length < numCards && this.discard.length) {
			this.drawPile.push(...this.discard);
			return this.getHand(numCards);
		}
		if (this.drawPile.length < numCards && this.discard.length == 0)
			return this.getHand(this.drawPile.length);
		return [];
	}

	// from https://stackoverflow.com/a/2450976/2525751
	shuffle(array: any[]) {
		let currentIndex = array.length,  randomIndex;
	  
		// While there remain elements to shuffle.
		while (currentIndex != 0) {
	  
		  // Pick a remaining element.
		  randomIndex = Math.floor(getRandom(currentIndex));
		  currentIndex--;
	  
		  // And swap it with the current element.
		  [array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
		}
	  
		return array;
	}

	constructor() {
		super();
		this.drawPile = [];
		for(let [key, value] of Object.entries(this.ratios))
			this.drawPile.push(...(new Array(value).fill(Number(key))));
		this.drawPile = this.shuffle(this.drawPile);

		this.discard = [this.drawPile.pop()];
	}
}