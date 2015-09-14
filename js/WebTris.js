var WIDTH = 10;
var HEIGHT = 20;
var NEW_WIDTH = 10;
var NEW_HEIGHT = 20;

var PIECE_SIZE = 4;
var PIECE_WIDTH = 20;
var timer;
var isPaused = false;

var WebTris = (function() {

	function WebTris() {
		// Add a different controls for hybrid apps
		new DesktopControls(new GameEngine());
	}
	
	return WebTris;
})();