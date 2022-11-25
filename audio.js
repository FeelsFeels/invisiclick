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
    // this.click1.preload = 'auto';
    this.click1.load();

    this.click2 = new Audio('sounds/click2.wav');
    this.click3 = new Audio('sounds/click3.mp3');
    this.click4 = new Audio('sounds/click4.wav');
    this.click5 = new Audio('sounds/click5.wav');
    this.lifeUp = new Audio('sounds/lifeUp.mp3');
    this.lifeDown = new Audio('sounds/lifeDown.mp3');
}

AudioManager.prototype.playClick = function() {
    let click = this.click1.cloneNode();
    click.play();
}

var audioManager = new AudioManager();
audioManager.loadSounds();