import Game from './game.js'
import View from './view.js'
import Controller from './controller.js'

const root = document.querySelector('#root');

const game = new Game();
const view = new View(root, 370, 510, 20, 10);
const controller = new Controller(game, view);




