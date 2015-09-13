var GameEngine = (function() {

	function GameEngine() { // add type later
		this.listenForActions();
		this.listenForSettings();
		this.newGame();
	}
	GameEngine.prototype.newGame = function() {
		this.isFinished = false;
		this.score = 0;
		this.newBoard();
		this.piece = null;
		this.nextPiece = null;
		this.resetTimer();
	};
	GameEngine.prototype.resetTimer = function() {
		var that = this;
		window.clearInterval(timer);
		timer = window.setInterval(function() {
			if (!that.piece || that.pieceDidLand()) {
				that.getNextPiece();
				that.clearRows();
				if (!that.canAddPiece()) {
					that.piece = null;
					window.clearInterval(timer);
					alert("You lose :(");
					this.isFinished = true;
					return;
				}
				that.addPiece();
			}

			var didMove = that.movePiece({row:1, col:0});
			if (!didMove) {
				that.getNextPiece();
				that.addPiece();
			}
			if (that.drawBoard)
				that.drawBoard();
		}, 750);
	};
	GameEngine.prototype.listenForSettings = function() {
		var that = this;
		$("#num_cols").val(WIDTH);
		$("#num_rows").val(HEIGHT);
		$("#num_cols").change(function() {
			if ($(this).val() > $(this).attr('max'))
				$(this).val($(this).attr('max'));
			else if ($(this).val() < $(this).attr('min'))
				$(this).val($(this).attr('min'));
			else
				NEW_WIDTH = $(this).val();
		});
		$("#num_rows").change(function() {
			if ($(this).val() > $(this).attr('max'))
				$(this).val($(this).attr('max'));
			else if ($(this).val() < $(this).attr('min'))
				$(this).val($(this).attr('min'));
			else
				NEW_HEIGHT = $(this).val();
		});
	};
	GameEngine.prototype.listenForActions = function() {
		var that = this;
		$("#play_pause").click(function(e) {
			that.play_pause();
		});
		$("#restart").click(function(e) {
			that.newGame();
		});
	};
	GameEngine.prototype.newBoard = function() {
		var board = document.getElementById('board');
		board.width = WIDTH * PIECE_WIDTH;
		board.height = HEIGHT * PIECE_WIDTH;

		var next = document.getElementById('next');
		next.width = PIECE_SIZE * PIECE_WIDTH;
		next.height = PIECE_SIZE * PIECE_WIDTH;

		this.board = new Array(WIDTH);
		for (var col = 0; col < WIDTH; col++) {
			this.board[col] = new Array(HEIGHT);
			for (var row = 0; row < HEIGHT; row++) {
				this.board[col][row] = false;
			}
		}
	};
	GameEngine.prototype.play_pause = function() {
		
		if (isPaused) { // Play
			if (NEW_WIDTH != WIDTH || NEW_HEIGHT != HEIGHT) {
				WIDTH = NEW_WIDTH;
				HEIGHT = NEW_HEIGHT;
				this.newGame();
			}
			if (this.isFinished) {
				this.newGame();	
			}

			this.resetTimer();
			isPaused = false;
			$("#instructions").addClass("hidden");
			$("#play_pause").removeClass("play");
			$("#play_pause").addClass("pause");

		} else { // Pause

			window.clearInterval(timer);
			timer = null;
			isPaused = true;
			$("#instructions").removeClass("hidden");
			$("#play_pause").removeClass("pause");
			$("#play_pause").addClass("play");
		}
	};
	GameEngine.prototype.eachCol = function(callback) {
		for (var col = 0; col < WIDTH; col++) {
			callback(col);
		}
	};
	GameEngine.prototype.eachRow = function(callback) {
		for (var row = 0; row < HEIGHT; row++) {
			callback(row);
		}
	};
	GameEngine.prototype.eachBlock = function(callback) {
		var that = this;
		that.eachRow(function (row) {
			for (var col = 0; col < WIDTH; col++) {
				callback(row, col, that.board[col][row]);
			}
		});
	};
	GameEngine.prototype.getNextPiece = function() {
		this.piece = this.nextPiece || new Piece();
		this.piece.origin.col = WIDTH/2 - PIECE_SIZE/2;

		this.nextPiece = new Piece();

		if (this.drawNext)
			this.drawNext();
	};
	GameEngine.prototype.canAddPiece = function() {
		var that = this;
		var isLegalMove = true;
		that.piece.eachBlock(function (col, row) {
			if (that.board[col] === undefined || that.board[col][row] === undefined || that.board[col][row] !== false)
				isLegalMove = false;
		});
		return isLegalMove;
	};
	GameEngine.prototype.addPiece = function() {
		var that = this;
		that.piece.eachBlock(function (col, row) {
			that.board[col][row] = that.piece.color;
		});
	};
	GameEngine.prototype.removePiece = function() {
		var that = this;
		that.piece.eachBlock(function (col, row) {
			if (that.board[col] !== undefined && that.board[col][row] !== undefined)
				that.board[col][row] = false;
		});
	};
	GameEngine.prototype.movePiece = function(direction) {
		var didMove = true;
		this.removePiece();

		this.undo = {
			row:this.piece.origin.row,
			col:this.piece.origin.col
		};
		this.piece.origin.row += direction.row;
		this.piece.origin.col += direction.col;

		if (!this.canAddPiece()) {
			this.piece.origin = this.undo;
			didMove = false;
		}
		this.addPiece();
		return didMove;
	};
	GameEngine.prototype.dropPiece = function() {
		var didMove = true;
		while (didMove) {
			didMove = this.movePiece({row:1, col:0});
		}
	};
	GameEngine.prototype.rotate = function(direction) {
		var didMove = true;
		this.removePiece();
		this.piece.rotate(direction);

		if (!this.canAddPiece()) {
			this.piece.rotate(-direction);
			didMove = false;
		}
		this.addPiece();
		return didMove;
	};
	GameEngine.prototype.pieceDidLand = function() {
		var didLand = false;
		this.removePiece();
		// Drop piece
		tempUndo = {
			row:this.piece.origin.row,
			col:this.piece.origin.col
		};
		this.piece.origin.row++;

		if (!this.canAddPiece()) {
			didLand = true;
		}
		this.piece.origin = tempUndo;
		this.addPiece();
		return didLand;
	};

	//	-	-	-	//
	// CONTROLLER	//
	//	-	-	-	//

	GameEngine.prototype.drawBoard = function() {
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
	GameEngine.prototype.drawNext = function() {
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
	GameEngine.prototype.clearRows = function() {
		var that = this;
		var canvas = document.getElementById('board');
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');

			that.eachRow(function (row) {
				var count = 0;
				that.eachCol(function (col) {
					var block = that.board[col][row];
					if (block)
						count++;
				});
				if (count === WIDTH) {
					that.eachCol(function (col) {
			 			that.board[col][row] = false;
					});
					that.shiftRowsAbove(row);
					that.score++;
				}
			});
		}
	};
	GameEngine.prototype.shiftRowsAbove = function(row) {
		var that = this;
		if (row === -1) return;
		that.eachCol(function (col) {
			that.board[col][row] = (row === 0) ? false : that.board[col][row - 1];
		});
		that.shiftRowsAbove(row - 1);
	};
	GameEngine.prototype.updateScore = function() {
		$("#score").html(this.score);
	};

	return GameEngine;
})();