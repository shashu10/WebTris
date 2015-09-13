var Piece = (function() {

	function Piece() {
		this.origin = {row:0,col:0};
		this.rotation = 0;
		var types = ["I","I","I","I","I","I","I","I","O","O","O","O","O","O","O","O","L","L","L","L","L","L","L","L","J","J","J","J","J","J","J","J","T","T","T","T","T","T","T","T","Z","Z","Z","Z","Z","Z","Z","Z","S","S","S","S","S","S","S","S",];
		this.shapes = this.createShape(types[Math.floor(Math.random() * types.length)]);
	}
	Piece.prototype.createShape = function(type) {
		switch(type) {

			case "I":
				this.color = { // Light Blue
					fill:"rgb(56,209,255)",
					stroke:"rgb(58,191,247)"
				};
				return [
					[{row:0,col:1},{row:1,col:1},{row:2,col:1},{row:3,col:1}],
					[{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3}],
					[{row:0,col:1},{row:1,col:1},{row:2,col:1},{row:3,col:1}], // Repeat
					[{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3}], // Repeat
				];

			case "O":
				this.color = { // Mustard Yelloe
					fill:"rgb(255,191,35)",
					stroke:"rgb(225,155,0)"
				};
				return [
					[{row:1,col:1},{row:2,col:2},{row:1,col:2},{row:2,col:1}],
					[{row:1,col:1},{row:2,col:2},{row:1,col:2},{row:2,col:1}], // Repeat
					[{row:1,col:1},{row:2,col:2},{row:1,col:2},{row:2,col:1}], // Repeat
					[{row:1,col:1},{row:2,col:2},{row:1,col:2},{row:2,col:1}], // Repeat
				];

			case "L":
				this.color = { // Orange
					fill:"rgb(255,135,44)",
					stroke:"rgb(224,90,24)"
				};
				return [
					[{row:0,col:1},{row:1,col:1},{row:2,col:1},{row:2,col:2}],
					[{row:2,col:0},{row:2,col:1},{row:2,col:2},{row:1,col:2}],
					[{row:0,col:2},{row:1,col:2},{row:2,col:2},{row:0,col:1}],
					[{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:2,col:0}],
				];

			case "J":
				this.color = { // Dark Blue
					fill:"rgb(38,100,228)",
					stroke:"rgb(33,66,199)"
				};
				return [
					[{row:0,col:1},{row:1,col:1},{row:2,col:1},{row:2,col:0}],
					[{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:2,col:2}],
					[{row:0,col:1},{row:1,col:1},{row:2,col:1},{row:0,col:2}],
					[{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:0,col:0}],
				];

			case "T":
				this.color = { // Purple
					fill:"rgb(203,44,172)",
					stroke:"rgb(178,38,138)"
				};
				return [
					[{row:1,col:0},{row:1,col:1},{row:2,col:1},{row:0,col:1}],
					[{row:0,col:1},{row:1,col:1},{row:1,col:2},{row:1,col:0}],
					[{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:2,col:1}],
					[{row:0,col:1},{row:1,col:1},{row:2,col:1},{row:1,col:2}],
				];

			case "Z":
				this.color = { // Red
					fill:"rgb(250,40,65)",
					stroke:"rgb(215,15,55)"
				};
				return [
					[{row:0,col:0},{row:0,col:1},{row:1,col:1},{row:1,col:2}],
					[{row:0,col:2},{row:1,col:1},{row:1,col:2},{row:2,col:1}],
					[{row:0,col:0},{row:0,col:1},{row:1,col:1},{row:1,col:2}], // Repeat
					[{row:0,col:2},{row:1,col:1},{row:1,col:2},{row:2,col:1}], // Repeat
				];

			case "S":
				this.color = { // Green
					fill:"rgb(105,205,15)",
					stroke:"rgb(88,178,0)"
				};
				return [
					[{row:1,col:0},{row:1,col:1},{row:0,col:1},{row:0,col:2}],
					[{row:1,col:2},{row:0,col:1},{row:1,col:1},{row:2,col:2}],
					[{row:1,col:0},{row:1,col:1},{row:0,col:1},{row:0,col:2}], // Repeat
					[{row:1,col:2},{row:0,col:1},{row:1,col:1},{row:2,col:2}], // Repeat
				];

			default:
		}
	};
	Piece.prototype.rotate = function(direction) {
		this.rotation += direction;
		if (this.rotation < 0)
			this.rotation = 3;
		this.rotation = this.rotation % 4;
	};
	Piece.prototype.eachBlock = function(callback) {
		var grid = this.shapes[this.rotation];
		for (var i = 0; i < grid.length; i++) {
			callback(this.origin.col + grid[i].col, this.origin.row + grid[i].row);
		}
	};

	return Piece;

})();