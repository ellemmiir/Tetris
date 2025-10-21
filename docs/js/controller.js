export default class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.intervalId = null;
    this.isPlaying = false;

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));

    this.buttons = document.getElementsByTagName('button');

    this.view.renderStartScreen();
  }

  update() {
    this.game.movePieceDown();
    this.updateView();
  }

  //selectable screen depending on the condition
  updateView() {
    const state = this.game.getState();

    if (state.isGameOver) {
      this.view.renderOverScreen(state);
    } else if (!this.isPlaying) {
      this.view.renderPauseScreen();
    } else {
      this.view.renderMainScreen(state);
    }
  }

  play() {
    this.isPlaying = true;
    this.startTimer();
    this.updateView();
  }

  pause() {
    this.isPlaying = false;
    this.stopTimer();
    this.updateView();
  }

  reset() {
    this.game.reset();
    this.play();
  }

  //block movement timer 
  startTimer() {
    const speed = 1000 - this.game.getState().level * 100;

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.update();
      }, speed > 0 ? speed : 100);
    }
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }


  


  //click processing (keyboard and mouse)
  handleKeyDown(event) {
    const state = this.game.getState();

     if (!this.isPlaying && event.keyCode !== 13) {
       return;
     }

    switch (event.keyCode) {
      case 13: //enter
        if (state.isGameOver) {
          this.reset();
        } else if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
        break;
      case 37: //left
        this.game.movePieceLeft();
        this.updateView();
        break;
      case 38: //up
        this.game.rotatePiece();
        this.updateView();
        break;
      case 39: //right
        this.game.movePieceRight();
        this.updateView();
        break;
      case 40: //down
        this.stopTimer();
        this.game.movePieceDown();
        this.updateView();
        break;
    }
  }

  handleKeyUp(event) {

    if (!this.isPlaying) {
      return;
    }


    switch (event.keyCode) {
      case 40: //down
        this.startTimer();
        break;
    }
  }

  handleClick(event) {
    const state = this.game.getState();
    const target = event.target;
    const keyId = target.getAttribute('id');

    switch (keyId) {
      case 'left':
        if (this.isPlaying) {
          this.game.movePieceLeft();
          this.updateView();
        }
        break;
      case 'up':
        if (this.isPlaying) {
          this.game.rotatePiece();
          this.updateView();
        }
        break;
      case 'right':
        if (this.isPlaying) {
          this.game.movePieceRight();
          this.updateView();
        }
        break;
      case 'down':
        if (this.isPlaying) {
          this.game.movePieceDown();
          this.updateView();
        }
        break;
      case 'power': //same as enter
        if (state.isGameOver) {
          this.reset();
        } else if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
        break;
    }
    target.blur();
  };
}