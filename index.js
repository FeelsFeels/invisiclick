let mainMenu = document.querySelector('.mainMenu');
let rootDiv = document.querySelector('.root');

let clickCount = document.getElementById('click-count');
let instructionsText = document.getElementById('instructions');
let clickButton = document.getElementById('click-button');
let debug = document.getElementById('debug');
let numberCoverOverlay = document.querySelector('.coverup');
let countdownDisplay = document.querySelector('.countdown');
let livesText = document.querySelector('.lives');


let game = new Counter();
function Counter(){
    this.count = 0;
    this.clicksNeeded = 0;
    this.inGame = false;
    this.clicksDisabled = false;
    this.isCountingDown = false;
    this.lastClicked;
    this.countdownTimeModifier = 1;

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
    }

    this.count += 1;
    console.log(this.count);
    clickCount.textContent = this.count;
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
            setTimeout(nextLevel, 3000);
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
            countdown();
        }

        requestAnimationFrame(gameLoop);
    }
}

function countdown() {
    let timeSinceLastClicked = Date.now() - game.lastClicked;
    let timeLeft = 8000 * game.countdownTimeModifier - timeSinceLastClicked;
    // console.log(timeLeft);

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
    console.log(game.level);

    if(game.gameType == 0){
        game.countdownTimeModifier = 1;
        if(game.level <= 4){
            game.countdownTimeModifier = game.level / 6;
        }
        game.clicksNeeded = game.level ** 2;
    }
    
    if(game.gameType == 1){
        game.countdownTimeModifier = 1;

        game.clicksNeeded = (game.level ** 2) + (Math.floor(Math.random() * game.level)) * (Math.round(Math.random()) ? 1 : -1);
    
    }

    readyLevel();

}


function restartGame() {
    console.log('full reset_');
    clickCount.textContent = '0';
    instructionsText.textContent = 'Click the button exactly once!';
    game.level = 1;
    nextLevel();
}

function showNumberCover(){
    numberCoverOverlay.classList.add('coverup_display');
}
function hideNumberCover(){
    numberCoverOverlay.classList.remove('coverup_display');
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



debug.addEventListener("click", restartGame);
// restartGame();

// click-timer bottom-right-counter-enter bottom-right-counter-enter-active