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

    this.level = 1;
    this.lives = 2;
}

Counter.prototype.click = function (){

    if(this.clicksDisabled){
        return;
    }
    audioManager.click1.play();

    this.lastClicked = Date.now();

    if(this.inGame == false){
        this.inGame = true;
        setTimeout(toggleNumberCover, 1300);
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
    
    toggleCountdownDisplay();
    toggleNumberCover();

    if(this.count == this.clicksNeeded){
        instructionsText.textContent = "Well done!";
        this.level += 1;
        this.clicksNeeded = this.level ** 2;
        setTimeout(nextLevel, 3000);
        
        this.lives = 2;
        livesText.textContent = `Lives: ${game.lives}/2`;
    }
    else{
        //failed        
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
        let timeSinceLastClicked = Date.now() - game.lastClicked;
        // console.log(timeSinceLastClicked);
        // console.log(Date.now(), game.lastClicked);

        if(timeSinceLastClicked > 3000){
            if(!game.isCountingDown){
                toggleCountdownDisplay();
                game.isCountingDown = true;

            }
            let timeLeft = 8000 - timeSinceLastClicked;
            countdownDisplay.textContent = '0:0' + Math.ceil(timeLeft/1000);

            if(timeLeft < 0) {
                game.checkClicks();
            }
        }
        else{
            if(game.isCountingDown){
                toggleCountdownDisplay();
                game.isCountingDown = false;
            }
        }

        requestAnimationFrame(gameLoop);
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

function nextLevel() {
    instructionsText.textContent = 'Click the button exactly ' + game.clicksNeeded + ' times!';
    game.count = 0;
    clickCount.textContent = 0;

    game.clicksDisabled = false;
}


function restartGame() {
    console.log('reset_');
    clickCount.textContent = '0';
    instructionsText.textContent = 'Click the button exactly once!';
    game.count = 0;
    game.clicksNeeded = 1;
}

function toggleNumberCover(){
    numberCoverOverlay.classList.toggle('coverup_display');
}

function toggleCountdownDisplay(){
    countdownDisplay.classList.toggle('countdown_display');
}


clickButton.addEventListener("click", ()=> {
    game.click();
});



debug.addEventListener("click", shiftClickButton);
restartGame();

// click-timer bottom-right-counter-enter bottom-right-counter-enter-active