import { Board } from "../backend/multiplayer/Board";
import { Client, Room } from "colyseus.js";
import { GameState } from "../backend/multiplayer/GameState";
import { get, get1DFrom2D } from "../Utils";
import { Cards } from "../backend/multiplayer/Types";

const TILE_SIZE = 32;

class Game {
	client: Client;
	id: any;
	room: Room<GameState>;
	selectedCard: number | undefined;
	getBoard() {return get<HTMLDivElement>("#gameBoard")}
	getHand() {return get<HTMLDivElement>("#playerHand")}
	// https://zaje.me/javascript-remove-an-anonymous-event-listener
	turnController: AbortController;
	constructor() {
		this.client = new Client(process.env.ZONINGWARS_SERVER || "ws://localhost:2567");
		this.joinOrCreate();
	}
	async joinOrCreate() {
		try {
			this.room = await this.client.joinOrCreate<GameState>("ZoningWars", {/* options */});
			this.id = this.room.sessionId;
			this.room.onStateChange((newState: GameState) => {
				// Clear any event listeners
				this.turnController?.abort();
				get<HTMLDivElement>("#playerNumber").innerHTML = `${newState.players.findIndex(x => x.id == this.id) + 1}. ${newState.turn.player.id == this.id ? "It is your turn." : ""}`;
				// Reset game board
				this.clearGame();
				// Redraw board and hand
				this.drawBoard(newState.board);
				this.drawHand(newState.players.filter(x => x.id == this.id)[0].hand);
				// Set up click listeners if it's the player's turn
				if (newState.turn.player.id == this.id) {
					this.turnController = new AbortController();
					this.getBoard().addEventListener("click", e => this.placeCard(e), { signal: this.turnController.signal });
					this.getHand().addEventListener("click", e => this.selectCard(e), { signal: this.turnController.signal });
				}
			});
			console.log("joined successfully", this.room);
		  
		  } catch (e) {
			console.error("join error", e);
		  }
	}

	clearGame() {
		this.getBoard().innerHTML = "";
		this.getHand().innerHTML = ""
	}

	drawBoard(board: Board) {
		const boardElement = this.getBoard();
		//const elementRect = boardElement.getBoundingClientRect();
		//const blockHeight = Math.floor((elementRect.height - 32) / board.rows);
		//console.log(blockHeight)
		boardElement.style.gridTemplateColumns = `repeat(${board.cols}, ${TILE_SIZE}px)`;//${blockHeight}px)`;
		boardElement.style.gridTemplateRows = `repeat(${board.rows}, ${TILE_SIZE}px)`;//${blockHeight}px)`;
		boardElement.style.height = "fit-content";
		boardElement.style.width = "fit-content";
	
		const boardPosition = (row: number, col: number) => get1DFrom2D(board.values, row, col, board.cols);
	
		for (let col = 0; col < board.cols; ++col) {
			for (let row = 0; row < board.rows; ++row) {
				const cellDiv = document.createElement("div");
				cellDiv.id = `cell-r${row}-c${col}`;
				let type = boardPosition(row, col);
				if (type != 0) console.log(type);
				let color = `${type}${type}${type}`;
				cellDiv.style.background = `#${color}`;
				boardElement.append(cellDiv);
			}
		}
	}

	drawHand(cards: Cards[]) {
		const handElement = this.getHand();
		handElement.style.height = "fit-content";
		handElement.style.width = "fit-content";

		for (let [index, card] of cards.entries()) {
			const cellDiv = document.createElement("div");
			cellDiv.id = `card-${index}`;
			cellDiv.style.background = `#${card}${card}${card}`;
			handElement.append(cellDiv);
		}
	}

	selectCard(event: MouseEvent) {
		// Get index of selected card and highlight the card
		let [mx, el] = [event.clientX, this.getHand().getBoundingClientRect()];
		this.selectedCard = Math.floor((mx - el.left) / (TILE_SIZE + 2));
		(event.target as HTMLDivElement).style.border = "1px solid white";
	}

	placeCard(event: MouseEvent) {
		// Get coordinates of selected tile and send the event to the server
		let [mx, my, el] = [event.clientX, event.clientY, this.getBoard().getBoundingClientRect()];
		let [x,y] = [Math.floor((mx - el.left) / (TILE_SIZE + 2)), Math.floor((my - el.top) / (TILE_SIZE + 2))];
		this.room.send("placeCard", {y, x, selectedCard: this.selectedCard});
	}
}

document.addEventListener("DOMContentLoaded", () => new Game());