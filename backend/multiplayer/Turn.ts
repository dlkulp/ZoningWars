import {Schema, type} from "@colyseus/schema";
import { Player } from "./Player";

export class Turn extends Schema {
	@type(Player)
	player: Player;

	@type("number")
	numTurns: number;

	nextTurn(player: Player) {
		this.player = player;
		this.numTurns++;
	}

	constructor() {
		super();
		this.numTurns = 0;
	}
}