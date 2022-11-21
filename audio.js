function AudioManager() {
    this.click1;
    this.click2;
    this.lifeUp;
    this.lifeDown;
}

AudioManager.prototype.play = function(sound){

}

AudioManager.prototype.loadSounds = function(){
    this.click1 = new Audio('sounds/click1.mp3');
    this.click2 = new Audio('sounds/click2.wav');
    this.lifeUp = new Audio('sounds/lifeUp.mp3');
    this.lifeDown = new Audio('sounds/lifeDown.mp3');
}

var audioManager = new AudioManager();
audioManager.loadSounds();