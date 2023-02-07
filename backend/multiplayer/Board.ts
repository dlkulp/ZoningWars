import {ArraySchema, Schema, type} from "@colyseus/schema";
import {Cards} from "./Types";

export class Board extends Schema {
	@type(["number"])
    values: Cards[];

    @type("number")
    rows: number;

    @type("number")
    cols: number;

    constructor(rows: number, cols: number) {
        super();
        this.rows = rows;
        this.cols = cols;
		this.values = new ArraySchema<Cards>(...(new Array(cols * rows).fill(Cards.Empty)));
    }
}