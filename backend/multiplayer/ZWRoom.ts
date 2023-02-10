import { Room, Client } from "colyseus";
import { get1DFrom2D, store2Din1D } from "../../Utils";
import { GameState } from "./GameState";
import { Player } from "./Player";
import { Cards, Errors } from "./Types";

export class ZWRoom extends Room {
  onCreate (_options: any) {
	this.maxClients = 2;
    this.setState(new GameState());
	this.onMessage("placeCard", (_client, message: {x: number, y: number, selectedCard: number}) => {
		let turnComplete = true;
		let currPlayer = this.state.turn.player;
		if (get1DFrom2D(this.state.board.values, message.x, message.y, this.state.board.cols) == Cards.Empty) {
			this.state.turn.error = "";
			store2Din1D(this.state.board.values, message.x, message.y, this.state.board.cols, currPlayer.hand[message.selectedCard]);
			currPlayer.hand.splice(message.selectedCard, 1);
			currPlayer.hand.push(...this.state.deck.getHand(1));
		}
		else {
			this.state.turn.error = Errors.NotEmpty;
			turnComplete = false;
		}
		
		if (turnComplete) {
			let nextPlayer = this.state.players.filter((x: Player) => x.id != currPlayer.id)[0];
			console.log(nextPlayer.id)
			this.state.turn.nextTurn(nextPlayer);
		}
	});
	this.onMessage("discard", (_client, message: {selectedCard: number}) => {
		let currPlayer = this.state.turn.player;
		// Remove card from players hand and put on the discard pile
		this.state.deck.discard.push(currPlayer.hand[message.selectedCard]);
		currPlayer.hand.splice(message.selectedCard, 1);

		// Draw new card
		currPlayer.hand.push(...this.state.deck.getHand(1));

		// Set up next turn
		let nextPlayer = this.state.players.filter((x: Player) => x.id != currPlayer.id)[0];
		this.state.turn.nextTurn(nextPlayer);
	});
  }

  onJoin (client: Client, _options: any) {
	let playerHand = this.state.deck.getHand(7);
	let player = new Player(playerHand, client.id);
	this.state.players.push(player);
	if (!this.state.turn.player)
		this.state.turn.player = player;
  }

  async onLeave (client: Client, consented: boolean) {
	let playerIndex = this.state.players.findIndex((x: Player) => x.id = client.id);
	let currPlayer = this.state.players[playerIndex];
	currPlayer.connected = false;
	// try {
	// 	if (consented) throw new Error("consented leave");
	// 	await this.allowReconnection(client, 60);
	// 	currPlayer.connected = true;
	// }
	// catch (e) {
		this.state.deck.discard.push(...currPlayer.hand);
		this.state.players.splice(playerIndex, 1);
	//}
  }

  onDispose() {
  }
}