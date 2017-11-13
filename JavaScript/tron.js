class Player {
    constructor(){
        this.GRID_WIDTH = 30;
        this.GRID_HEIGHT = 20;
        this.EMPTY_CELL = -1;
        this.NO_COORDINATE = -1;
        this.MARRIAGE_ADVENTURE = "Marriage is an adventure, like going to war.";

        this.grid;
        this.numberOfPlayers;
        this.myPlayer;

        this.playerX = 0;
        this.playerY = 0;

        this.MoveEnum = {
            LEFT: {deltaX: -1, deltaY: 0},
            RIGHT: {deltaX: 1, deltaY: 0},
            UP: {deltaX: 0, deltaY: -1},
            DOWN: {deltaX: 0, deltaY: 1},
        };

        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = new Array(this.GRID_HEIGHT);
        for (let i = 0; i < this.GRID_HEIGHT; i++) {
            this.grid[i] = new Array(this.GRID_WIDTH);
        }

        for (let y = 0; y < this.GRID_HEIGHT; y++) {
            for (let x = 0; x < this.GRID_WIDTH; x++) {
                this.grid[y][x] = this.EMPTY_CELL;
            }
        }
    }

    gameLoop() {
        while (true) {
            this.inputForARound();
            print(this.chooseMove());
        }
    }

    inputForARound() {
        const playerInput = readline().split(' ').map((x) => parseInt(x, 10));
        this.numberOfPlayers = playerInput[0];
        this.myPlayer = playerInput[1];

        for (let i = 0; i < this.numberOfPlayers; i++) {
            const positionData = readline().split(' ').map((x) => parseInt(x, 10));

            const X0 = positionData[0];
            const Y0 = positionData[1];
            const X1 = positionData[2];
            const Y1 = positionData[3];
            
            if (X0 !== this.NO_COORDINATE && Y0 !== this.NO_COORDINATE) {
                this.grid[Y0][X0] = i;
                this.grid[Y1][X1] = i;
            }

            if (i === this.myPlayer) {
                printErr(`setting pos`)
                this.playerX = X1;
                this.playerY = Y1;
            }            
        }        
    }
    
    moveAllowed(move) {
        return this.playerX + move.deltaX >= 0 && this.playerX + move.deltaX < this.GRID_WIDTH
                && this.playerY + move.deltaY >= 0 && this.playerY + move.deltaY < this.GRID_HEIGHT
                && this.grid[this.playerY + move.deltaY][this.playerX + move.deltaX] === this.EMPTY_CELL;
    }

    chooseMove() {
        for (let moveName in this.MoveEnum) {
            if (this.moveAllowed(this.MoveEnum[moveName])) {
                return moveName;
            }
        }
        return MARRIAGE_ADVENTURE;
    }


    
}

const player = new Player();
player.gameLoop();