// Модель MVC (Move, View, Controller)

// Контроллер это связующее звено
// оно связывает model и view

// объект отвечающий за отображение, содержит 3 метода
let view = {
    displayMessage: function (msg) {
        // задача этого метода принять сообщение и вывести его на экран
        document.querySelector('.messageArea').innerHTML = msg;
    },

    displayHit: function (location) {
        // метод отвечающий за попадания
        document.getElementById(location).setAttribute('class', 'hit');
    },

    displayMiss: function (location) {
        //метод отвечающий за промахи
        document.getElementById(location).setAttribute('class', 'miss');
    },
};

// Тесты для view
// view.displayMessage('привет');
// view.displayHit(30);
// view.displayMiss(40);

let model = {
    boardSize: 10, // Размер игрового поля
    numShips: 5, // Количество кораблей в игре
    shipsLength: 4, // Длина корабля в клетках
    shipsSunk: 0, // Количество потопленных кораблей

    ships: [
        { locations: [0, 0, 0, 0], hits: ['', '', '', ''] },
        { locations: [0, 0, 0, 0], hits: ['', '', '', ''] },
        { locations: [0, 0, 0, 0], hits: ['', '', '', ''] },
        { locations: [0, 0, 0, 0], hits: ['', '', '', ''] },
        { locations: [0, 0, 0, 0], hits: ['', '', '', ''] },
    ],

    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (ship.hits[index] === 'hit') {
                view.displayMessage('Ми вже туди стріляли капітан!');
                return true;
            } else if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('Є потрапляння по ворожому кораблю!');

                if (this.isSunk(ship)) {
                    view.displayMessage('Їх корабель підірваний капітан!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('Бл*ть ми промахнулися!');
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipsLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },

    // Генератор кораблей на игровом поле

    generateShipLocation: function () {
        // Создает модели кораблей
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log('Ships array: ');
        console.log(this.ships);
    },

    generateShip: function () {
        // Создает массив со случайными позициями корабля
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(
                Math.random() * (this.boardSize - this.shipsLength + 1)
            );
        } else {
            row = Math.floor(
                Math.random() * (this.boardSize - this.shipsLength + 1)
            );
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocation = [];

        for (let i = 0; i < this.shipsLength; i++) {
            if (direction === 1) {
                newShipLocation.push(row + '' + (col + i));
            } else {
                newShipLocation.push(row + i + '' + col);
            }
        }
        return newShipLocation;
    },

    collision: function (locations) {
        // Проверяет пересечения кораблей
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
};

// Контроллер

let controller = {
    guesses: 0,

    processGuess: function (guess) {
        let location = parceGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(
                    `Це перемога капітан! Ви потопили ворожий флот за ${this.guesses} пострілів!`
                );
            }
        }
    },
};

function parceGuess(guess) {
    let alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];

    if (guess === null || guess.length !== 2) {
        alert('Ти ввів невірні координати');
    } else {
        firstChar = guess.charAt(0);
        let column = alphabet.indexOf(firstChar);
        let row = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Ти ввів невірні координати');
        } else if (
            row < 0 ||
            row >= model.boardSize ||
            column < 0 ||
            column >= model.boardSize
        ) {
            alert('Ти ввів невірні координати');
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    let guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocation();
}

function handleFireButton() {
    let guessInput = document.getElementById('guessInput');

    let guess = guessInput.value;
    console.log(guess);
    controller.processGuess(guess);

    guessInput = '';
}

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init();

document.getElementById('start').onclick = function () {
    document.querySelector('.menu').setAttribute('class', 'hide');
};
