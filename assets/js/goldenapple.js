let goldenApple = {
    x: (CANVAS_SIZE - 1) * CELL_SIZE,
    y: (CANVAS_SIZE - 1) * CELL_SIZE,

    color: 'yellow'
};

function getRandomIntGolden(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomizeGoldenApple() {
    goldenApple.x = getRandomIntGolden(0, CANVAS_SIZE) * CELL_SIZE;
    goldenApple.y = getRandomIntGolden(0, CANVAS_SIZE) * CELL_SIZE;
}