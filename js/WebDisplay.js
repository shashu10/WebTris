var WebDisplay = (function() {

	function WebDisplay(ge) {
		
		// Functions will be called inside GameEngine not in WebDisplay
		ge.drawBoard = this.drawBoard;
		ge.drawNext = this.drawNext;
		ge.color = { // Dark Gray
			fill:"rgb(34,34,34)",
			stroke:"rgb(6,6,6)"
		};
	}
	WebDisplay.prototype.drawBoard = function() {
		var that = this;
		var canvas = document.getElementById('board');
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			that.eachBlock(function (row, col, block) {
				var x = (col * PIECE_WIDTH);
				var y = (row * PIECE_WIDTH);
				if (block) {
					ctx.strokeStyle = block.stroke;
					ctx.strokeRect(x,y,PIECE_WIDTH,PIECE_WIDTH);
					ctx.fillStyle = block.fill;
					ctx.fillRect(x,y,PIECE_WIDTH,PIECE_WIDTH);
				} else {
					ctx.strokeStyle = that.color.stroke;
					ctx.strokeRect(x,y,PIECE_WIDTH,PIECE_WIDTH);
					ctx.fillStyle = that.color.fill;
					ctx.fillRect(x,y,PIECE_WIDTH,PIECE_WIDTH);
				}
			});
			that.updateScore();
		}
	};

	WebDisplay.prototype.drawNext = function() {
		var that = this;
		var canvas = document.getElementById('next');
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');

			// Clear next piece background
			for (var row = 0; row < PIECE_SIZE; row++) {
				for (var col = 0; col < PIECE_SIZE; col++) {

					var x = (col * PIECE_WIDTH);
					var y = (row * PIECE_WIDTH);

					ctx.clearRect(x,y,PIECE_WIDTH,PIECE_WIDTH);
				}
			}

			// Show next piece
			that.nextPiece.eachBlock(function (col, row) {

				var x = (col * PIECE_WIDTH);
				var y = (row * PIECE_WIDTH);	

				ctx.strokeStyle = that.nextPiece.color.stroke;
				ctx.strokeRect(x,y,PIECE_WIDTH,PIECE_WIDTH);
				ctx.fillStyle = that.nextPiece.color.fill;
				ctx.fillRect(x,y,PIECE_WIDTH,PIECE_WIDTH);
			});
		}
	};
	return WebDisplay;
})();