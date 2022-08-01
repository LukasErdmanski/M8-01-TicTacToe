/* Comments according to the https://jsdoc.app/index.html */

let fields = [];
let gameOver = false;
let currentShape = 'cross';
let winner;
let amountOfTurns = 0;
let winnerInfo;

let AUDIO_SYMBOL = new Audio('audio/setSymbol.mp3');
let AUDIO_GAMEOVER = new Audio('audio/gameOver.mp3');
let currentPlayingAudio;


/**
 * Restart the game: reset the variables gaveOver, fields [].
 * Set the game over img, restart button and all symbols invisible (with d-none class).
 */
function restart() {
    document.documentElement.classList.remove('d-none')
    stopAudio();

    resetGameParameters()

    hideGameOverElements();

    resetLinesHideSymbols();
}


/**
 * Set the current playing audio on puase state and currentTime on zero.
 */
function stopAudio() {
    if (currentPlayingAudio !== undefined) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
    }
}


/**
 * Reset game variables like game over state, fulfilled game fields, winner and amount of completed turns.
 */
function resetGameParameters() {
    gameOver = false;
    fields = [];
    winner = undefined;
    amountOfTurns = 0;

}


/**
 * Hide the HTML-elements showed an the end of game like game over image, winner-info-box and restart button.
 */
function hideGameOverElements() {
    document.getElementById('winner-info').classList.add('d-none');
    document.getElementById('game-over').classList.add('d-none');
    document.getElementById('restart-btn').classList.add('d-none');
}


/**
 * Restart the lines and hide all set symbols in th game fields.
 */
function resetLinesHideSymbols() {
    // Restart the LinesContainer ("to the default style").
    document.getElementById('LinesContainer').innerHTML = genHTMLLinesWithStartStyle();

    for (let i = 0; i < 9; i++) {
        document.getElementById('circle-' + i).classList.add('d-none');
        document.getElementById('cross-' + i).classList.add('d-none');
    }

    enableHoverOverFields();
}


/**
 * Generate HTML-elements of lines with default style at the beginning of a new game.
 * @returns - This are HTML-elements of lines with default styles assigned to the parent container with id="LinesContainer".
 */
function genHTMLLinesWithStartStyle() {
    return /* html */ `
        <!-- horizontal -->
            <div id="line-0" class="horizontal-line" style="top: calc((100% - 10px)/6 - 5px)"></div>
            <div id="line-1" class="horizontal-line" style="top: calc(50% - 5px)"></div>
            <div id="line-2" class="horizontal-line" style="bottom: calc((100% - 10px)/6 - 5px)"></div>

            <!-- vertical -->
            <div id="line-3" class="vertical-line" style="top:0; left: calc((100% - 10px)/6 - 5px)"></div>
            <div id="line-4" class="vertical-line" style="top:0; left: calc(50% - 5px)"></div>
            <div id="line-5" class="vertical-line" style="top:0; right: calc((100% - 10px)/6 - 5px)"></div>

            <!-- diagonal -->
            <div id="line-6" class="horizontal-line"
            style="top: calc(50% - 5px); transform: rotate(45deg) scaleX(0)"></div>
            <div id="line-7" class="horizontal-line"
            style="top: calc(50% - 5px); transform: rotate(-45deg) scaleX(0)"></div>
    `;
}


/**
 * Enable the background color effect and cursor:pointer on hover over the game fields.
 */
function enableHoverOverFields() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('td' + i).classList.add('tdHover');
    }
}


/**
 * Fill the array fields either with the cross or withe the the circle in the corresponding array position.
 * The value will be changed on click between the cross the circle through the if-statement
 * and drawn in the selected field 
 * Check if sommeone won.
 * @param {number} id - The id of the game field.
 */
function fillShape(id) {
    /* Set the symbol only one time: if the field is empty and so lang as the gemovOver variable is false. */
    if (!fields[id] && !gameOver && amountOfTurns < 9) {
        playAudio(AUDIO_SYMBOL);

        if (currentShape == 'cross') {
            makeCurrentShapreCircle();
        } else {
            makeCurrentShapreCross();
        }

        setFulfillFieldAndCheckForWin(id);
    }
}


/**
 * Make the current shape to the circle and its style.
 */
function makeCurrentShapreCircle() {
    currentShape = 'circle'

    // Set the player 1 active
    document.getElementById('player-1').classList.add('player-inactive')
    document.getElementById('player-2').classList.remove('player-inactive')
}


/**
 * Make the current shape to the cross and its style.
 */
function makeCurrentShapreCross() {
    currentShape = 'cross'

    // Set the player 2 active
    document.getElementById('player-1').classList.remove('player-inactive')
    document.getElementById('player-2').classList.add('player-inactive')
}


/**
 * Set fields array with the current shape, draw it in the game field, increase the amount of turns and check if the win took place.
 */
function setFulfillFieldAndCheckForWin(id) {
    fields[id] = currentShape;
    console.log(fields);
    draw();
    amountOfTurns++;
    checkForWin();
}


/**
 * Stop the current playing audio and play (by means of load() funktion) the selected on
 * @param {audioObject} - This is an audioObject which is declared in this script file and will be played.
 */
function playAudio(audio) {
    stopAudio();
    audio.addEventListener("canplay", function onCanPlay() {
        audio.removeEventListener("canplay", onCanPlay);
        audio.play();
    });
    audio.load();
}


// Custom property for HTMLMediaElements which 
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function () {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})


