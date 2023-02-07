import { Room, Client } from "colyseus";
import { store2Din1D } from "../../Utils";
import { GameState } from "./GameState";
import { Player } from "./Player";

function log(lineNum: number, message: any) {
	console.log(lineNum);
	console.log(message);
}

export class ZWRoom extends Room {
  onCreate (_options: any) {
	this.maxClients = 2;
    this.setState(new GameState());
	this.onMessage("placeCard", (_client, message: {x: number, y: number, selectedCard: number}) => {
		let turnComplete = true;
		let currPlayer = this.state.turn.player;
		log(18, message.selectedCard)
		log(19, currPlayer.id);
		store2Din1D(this.state.board.values, message.x, message.y, this.state.board.cols, currPlayer.hand[message.selectedCard]);
		currPlayer.hand.splice(message.selectedCard, 1);
		currPlayer.hand.push(...this.state.deck.getHand(1));
		if (turnComplete) {
			let nextPlayer = this.state.players.filter((x: Player) => x.id != currPlayer.id)[0];
			console.log(`curr: ${currPlayer.id}`);
			console.log(`next: ${nextPlayer.id}`);
			this.state.turn.nextTurn(nextPlayer);
		}
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
	try {
		if (consented) throw new Error("consented leave");
		await this.allowReconnection(client, 60);
		currPlayer.connected = true;
	}
	catch (e) {
		this.state.deck.discard.push(...currPlayer.hand);
		this.state.players.splice(playerIndex, 1);
	}
  }

  onDispose() {
  }
}