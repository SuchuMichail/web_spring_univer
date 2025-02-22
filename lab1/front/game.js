let game_container = document.getElementById("game-container");
let authorization_container = document.getElementById("authorization-container");
let div_all_users = document.getElementById("div-all-users");
let all_users_container = document.getElementById("all-users-container");
let add_user_container = document.getElementById("add-user-container");
let login_password_container = document.getElementById("login-password-container");
let name_surname_container = document.getElementById("name-surname-container");
let deleting_container = document.getElementById("deleting-container");



let grid = Array(16).fill(0);
let score = 0;
let record = 0;
let username, usersurname;
let id_user;
let login, password;

const cells = document.querySelectorAll('.cell');
const scoreDisplay = document.getElementById('score');
const recordDisplay = document.getElementById('record');
const nameDisplay = document.getElementById('name');
const surnameDisplay = document.getElementById('surname');


// Запуск игры с начальной конфигурацией
function startGame() {
    score = 0;
    grid = Array(16).fill(0);
    addRandomTile();
    addRandomTile();
    updateBoard();
}

// Добавление случайной плитки (2 или 4)
function addRandomTile() {
    const emptyCells = grid.map((val, index) => val === 0 ? index : -1).filter(index => index !== -1);
    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomIndex] = Math.random() < 0.9 ? 2 : 4;
}

// Обновление отображения на доске
function updateBoard() {
    grid.forEach((value, index) => {
        const cell = cells[index];
        cell.textContent = value === 0 ? '' : value;
        cell.setAttribute('data-value', value);
    });

    if(score > record){
        record = score;
        // Сохранить рекорд в бд
        let obj = {
            id: id_user,
            login: login,
            password: password,
            name: username,
            surname: usersurname,
            score: record
        };

        console.log(JSON.stringify(obj));

        let req = new XMLHttpRequest();
        req.open("POST", "http://localhost:8080/user/editUser", false);
        req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        req.send(JSON.stringify(obj));
        console.log(JSON.parse(req.status));
    }

    scoreDisplay.textContent = `Score: ${score}`;
    recordDisplay.textContent = `Record: ${record}`;
    nameDisplay.textContent = `Name: ${username}`;
    surnameDisplay.textContent = `Surname: ${usersurname}`;
}

// Основная логика перемещения плиток
function move(direction) {
    let moved = false;
    let newGrid = [...grid];

    if (direction === 'left' || direction === 'right') {
        for (let row = 0; row < 4; row++) {
            const line = newGrid.slice(row * 4, row * 4 + 4);
            const newLine = slideLine(line, direction);
            newGrid.splice(row * 4, 4, ...newLine);
            if (!arraysEqual(line, newLine)) moved = true;
        }
    } else {
        for (let col = 0; col < 4; col++) {
            const line = [newGrid[col], newGrid[col + 4], newGrid[col + 8], newGrid[col + 12]];
            const newLine = slideLine(line, direction);
            newGrid[col] = newLine[0];
            newGrid[col + 4] = newLine[1];
            newGrid[col + 8] = newLine[2];
            newGrid[col + 12] = newLine[3];
            if (!arraysEqual(line, newLine)) moved = true;
        }
    }

    grid = newGrid;
    if (moved) {
        addRandomTile();
        updateBoard();
    }

    if (!canMove()) {
        alert("Игра окончена! Нет возможных ходов.");
    }
}

// Сдвиг плиток в строке
function slideLine(line, direction) {
    if (direction === 'right' || direction === 'down') line = line.reverse();

    let newLine = line.filter(val => val !== 0);
    for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
            newLine[i] *= 2;
            score += newLine[i];
            newLine.splice(i + 1, 1);
        }
    }
    newLine = [...newLine, ...Array(4 - newLine.length).fill(0)];

    if (direction === 'right' || direction === 'down') newLine = newLine.reverse();

    return newLine;
}

// Сравнение двух массивов
function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// Проверка, можно ли сделать хотя бы один ход
function canMove() {
    // Проверка всех возможных движений
    for (let row = 0; row < 4; row++) {
        const line = grid.slice(row * 4, row * 4 + 4);
        if (canSlideLine(line)) return true;
    }
    for (let col = 0; col < 4; col++) {
        const line = [grid[col], grid[col + 4], grid[col + 8], grid[col + 12]];
        if (canSlideLine(line)) return true;
    }
    return false;
}

// Проверка, можно ли сдвигать плитки в строке или колонке
function canSlideLine(line) {
    // Проверяем, можно ли сдвигать или объединять плитки
    for (let i = 0; i < line.length - 1; i++) {
        if (line[i] === 0 || line[i] === line[i + 1]) {
            return true;
        }
    }
    return false;
}

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        move('up');
    } else if (e.key === 'ArrowDown') {
        move('down');
    } else if (e.key === 'ArrowLeft') {
        move('left');
    } else if (e.key === 'ArrowRight') {
        move('right');
    }
});


// Авторизация
function authorization(){
    login_password_container.classList.remove('hidden-element');

    let button_accept = document.getElementById("button-accept-authorization");
    button_accept.classList.remove('hidden-element');

    let button = document.getElementById("button-authorization");
    button.classList.add('hidden-element');
}

