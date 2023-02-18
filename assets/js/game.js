Window.Game = {};
(function (Game) {
    // Grab the canvas, which is the part of the screen the game is played in
    let canvas = document.getElementById('game');
    // Retrieve the context of the canvas html element, compare it to taking the image data from an image
    let context = canvas.getContext('2d');
    let scoreText = document.getElementById('score');
    
    // Startup values
    let frameCounter = 0;
    let acceptInput = true;
    let score = 0;
    let pauze = false;
    let chancesSpawnApple = 0;
    const SPAWN_NORMAL_APPLE_CHANCE = 9;
    let eaten = 0;
    let SPEED_THRESHOLD = 5;

    // Limits the game speed by reducing the rate at which frames are drawn
    let frameCounterLimit = 40;

    // Set the canvas height and width
    canvas.height = canvas.width = CANVAS_SIZE * CELL_SIZE;

    // Game loop
    function loop() {
        // Lets the browser decide when its best to render the game
        requestAnimationFrame(loop);

        // Limits the framerate to reduce game speed
        if (++frameCounter < frameCounterLimit) {
            return
        }

        frameCounter = 0;
        acceptInput = true;

        // Empty the entire canvas before redrawing all elements
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Modify the snake's currect x and y values by their directional offsets
        if(!pauze)
        {
            snake.x += snake.dx;
            snake.y += snake.dy;
        }

        // Draw the apple
        drawApples();

        // Loop over each part of the snake to draw it for the next frame and check for collision with itself
        moveSnake();

        // Checks if the snake has reached edge of the screen
        checkEdgeCollision();   
    }

    function checkEdgeCollision() {
        // Check horizontal edges
        if (snake.x < 0 || snake.x >= canvas.width) {
            pauze = true;
            resetGame();
            GameOver();
            resetScore();
            resetSpeed();
            resetColor();
        }
        // Check vertical edges
        if (snake.y < 0 || snake.y >= canvas.height) {
            resetGame();
            GameOver();
            resetScore();
            resetSpeed();
            resetColor();
        }
    }
    
    function GameOver() {
        if (pauze = true) {
        Window.Utils.CreateModal("Game over","You scored: <i>"+score+"</i> points");
        }
    }

    function resetGame() {
        Window.Utils.DismissModal();
        resetSnake();
        randomizeApple();
        pauze = false;
    }

      Game.Reset = resetGame;

    function resetScore() {
        score = 0;
        updateScore();
    }

    function resetSpeed() {
        frameCounterLimit = 40;
    }

    function resetColor() {
        snake.color = 'green';
    }

    // Increase the length of the snake and place the apple at a new location
    function eatApple() {
        snake.length++;
        score++;
        eaten++;
        // Update the score text
        updateScore();
        snake.color = getRandomColor();
        calculateChances();
        // Place a new apple on a random location in the canvas
        randomizeApple();
        randomizeGoldenApple();
    }

    function eatGoldenApple() {
        snake.length++;
        score += 3;
        eaten++;
        // Update the score text
        updateScore();
        snake.color = getRandomColor();
        calculateChances();
        // Place a new apple on a random location in the canvas
        randomizeApple();
        randomizeGoldenApple();
    }

    // Updates the score text
    function updateScore() {
        scoreText.textContent = 'Score: ' + score;
        encreaseSpeed();
    }

    function encreaseSpeed() {
        while (eaten <= 40 && eaten !== 1 && eaten % SPEED_THRESHOLD === 0) {
            frameCounterLimit -= 4;
            return;
        }
    }
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var newColor = '#';
        for (var i = 0; i < 6; i++) {
          newColor += letters[Math.floor(Math.random() * 16)];
        }
        return newColor;
      }
    
    function calculateChances() {
        chancesSpawnApple = Math.round(Math.random() * 10);
    }

    // Draws the apple on the screen
    function drawApples() { 
            if (chancesSpawnApple <= SPAWN_NORMAL_APPLE_CHANCE) {
                context.fillStyle = apple.color;
                context.fillRect(apple.x, apple.y, CELL_SIZE - 1, CELL_SIZE - 1);
                return;
        }  
            context.fillStyle = goldenApple.color;
            context.fillRect(goldenApple.x, goldenApple.y, CELL_SIZE - 1, CELL_SIZE - 1);
    }

    // Handles movement, collision and drawing of the snake
    function moveSnake() {
        // Keep track of where snake has been, the front of the array is always the head
        snake.cells.unshift({ x: snake.x, y: snake.y });

        // Remove cells as we move away from them
        if (snake.cells.length > snake.length) {
            snake.cells.pop();
        }

        function resetSpeed() {
            frameCounterLimit = 40;
        }
    
        // Draw each of the snake's cells
        snake.cells.forEach(function (cell, index) {
            // Set the snake's color
            context.fillStyle = snake.color;
        
            // A cell is a piece of the snake, and the index and the index defines the position in the snake
            context.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);

            // Check if the snake eats an apple
            if (cell.x === apple.x && cell.y === apple.y) {
                eatApple();
            }

            if (cell.x === goldenApple.x && cell.y === goldenApple.y) {
                eatGoldenApple();
            }
            // Check for collision with all cells after the current one to see if the snake collides with itself
            for (var i = index + 1; i < snake.cells.length; i++) {
                // Snake has collided with itself
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y && !pauze) {
                    resetGame();
                    GameOver();
                    resetScore();
                    resetSpeed();
                    resetColor();
                }
            }
        });
    }

    // Listens to keyboard events, used to control the snake
    document.addEventListener('keydown', function (keyBoardEvent) {
        if (false === acceptInput) {
            return;
        }

        // Change direction when the left arrow key is pressed and is not moving on the X axis
        if (keyBoardEvent.which === KEY_LEFT && snake.dx === 0) {
            snake.dx = -CELL_SIZE;
            snake.dy = 0;
            acceptInput = false;
        }
        else if (keyBoardEvent.which === KEY_RIGHT && snake.dx === 0) {
            snake.dx = +CELL_SIZE;
            snake.dy = 0;
            acceptInput = false;
        }
        // Change direction when the up arrow key is pressed and is not moving on the Y axis
        else if (keyBoardEvent.which === KEY_UP && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = -CELL_SIZE;
            acceptInput = false;
        }
        else if (keyBoardEvent.which === KEY_DOWN && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = +CELL_SIZE;
            acceptInput = false;
        }
    });

    // Starts the game
    requestAnimationFrame(loop);
})(Window.Game);