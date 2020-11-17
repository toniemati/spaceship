import { Spaceship } from './Spaceship.js';

class Game {
    #htmlElements = {
        spaceship: document.querySelector('[data-spaceship]'),
        container: document.querySelector('[data-container]'),
    }

    #ship = new Spaceship(this.#htmlElements.spaceship, this.#htmlElements.spaceship);

    #checkPositionInterval = null;

    init() {
        this.#newGame();
        this.#ship.init();
    }

    #newGame() {
        this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
    }

    #checkPosition() {
        this.#ship.missiles.forEach((missile, missileIndex, missileArray) => {
            const missilePosition = {
                top: missile.element.offsetTop,
                right: missile.element.offsetRight + missile.element.offsetWidth,
                bottom: missile.element.offsetTop + missile.element.offsetHeight,
                left: missile.element.offsetLeft,
            };
            if (missilePosition.bottom < 0) {
                missile.remove();
                missileArray.splice(missileIndex, 1);
            }
        })
    }
}

const game = new Game();
game.init();