function acceptAuthorization(){
    let in_login = document.getElementById("input-login");
    let in_password = document.getElementById("input-password");

    login = in_login.value;
    password = in_password.value;

    let obj = {
        login: in_login.value,
        password: in_password.value
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/user/getIdByLoginPassword", false);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(obj));

    let s = JSON.stringify(JSON.parse(xhr.response).id);
    id_user = JSON.parse(s);

    let id_obj = {id: id_user};

    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:8080/user/loadUser", false);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.send(JSON.stringify(id_obj));
    console.log(JSON.parse(req.response));

    username = JSON.parse(req.response).name;
    usersurname = JSON.parse(req.response).surname;
    record = JSON.parse(req.response).score;


    login_password_container.classList.add('hidden-element');
    authorization_container.classList.add('hidden-element');
    all_users_container.classList.add('hidden-element');
    add_user_container.classList.add('hidden-element');
    deleting_container.classList.add('hidden-element');


    let button_accept = document.getElementById("button-accept-authorization");
    button_accept.classList.add('hidden-element');

    let button = document.getElementById("button-authorization");
    button.classList.remove('hidden-element');

    game_container.classList.remove('hidden-element');

    startGame();
}


// Удаление пользователя
function deleting(){
    login_password_container.classList.remove('hidden-element');

    let button_accept = document.getElementById("button-accept-deleting");
    button_accept.classList.remove('hidden-element');

    let button = document.getElementById("button-deleting");
    button.classList.add('hidden-element');
}

function acceptDeleting(){
    let in_login = document.getElementById("input-login");
    let in_password = document.getElementById("input-password");

    login = in_login.value;
    password = in_password.value;

    let obj = {
        login: in_login.value,
        password: in_password.value
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/user/getIdByLoginPassword", false);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(obj));

    let s = JSON.stringify(JSON.parse(xhr.response).id);
    let user = JSON.parse(s);

    let id_obj = {id: user};

    console.log(JSON.stringify(id_obj));

    let req = new XMLHttpRequest();
    req.open("DELETE", "http://localhost:8080/user/deleteUser", false);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.send(JSON.stringify(id_obj));
    console.log(JSON.parse(req.status));

    login_password_container.classList.add('hidden-element');

    let button_accept = document.getElementById("button-accept-deleting");
    button_accept.classList.add('hidden-element');

    let button = document.getElementById("button-deleting");
    button.classList.remove('hidden-element');
}

// Добавление пользователя
function addUser(){
    login_password_container.classList.remove('hidden-element');
    name_surname_container.classList.remove('hidden-element');

    let button_accept = document.getElementById("button-accept-adding");
    button_accept.classList.remove('hidden-element');

    let button = document.getElementById("button-adding");
    button.classList.add('hidden-element');
}

function acceptAdding(){
    let in_login = document.getElementById("input-login");
    let in_password = document.getElementById("input-password");
    let in_name = document.getElementById("input-name");
    let in_surname = document.getElementById("input-surname");

    let obj = {
        login: in_login.value,
        password: in_password.value,
        name: in_name.value,
        surname: in_surname.value,
        score: 0
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/user/addUser", false);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    console.log(JSON.stringify(obj));
    xhr.send(JSON.stringify(obj));

    if(xhr.status < 400){
        alert("Пользователь добавлен, его id = " + JSON.parse(xhr.responseText));
    }

    login_password_container.classList.add('hidden-element');
    name_surname_container.classList.add('hidden-element');

    let button_accept = document.getElementById("button-accept-adding");
    button_accept.classList.add('hidden-element');

    let button = document.getElementById("button-adding");
    button.classList.remove('hidden-element');
}

// При нажатии на кнопку "показать всех пользователей" выдадут логины
function getAllUsers(){
    let req = new XMLHttpRequest();
    req.open("GET","http://localhost:8080/user/getAllUsers",false);
    req.send(null);
    console.log(req.responseText);

    div_all_users.textContent = JSON.stringify(JSON.parse(req.responseText));
}


// Изменение имени и фамилии
function editName(){
    let button = document.getElementById("button-editing");
    button.classList.add('hidden-element');

    let button_accept = document.getElementById("button-accept-editing");
    button_accept.classList.remove('hidden-element');

    name_surname_container.classList.remove('hidden-element');
}

function acceptEditingName(){
    let button = document.getElementById("button-editing");
    button.classList.remove('hidden-element');

    let button_accept = document.getElementById("button-accept-editing");
    button_accept.classList.add('hidden-element');

    name_surname_container.classList.add('hidden-element');

    let in_name = document.getElementById("input-name");
    let in_surname = document.getElementById("input-surname");

    username = in_name.value;
    usersurname = in_surname.value;
    nameDisplay.textContent = `Name: ${username}`;
    surnameDisplay.textContent = `Surname: ${usersurname}`;

    let obj = {
        id: id_user,
        login: login,
        password: password,
        name: username,
        surname: usersurname,
        score: record
    };

    let req = new XMLHttpRequest();
    req.open("POST", "http://localhost:8080/user/editUser", false);
    req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    req.send(JSON.stringify(obj));
    console.log(JSON.parse(req.status));


    if(JSON.parse(req.status) < 400){
        alert("Изменения сохранены");
    }
}