export module Day_04 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_04/input.txt', 'utf8');

  type Row = (number | null)[];
  type Board = Row[];

  const [rawNumbers, ...rawLines]: string[] = input.split('\r\n');

  const numbers = rawNumbers.split(',').map((l) => parseInt(l.trim()));

  const boards: Board[] = rawLines.reduce((acc, val) => {
    if (val.length === 0) return [...acc, []];
    return acc.map((board, i) =>
      i === acc.length - 1
        ? [
            ...board,
            val
              .split(' ')
              .map((c) => c.trim())
              .filter((c) => c.length > 0)
              .map((c) => parseInt(c)),
          ]
        : board
    );
  }, []);

  const checkComplete = (board: Board): boolean => {
    const complete = (row: Row) => row.every((n) => n === null);
    const rowDone = board.some((row) => complete(row));
    const colDone = [...Array(board.length).keys()]
      .filter((n) => n < board.length)
      .map((i) => board.map((row) => row[i]))
      .some((row) => complete(row));
    return rowDone || colDone;
  };

  const results = numbers.reduce(
    (acc, val) => {
      const boards = acc.boards.map((board) =>
        board.map((row) => row.map((n) => (n === val ? null : n)))
      );
      const results = boards
        .filter((board) => checkComplete(board))
        .map(
          (board) =>
            board
              .flat()
              .filter((n) => n !== null)
              .reduce((a, v) => a + v, 0) * val
        );
      return {
        boards: boards.filter((board) => !checkComplete(board)),
        results: acc.results.concat(results),
      };
    },
    { boards: boards, results: [] }
  ).results;

  /**
   * PART 1
   */
  const Part1 = () => {
    const [score] = results;
    console.log(`The score of the first winning board is: ${score}`);
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const lastScore = results[results.length - 1];
    console.log(`The score of the last winning board is: ${lastScore}`);
  };

  Part2();
}
