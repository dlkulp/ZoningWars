import { Schema, type } from "@colyseus/schema";
import { Cards } from "./Types";

export class Player extends Schema {
    @type(["number"])
	hand: Cards[];

	@type("number")
	money: number;

	@type("number")
	people: number;

	@type("string")
	id: string;

	@type("boolean")
	connected: boolean;

	constructor(hand: Cards[], id: string) {
		super();
		this.id = id;
		this.hand = hand;
		this.money = 150;
		this.people = 5;
		this.connected = true;
	}
}