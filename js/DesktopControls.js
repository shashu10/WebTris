var DesktopControls = (function() {

	function DesktopControls(ge) {
		this.gameEngine = ge;
		this.listenForMoves();
	}
	DesktopControls.prototype.listenForMoves = function() {
		var ge = this.gameEngine;
		$(document).keydown(function(e) {
			if (!ge.piece || (isPaused && e.which != 32))
				return;

			var didMoveDown = false;
			var didMove = false;
			switch(e.which) {
				case 37: // left
				didMove = ge.movePiece({row:0, col:-1});
				break;

				case 39: // right
				didMove = ge.movePiece({row:0, col:1});
				break;

				case 40: // down
				didMove = ge.movePiece({row:1, col:0});
				didMoveDown = true;
				break;

				case 88: // rotate right "x"
				didMove = ge.rotate(1);
				break;

				case 90: // rotate left "z"
				didMove = ge.rotate(-1);
				break;

				case 32: // Space Bar - Pause
				ge.play_pause();
				break;

				case 13: // Enter - Drop Piece
				ge.dropPiece();
				break;

				default:
				return;
			}
			if (didMove && didMoveDown) {
				ge.resetTimer();
			}
			ge.drawBoard();
			e.preventDefault(); // prevent the default action (scroll / move caret)
		});
	};
	return DesktopControls;
})();