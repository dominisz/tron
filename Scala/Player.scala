import scala.io.StdIn

object Player extends App {

  private val GridWidth = 30
  private val GrigHeight = 20
  private val EmptyCell = -1
  private val NoCoordinate = -1
  private val MarriageAdventure = "Marriage is an adventure, like going to war."

  val player = new Player()
  player.gameLoop
}

class Player(var playerX: Int, var playerY: Int) {

  import Player._

  private val Grid = Array.fill(GridWidth, GrigHeight)(EmptyCell)

  def this() = this(0, 0)

  private def gameLoop = while (true) {
    inputForARound()
    println(chooseMove)
  }

  private def inputForARound() = {
    val Array(numberOfPlayers, myPlayer) = StdIn.readLine.split(" ").map(_.toInt)

    (0 until numberOfPlayers).foreach { i =>
      val Array(x0, y0, x1, y1) = StdIn.readLine.split(" ").map(_.toInt)

      if (x0 != NoCoordinate && y0 != NoCoordinate) {
        Grid(x0)(y0) = i
        Grid(x1)(y1) = i
      }

      if (i == myPlayer) {
        playerX = x1
        playerY = y1
      }
    }
  }

  private def chooseMove = Moves.All.find(moveAllowed).map(_.name).getOrElse(MarriageAdventure)

  private def moveAllowed(move: Moves.Move): Boolean = {
    playerX + move.deltaX >= 0 &&
      playerX + move.deltaX < GridWidth &&
      playerY + move.deltaY >= 0 && playerY + move.deltaY < GrigHeight &&
      Grid(playerX + move.deltaX)(playerY + move.deltaY) == EmptyCell
  }

}

object Moves {

  class Move(val deltaX: Int, val deltaY: Int, val name: String)

  case object Left extends Move(-1, 0, "LEFT")

  case object Right extends Move(1, 0, "RIGHT")

  case object Up extends Move(0, -1, "UP")

  case object Down extends Move(0, 1, "DOWN")

  val All: Seq[Move] = Seq(Left, Right, Up, Down)
}