/**
 * Draw circle or cross symbol in the selected field.
 */
function draw() {
    if (amountOfTurns < 9) {
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            // Remove the d-None css class, if fiels array value = cirle.
            if (fields[i] == 'circle') {
                document.getElementById(`circle-${i}`).classList.remove('d-none')
            }

            // Remove the d-None css class, if fiels array value = cross.
            if (fields[i] == 'cross') {
                document.getElementById(`cross-${i}`).classList.remove('d-none')
            }
        }
    }
}


/**
 * Check the rules for winning the game and output the winning symbol or show the game over screen if the draw
 */
function checkForWin() {
    //check all rows
    checkRows();

    //check all columns
    checkColumns();

    //check both diagonals
    checkCrossOutLines();

    // Output the winner if the winner is filled.
    outputWinner();
}


/**
 * Check if one of the table rows have three the same symbols.
 */
function checkRows() {
    // Check for the 1. table row if the left symbol is the same as the middle one AND the middle as the right one.
    // Check if the 1. valaue in the if condition exist / is not undefined.
    if (fields[0] == fields[1] && fields[1] == fields[2] && fields[0]) {
        // Set the winner if the condition is fulfilled for the winning symbol.
        winner = fields[0];
        // Cross out the symbols.
        document.getElementById('line-0').style.transform = 'scaleX(1)';
    }

    // Check for the 2. table row if the left symbol is the same as the middle one AND the middle as the right one.
    if (fields[3] == fields[4] && fields[4] == fields[5] && fields[3]) {
        winner = fields[3];
        document.getElementById('line-1').style.transform = 'scaleX(1)';
    }

    // Check for the 3. table row if the left symbol is the same as the middle one AND the middle as the right one.
    if (fields[6] == fields[7] && fields[7] == fields[8] && fields[6]) {
        winner = fields[6];
        document.getElementById('line-2').style.transform = 'scaleX(1)';
    }
}


/**
 *  * Check if one of the table colums have three the same symbols.
 */
function checkColumns() {
    // Check for the 1. table column if the first symbol is the same as the middle one AND the middle as the last one.
    // Check if the 1. valaue in the if condition exist / is not undefined.
    if (fields[0] == fields[3] && fields[3] == fields[6] && fields[0]) {
        winner = fields[0];
        document.getElementById('line-3').style.transform = 'scaleY(1)';
    }

    // Check for the 2. table column if the first symbol is the same as the middle one AND the middle as the last one.
    // Check if the 1. valaue in the if condition exist / is not undefined.
    if (fields[1] == fields[4] && fields[4] == fields[7] && fields[1]) {
        winner = fields[1];
        document.getElementById('line-4').style.transform = 'scaleY(1)';
    }

    // Check for the 3. table column if the first symbol is the same as the middle one AND the middle as the last one.
    // Check if the 1. valaue in the if condition exist / is not undefined.
    if (fields[2] == fields[5] && fields[5] == fields[8] && fields[2]) {
        winner = fields[2];
        document.getElementById('line-5').style.transform = 'scaleY(1)';
    }
}


/**
 *  * Check if one of the table diagonals have three the same symbols.
 */
function checkCrossOutLines() {
    // Check for the diagonal from the left top to the down right corner if the first symbol is the same as the middle one AND the middle as the last one.
    // Check if the 1. valaue in the if condition exist / is not undefined.
    if (fields[0] == fields[4] && fields[4] == fields[8] && fields[0]) {
        winner = fields[0];
        document.getElementById('line-6').style.transform = 'rotate(45deg) scaleX(1.38)';
    }

    // Check for the diagonal from the right top to the down left corner if the first symbol is the same as the middle one AND the middle as the last one.
    // Check if the 1. valaue in the if condition exist / is not undefined.
    if (fields[2] == fields[4] && fields[4] == fields[6] && fields[2]) {
        winner = fields[2];
        document.getElementById('line-7').style.transform = 'rotate(-45deg) scaleX(1.38)';
    }
}


/**
 * Output the winner if the winner is filled or the info: draw (no winner) in the console and the winner info container.
 */
function outputWinner() {
    if (winner) {
        if (winner == 'circle') {
            winner = 'Player 1'
        } else {
            winner = 'Player 2'
        }

        // Output the winner in the console and in the the winner info container.
        console.log('Winner:', winner);
        document.getElementById('winner-info').innerHTML = `The winner is ${winner}!`;
        // Show the winner info container, the game over img and the restart button.
        showSetGameOver();
    } else if (amountOfTurns == 9) {
        // Output the draw in the console (no winner exists) and in the the winner info container.
        console.log('DRAW');
        document.getElementById('winner-info').innerHTML = 'DRAW!';
        // Show the winner info container, the game over img and the restart button.
        showSetGameOver();
    }
}


/**
 * Show the winner info container, the game over img and the restart button.
 */
function showSetGameOver() {
    // Make th game over
    playAudio(AUDIO_GAMEOVER);
    gameOver = true;

    disableHoverOverFields();

    // Show the game move img and the restart button after some time (after the scaling of the cross out - line)
    setTimeout(() => {
        document.getElementById('winner-info').classList.remove('d-none');
        document.getElementById('game-over').classList.remove('d-none');
        document.getElementById('restart-btn').classList.remove('d-none');
    }, 650);
}


/**
 * Disable the background color effect and cursor:pointer on hover over the game fields.
 */
function disableHoverOverFields() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('td' + i).classList.remove('tdHover');
    }
}