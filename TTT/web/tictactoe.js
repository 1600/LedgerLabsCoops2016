var contractAddress = ""; // So this obviously needs to be filled in

// Set up web3 component
if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var ttt = web3.eth.contract(ABI).at(contractAddress); // ABI needs to be a real ABI

// For creating a new game, you need an ethereum account to do this
function newGame(form) {
	var gameID = ttt.newGame.sendTransaction({from: web3.eth.accounts[0], value: form.bet.value * 10 ** 18});
}

// Adds any game you accept to your currently active games, still need an ethereum account to do this
function joinGame(gameID) {
	ttt.accept.sendTransaction(gameID, {from: web3.eth.accounts[0], value: ttt.games[gameID].bet);
	if (ttt.games[gameID].active) {
		alert("You have joined the game, now check active games to play!");
	}
}

// Lists all the active offers currently availible to call
function list() {
	window.open();
	document.write('<center>');
	document.write('<h1> Current Challenges </h1>');
	var info = ttt.getCurrentGames();
	var length = info.length;
	for (var k = 0; k < length - 1; k += 2) {
		document.write('<p> Game '+info[k]+': Call the '+info[k+1]/(10**18)+' ethers </p>');
		document.write('<input type="button" value="Accept" onClick="joinGame('+info[k]+')>');
}

// Updates the grid so that even if the page is refreshed, the buttons will be the same
function updateGrid(grid, gameID) {
	for (var i = 0; i < ttt.gridSize; ++i) {
		for (var j = 0; j < ttt.gridSize; ++j) {
			if (grid[j + ttt.gridSize * i] == 0) {
				document.write('<input type="button" id='+(j + ttt.gridSize * i)+' onClick="move(this.id, this.value, gameID)" value=" "'+'<br>');
			} else if (grid[j + ttt.gridSize * i] == 1) {
				document.write('<input type="button" id='+(j + ttt.gridSize * i)+' value="X"'+'<br>');
				// Clicking this should do nothing
			} else if (grid[j + ttt.gridSize * i] == 2) {
				document.write('<input type="button" id='+(j + ttt.gridSize * i)+' value="O"'+'<br>');
				// Clicking this should do nothing
			}
		}
		document.write('<br>');
	}
}

// Opens a new window with all of your active games
function blocks() {
	window.open();
	document.write('<center>');
	document.write('<h1> Active Games </h1>');
	var mine = ttt.getMyGames();
	var length = mine.length;
	for (var m = 0; m < length - 1; m += 2) {
		document.write('<p> Game '+mine[m]+' with '+mine[m+1]/(10**18)+' ethers at stake </p>');
		var grid = getState(mine[m]);
		updateGrid(grid, mine[m]);
	document.write('<br>');
	}
}

// Translates the button click to a move on the board in the blockchain
function move(index, value, gameID) {
	if (ttt.winner.sendTransaction(index, gameID, {from: web3.eth.accounts[0]})) {
		value = getLetter(gameID);
		if (value == 1) {
			value = "X";
		else if (value == 2) {
			value = "O";
		}
	}
}
