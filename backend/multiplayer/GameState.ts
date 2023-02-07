import {Schema, type} from "@colyseus/schema";
import {Board} from "./Board";
import { Deck } from "./Deck";
import { Player } from "./Player";
import { Turn } from "./Turn";

export class GameState extends Schema {
	@type(Board)
	board: Board;

	@type([Player])
	players: Player[];

	@type(Turn)
	turn: Turn;
	
	@type(Deck)
	deck: Deck;

	constructor() {
		super();
		this.board = new Board(8, 8);
		this.deck = new Deck();
		this.players = [];
		this.turn = new Turn();
	}
}