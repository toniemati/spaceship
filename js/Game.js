import { Spaceship } from './Spaceship.js';
import { Enemy } from './Enemy.js';

class Game {
    #htmlElements = {
        spaceship: document.querySelector('[data-spaceship]'),
        container: document.querySelector('[data-container]'),
        score: document.querySelector('[data-score]'),
        lives: document.querySelector('[data-lives]'),
        modal: document.querySelector('[data-modal]'),
        scoreInfo: document.querySelector('[data-score-info]'),
        scoreButton: document.querySelector('[data-button]'),
    }

    #ship = new Spaceship(this.#htmlElements.spaceship, this.#htmlElements.spaceship);
    #enemies = [];
    #lives = null;
    #score = null;
    #enemiesInterval = null;
    #checkPositionInterval = null;
    #createEnemyInterval = null;

    init() {
        this.#newGame();
        this.#ship.init();
        this.#htmlElements.scoreButton.addEventListener('click', () => this.#newGame());
    }

    #newGame() {
        this.#htmlElements.modal.classList.add('hide');
        this.#enemiesInterval = 30;
        this.#lives = 3;
        this.#score = 0;
        this.#updateLivesText();
        this.#updateScoreText();
        this.#ship.setPossition();
        this.#createEnemyInterval = setInterval(() => this.#randomNewEnemy(), 1000);
        this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
    }

    #endGame() {
        this.#htmlElements.modal.classList.remove('hide');
        this.#htmlElements.scoreInfo.textContent = `You loose! Your score is: ${this.#score
            }`;
        this.#enemies.forEach((enemy) => enemy.explode());
        this.#enemies.length = 0;
        clearInterval(this.#createEnemyInterval);
        clearInterval(this.#checkPositionInterval);
    }

    #randomNewEnemy() {
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        randomNumber % 5
            ? this.#createNewEnemy(this.#htmlElements.container, this.#enemiesInterval, 'enemy', 'explosion')
            : this.#createNewEnemy(this.#htmlElements.container, this.#enemiesInterval * 2, 'enemy--big', 'explosion--big', 3);
    }

    #createNewEnemy(...params) {
        const enemy = new Enemy(...params);
        enemy.init();
        this.#enemies.push(enemy);
    }

    #checkPosition() {
        this.#enemies.forEach((enemy, enemyIndex, enemiesArray) => {
            const enemyPosition = {
                top: enemy.element.offsetTop,
                right: enemy.element.offsetLeft + enemy.element.offsetWidth,
                bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
                left: enemy.element.offsetLeft,
            };

            if (enemyPosition.top > window.innerHeight) {
                enemy.explode();
                enemiesArray.splice(enemyIndex, 1);
                this.#updateLives();
            }

            this.#ship.missiles.forEach((missile, missileIndex, missilesArray) => {
                const missilePosition = {
                    top: missile.element.offsetTop,
                    right: missile.element.offsetLeft + missile.element.offsetWidth,
                    bottom: missile.element.offsetTop + missile.element.offsetHeight,
                    left: missile.element.offsetLeft,
                };

                if (
                    missilePosition.bottom >= enemyPosition.top &&
                    missilePosition.top <= enemyPosition.bottom &&
                    missilePosition.right >= enemyPosition.left &&
                    missilePosition.left <= enemyPosition.right
                ) {
                    enemy.hit();
                    if (!enemy.lives) {
                        enemiesArray.splice(enemyIndex, 1);
                    }

                    missile.remove();
                    missilesArray.splice(missileIndex, 1);
                    this.#updateScore();
                }

                if (missilePosition.bottom < 0) {
                    missile.remove();
                    missilesArray.splice(missileIndex, 1);
                }

            })
        })

    }

    #updateScore() {
        this.#score++;
        if (!(this.#score % 5)) {
            this.#enemiesInterval--;
        }
        this.#updateScoreText();
    }

    #updateScoreText() {
        this.#htmlElements.score.textContent = `Score: ${this.#score}`;
    }

    #updateLives() {
        this.#lives--;
        this.#updateLivesText();
        this.#htmlElements.container.classList.add('hit');
        setTimeout(() => this.#htmlElements.container.classList.remove('hit'), 100);
        if (!this.#lives) {
            this.#endGame();
        }
    }

    #updateLivesText() {
        this.#htmlElements.lives.textContent = `Lives: ${this.#lives}`;
    }
}

const game = new Game();
game.init();