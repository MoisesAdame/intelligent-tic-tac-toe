let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

let players = ['X', 'O']
let currentPlayer = ''

let valueX; 
let valueY;
let turnNumber = 0;

function mouseClicked() {

	if(mouseX < width || mouseY < height){
		valueX = mouseX
    	valueY = mouseY
		
		let indexes = tileClicked(valueX, valueY)
		playGame(indexes)
	}
}

function getEmptyBoxes(someBoard) {
	let emptyBoxes = []
	for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
			if(someBoard[i][j] == ''){
				emptyBoxes.push([i, j])
			}
        }
    }

	return emptyBoxes
}

function minimax(someBoard, currentPlayer, isMyTurn, isFirst){
	let possibleMoves = getEmptyBoxes(someBoard)
	let otherPlayer = currentPlayer == 'X' ? 'O' : 'X'

	if(isFirst){
		let bestScore = -Infinity
		let bestIndex = -1
		for(let i = 0; i < possibleMoves.length; i++){
			boardCopy = JSON.parse(JSON.stringify(someBoard))
			boardCopy[possibleMoves[i][0]][possibleMoves[i][1]] = currentPlayer
			let score = minimax(boardCopy, currentPlayer, false, false)

			if(score > bestScore){
				bestScore = score
				bestIndex = i
			}
		}

		return bestIndex
	}
	
	if(checkWinner(someBoard, currentPlayer)){
		return 100
	}else if(checkWinner(someBoard, otherPlayer)){
		return -100
	}else if(possibleMoves.length == 0){
		return 0
	}else{
		let bestScore = 0
		if(isMyTurn){
			for(let i = 0; i < possibleMoves.length; i++){
				boardCopy = JSON.parse(JSON.stringify(someBoard))
				boardCopy[possibleMoves[i][0]][possibleMoves[i][1]] = currentPlayer
				
				let score = -10 + minimax(boardCopy, currentPlayer, isMyTurn, false)
				bestScore += score
			}
		}else{
			for(let i = 0; i < possibleMoves.length; i++){
				boardCopy = JSON.parse(JSON.stringify(someBoard))
				boardCopy[possibleMoves[i][0]][possibleMoves[i][1]] = otherPlayer

				let score = -10 + minimax(boardCopy, currentPlayer, true, false)
				bestScore += score
			}
		}

		return bestScore
	}
}

function aiNextMove() {
	let emptyBoxes = getEmptyBoxes(board)

	let porpoerMove = minimax(board, currentPlayer, true, true)

	return emptyBoxes[porpoerMove]
}

function playGame(indexes) {
	if(board[indexes[0]][indexes[1]] == ''){
		board[indexes[0]][indexes[1]] = currentPlayer

		if(checkWinner(board, currentPlayer) || turnNumber == 8){

			if (checkWinner(board, currentPlayer)) {
				document.getElementById('label').innerHTML = 'Winner: ' + currentPlayer + '!'
			}else{
				document.getElementById('label').innerHTML = 'Tie!'
			}

			setTimeout(() => {
				board = [
					['', '', ''],
					['', '', ''],
					['', '', '']
				]

				turnNumber = 0
				currentPlayer = players[1]

				document.getElementById('label').innerHTML = ''
			}, 5000)

			
		}else{
			currentPlayer = currentPlayer == 'X' ? 'O' : 'X'
			turnNumber += 1

			if(currentPlayer == 'X'){
				let move = aiNextMove()
				playGame(move)
			}
		}
	}
}

function checkWinner(board, currentPlayer) {
	for(let i = 0; i < 3; i++){
		if((board[i][0] == currentPlayer && board[i][1] == currentPlayer && board[i][2] == currentPlayer) ||
		   (board[0][i] == currentPlayer && board[1][i] == currentPlayer && board[2][i] == currentPlayer)) {
			return true
		}
	}

	if((board[0][0] == currentPlayer && board[1][1] == currentPlayer && board[2][2] == currentPlayer) || 
	   (board[0][2] == currentPlayer && board[1][1] == currentPlayer && board[2][0] == currentPlayer)){
		return true
	}

	return false
}

function tileClicked(xpos, ypos) {
	let w = width / 3
    let h = height / 3

	let xindex
	let yindex

	for(let i = 0; i < 3; i++){
        if(ypos > i * w && ypos < (i + 1) * w){
			yindex = i
		}
    }

	for(let i = 0; i < 3; i++){
        if(xpos > i * w && xpos < (i + 1) * w){
			xindex = i
		}
    }

	return [xindex, yindex]
}


function setup() {

	let vh = document.documentElement.clientHeight
	let vw = document.documentElement.clientWidth
	let sideSize = vh < vw ? vh * 0.6 : vw * 0.85

    createCanvas(sideSize, sideSize);
    currentPlayer = players[1]
}

function draw() {
    background(255);
    let w = width / 3;
    let h = height / 3;

	for(let i = 1; i < 3; i++){
        for(let j = 2; j < 3; j++){
			strokeWeight(10)
            line(w * i, 0, w * i, height)
			line(0, h * i, width, h * i)
        }
    }

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            textSize(50)
            textAlign(RIGHT);
            textAlign(CENTER, CENTER);
            let pos = board[i][j]
            text(pos, w * i + w/2, h * j + h/2)
        }
    }
}