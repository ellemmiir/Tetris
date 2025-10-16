export default class View {
  static colors = {
    '1': '#00bad5',
    '2': '#003e87',
    '3': '#f58401',
    '4': '#eacf16',
    '5': '#00b36d',
    '6': '#5b2674',
    '7': '#cc2831',
  }

  constructor(element, width, height, rows, columns) {
    this.element = element;
    this.width = width;
    this.height = height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');

    //properties of playfield
    this.playfieldBorderWidth = 4;
    this.playfieldX = this.playfieldBorderWidth;
    this.playfieldY = this.playfieldBorderWidth;
    this.playfieldWidth = this.width * 2 / 3;
    this.playfieldHeight = this.height;
    this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
    this.playfieldHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

    //properties for blocks
    this.blockWidth = this.playfieldInnerWidth / columns;
    this.blockHeight = this.playfieldHeight / rows;

    //properties for panel
    this.panelX = this.playfieldWidth + 10;
    this.panelY = 15;
    this.panelWidth = this.width / 3;

    this.element.appendChild(this.canvas);
  }

  //render different screens
  renderMainScreen(state) {
    this.clearScreen();
    this.renderPlayfield(state);
    this.renderPanel(state);
  }

  renderStartScreen() {
    this.context.fillStyle = 'black';
    this.context.font = '22px "Nunito"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
  }

  renderPauseScreen() {
    this.context.fillStyle = 'rgba(79, 79, 79, 0.6)';
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = 'white';
    this.context.font = '22px "Nunito"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
  }

  renderOverScreen({ score }) {
    this.clearScreen();

    this.context.fillStyle = 'black';
    this.context.font = '22px "Nunito"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('Game Over', this.width / 2, this.height / 2 - 66);
    this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2 - 33);
    this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2);
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  //render playfield, panel and blocks
  renderPlayfield({ playfield }) {
    for (let y = 0; y < playfield.length; y++) {
      for (let x = 0; x < playfield[y].length; x++) {
        const block = playfield[y][x];

        if (block) {
          this.renderBlock(
            this.playfieldX + (x * this.blockWidth),
            this.playfieldY + (y * this.blockHeight),
            this.blockWidth,
            this.blockHeight,
            View.colors[block]
          );
        }
      }
    }

    this.context.strokeStyle = 'white';
    this.context.lineWidth = 1;
    this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight + this.playfieldBorderWidth * 2);
  }

  renderPanel({ level, score, lines, nextPiece }) {
    this.context.textAlign = 'start';
    this.context.textBaseline = 'top';
    this.context.fillStyle = 'black';
    this.context.font = '18px "Nunito"';
    this.context.fillText('Score:', this.panelX, this.panelY + 10);
    this.context.fillText(`${score}`, this.panelX, this.panelY + 35);
    this.context.fillText('Lines:', this.panelX, this.panelY + 60);
    this.context.fillText(`${lines}`, this.panelX, this.panelY + 85);
    this.context.fillText('Level:', this.panelX, this.panelY + 110);
    this.context.fillText(`${level}`, this.panelX, this.panelY + 135);
    this.context.fillText('Next:', this.panelX, this.panelY + 170);

    for (let y = 0; y < nextPiece.blocks.length; y++) {
      for (let x = 0; x < nextPiece.blocks[y].length; x++) {
        const block = nextPiece.blocks[y][x];

        if (block) {
          this.renderBlock(
            this.panelX + (x * this.blockWidth * 0.7),
            this.panelY + 180 + (y * this.blockHeight * 0.7),
            this.blockWidth * 0.7,
            this.blockHeight * 0.7,
            View.colors[block]
          );
        }
      }
    }
  }

  renderBlock(x, y, width, height, color) {
    const radius = 8;

    this.context.fillStyle = color;
    this.context.strokeStyle = '#e5e1e0';
    this.context.lineWidth = 2;

    this.context.beginPath();
    this.context.moveTo(x + radius, y);
    this.context.lineTo(x + width - radius, y);
    this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.context.lineTo(x + width, y + height - radius);
    this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.context.lineTo(x + radius, y + height);
    this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.context.lineTo(x, y + radius);
    this.context.quadraticCurveTo(x, y, x + radius, y);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
  }
}