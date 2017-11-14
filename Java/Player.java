import java.util.Scanner;

/**
 * Contest: https://www.codingame.com/multiplayer/bot-programming/tron-battle
 * Repository: https://github.com/dominisz/tron
 **/
class Player {

    private static final int GRID_WIDTH = 30;
    private static final int GRID_HEIGHT = 20;
    private static final int EMPTY_CELL = -1;
    private static final int NO_COORDINATE = -1;
    private static final String MARRIAGE_ADVENTURE = "Marriage is an adventure, like going to war.";

    private static final Move[] FIRST_DOWN = {Move.LEFT, Move.RIGHT, Move.DOWN, Move.UP};
    private static final Move[] FIRST_UP = {Move.LEFT, Move.RIGHT, Move.UP, Move.DOWN};

    private Scanner in;
    private int[][] grid;
    private int numberOfPlayers;
    private int myPlayer;
    private int playerX;
    private int playerY;
    private boolean firstRound = true;
    private Move[] moves;

    public static void main(String args[]) {
        Player player = new Player();
        player.gameLoop();
    }

    private Player() {
        in = new Scanner(System.in);
        initializeGrid();
    }

    private void initializeGrid() {
        grid = new int[GRID_HEIGHT][GRID_WIDTH];

        for (int y = 0; y < GRID_HEIGHT; y++) {
            for (int x = 0; x < GRID_WIDTH; x++) {
                grid[y][x] = EMPTY_CELL;
            }
        }
    }

    private void inputForARound() {
        numberOfPlayers = in.nextInt();
        myPlayer = in.nextInt();

        for (int i = 0; i < numberOfPlayers; i++) {
            int X0 = in.nextInt();
            int Y0 = in.nextInt();
            int X1 = in.nextInt();
            int Y1 = in.nextInt();

            if (X0 != NO_COORDINATE && Y0 != NO_COORDINATE) {
                grid[Y0][X0] = i;
                grid[Y1][X1] = i;
            }

            if (i == myPlayer) {
                playerX = X1;
                playerY = Y1;
            }
        }

        if (firstRound) {
            firstRound = false;
            moves = playerY < GRID_HEIGHT / 2 ? FIRST_DOWN : FIRST_UP;
        }
    }

    private boolean moveAllowed(Move move) {
        return playerX + move.deltaX >= 0 && playerX + move.deltaX < GRID_WIDTH
                && playerY + move.deltaY >= 0 && playerY + move.deltaY < GRID_HEIGHT
                && grid[playerY + move.deltaY][playerX + move.deltaX] == EMPTY_CELL;
    }

    private String chooseMove() {
        for (Move move : moves) {
            if (moveAllowed(move)) {
                return move.name();
            }
        }
        return MARRIAGE_ADVENTURE;
    }

    private void gameLoop() {
        while (true) {
            inputForARound();
            System.out.println(chooseMove());
        }
    }

    private enum Move {

        LEFT(-1, 0),
        RIGHT(1, 0),
        UP(0, -1),
        DOWN(0, 1);

        private int deltaX;
        private int deltaY;

        Move(int deltaX, int deltaY) {
            this.deltaX = deltaX;
            this.deltaY = deltaY;
        }

    }

}