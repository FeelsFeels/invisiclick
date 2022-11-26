let mainMenu = document.querySelector('.mainMenu');
let rootDiv = document.querySelector('.root');

let clickCount = document.getElementById('click-count');
let instructionsText = document.getElementById('instructions');
let clickButton = document.getElementById('click-button');
let numberCoverOverlay = document.querySelector('.coverup');
let countdownDisplay = document.querySelector('.countdown');
let speedModeCountdownDisplay = document.querySelector('.speed_countdown');
let livesText = document.querySelector('.lives');


let game = new Counter();
function Counter(){
    this.count = 0;
    this.countHidden = false;
    this.clicksNeeded = 0;
    this.inGame = false;
    this.clicksDisabled = false;
    this.isCountingDown = false;
    this.timeOfFirstClick;
    this.lastClicked;
    this.countdownTimeModifier = 1;

    this.speedModeTimeLimit;

    this.level = 1;
    this.lives = 2;

    this.gameType;
}

Counter.prototype.click = function (){

    if(this.clicksDisabled){
        return;
    }
    // audioManager.click5.play();
    audioManager.playClick();

    this.lastClicked = Date.now();

    if(this.inGame == false){
        this.inGame = true;
        setTimeout(showNumberCover, 1300);
        requestAnimationFrame(gameLoop);

        if(this.gameType == 1){
            this.timeOfFirstClick = Date.now();
        }

        setTimeout(() => {
            if(this.inGame){
                clickCount.textContent = 'ಠ_ಠ';
            }
        }, 3000);
    }

    this.count += 1;
    if(!this.countHidden){
        clickCount.textContent = this.count;
    }
}

Counter.prototype.checkClicks = function(){
    // this.lastClicked = 0;
    this.inGame = false;
    this.isCountingDown = false;
    this.clicksDisabled = true;

    
    hideNumberCover();
    hideCountdownDisplay();


    if(this.count == this.clicksNeeded){
        audioManager.lifeUp.play();
        instructionsText.textContent = "Well done!";
        this.level += 1;

        setTimeout(nextLevel, 3000);
        
        this.lives = 2;
        livesText.textContent = `Lives: ${game.lives}/2`;
    }
    else{
        //failed        
        audioManager.lifeDown.play();
        game.lives -= 1 ;
        livesText.textContent = `Lives: ${game.lives}/2`;
        instructionsText.textContent = 'Level Failed!';

        if(this.lives > -1){
            setTimeout(readyLevel, 3000);
        }
        else{
            instructionsText.textContent = 'Game Over!';
        }
    }
}


function gameLoop(){
    if(game.inGame){
        if(game.gameType == 0){
            countdown();            
        }
        
        if(game.gameType == 1){
            //supedo modo
            speedModeCountdown();
        }

        requestAnimationFrame(gameLoop);
    }
}

function countdown() {
    let timeSinceLastClicked = Date.now() - game.lastClicked;
    let timeLeft = 8000 * game.countdownTimeModifier - timeSinceLastClicked;

    if(timeLeft < 0) {
        game.checkClicks();
        return;
    }

    if(timeSinceLastClicked > 3000){
        if(!game.isCountingDown){
            showCountdownDisplay();
            game.isCountingDown = true;
        }
        countdownDisplay.textContent = '0:0' + Math.ceil(timeLeft/1000);

    }
    else{
        if(game.isCountingDown){
            hideCountdownDisplay();
            game.isCountingDown = false;
        }
    }

}


function speedModeCountdown() {
    let timeLeft = game.speedModeTimeLimit - (Date.now() - game.timeOfFirstClick);

    speedModeCountdownDisplay.textContent = (timeLeft / 1000).toFixed(2).replace(".", ":");

    if(timeLeft < 0){
        speedModeCountdownDisplay.textContent = "0:00";
        game.checkClicks();
        return;
    }
}


function shiftClickButton() {
    clickButton.classList.add('click-button-shifted');
    // let randtop = 10;
    // clickButton.style.setProperty('position', 'absolute');
    // clickButton.style.setProperty('top', 'absolute');
}
function returnClickButtonToPosition() {
    // clickButton.classList.remove('click-button-shifted');
}

function readyLevel(){
    game.count = 0;
    clickCount.textContent = 0;
    game.clicksDisabled = false;
    
    if(game.clicksNeeded != 1){
        instructionsText.textContent = 'Click the button exactly ' + game.clicksNeeded + ' times!';
    }
    else{
        instructionsText.textContent = 'Click the button exactly once!';
    }

}

function nextLevel() {
    console.log("Level " + game.level);

    if(game.gameType == 0){
        game.countdownTimeModifier = 1;
        if(game.level <= 4){
            game.countdownTimeModifier = game.level / 6;
        }
        game.clicksNeeded = game.level ** 2;
    }
    
    if(game.gameType == 1){
        //for each level, 5 clicks/second is needed
        game.speedModeTimeLimit = ((game.level ** 2) / 4.5) * 1000;

        game.clicksNeeded = (game.level ** 2) + (Math.floor(Math.random() * game.level)) * (Math.round(Math.random()) ? 1 : -1);
    
    }

    readyLevel();

}


function restartGame() {
    clickCount.textContent = '0';
    instructionsText.textContent = 'Click the button exactly once!';
    game.level = 1;
    nextLevel();
}

function showNumberCover(){
    if(!game.inGame){
        return;
    }

    //2.8seconds for number to be fully hidden
    //1.3s after first click for this function to run
    setTimeout(() => {
        if(game.inGame){
            game.countHidden = true;
        }
        
    }, 1500);

    numberCoverOverlay.classList.add('coverup_display');

    if(game.gameType == 1){
        speedModeCountdownDisplay.classList.add('speed_countdown_display')
    }
}
function hideNumberCover(){
    game.countHidden = false;
    clickCount.textContent = game.count;
    
    numberCoverOverlay.classList.remove('coverup_display');
    if(game.gameType == 1){
        speedModeCountdownDisplay.classList.remove('speed_countdown_display')
    }
}

function showCountdownDisplay(){
    countdownDisplay.classList.add('countdown_display');
}
function hideCountdownDisplay(){
    countdownDisplay.classList.remove('countdown_display');
}

function InitGame(gameCode) {
    
    game.gameType = gameCode;
    if(gameCode == 0){
        game.level = 1;
    }
    else{
        game.level = 5;
    }

    //transition sequence from main menu to game
    mainMenu.classList.remove('opacity_on');
    setTimeout(() => {
        mainMenu.style.display = 'none';
    }, 800);
    rootDiv.classList.add('opacity_on');

    nextLevel();
    
}



clickButton.addEventListener("click", ()=> {
    game.click();
});





document.addEventListener("keydown", (key) => {
	let code = key.code;
	
	if(code == 'KeyZ'){
		if(key.repeat){
			return;
		}
        game.click();
	}
	if(code == 'KeyX'){
		if(key.repeat){
			return;
		}
        game.click();
	}
});
