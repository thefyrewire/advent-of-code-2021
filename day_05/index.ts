export module Day_05 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_05/input.txt', 'utf8');

  interface Grid {
    [coords: string]: number;
  }

  type Point = number[];
  type Line = Point[];

  const lines: Line[] = input
    .split('\r\n')
    .map((line) =>
      line
        .split(' -> ')
        .map((coords) =>
          coords
            .split(',')
            .map((n) => parseInt(n))
            .filter((n) => !isNaN(n))
        )
        .filter((n) => n.length > 0)
    )
    .filter((n) => n.length > 0);

  const interpolateToPoints = (line: Line, diagonals = false): Point[] => {
    const isDiagonal = line[0][0] !== line[1][0] && line[0][1] !== line[1][1];
    if (!diagonals && isDiagonal) return null;

    const deltaX = Math.sign(line[1][0] - line[0][0]);
    const deltaY = Math.sign(line[1][1] - line[0][1]);

    let [x, y] = [null, null];
    let points = [];

    while (x !== line[1][0] || y !== line[1][1]) {
      x = (x ?? line[0][0] - deltaX) + deltaX;
      y = (y ?? line[0][1] - deltaY) + deltaY;
      points.push([x, y]);
    }

    return points;
  };

  const generateGrid = (diagonals = false): Grid => {
    const gridOverlaps = lines.reduce((grid, line) => {
      const points = interpolateToPoints(line, diagonals);
      if (!points) return grid;

      points.forEach(([x, y]) => {
        const coord = `${x}, ${y}`;
        grid[coord] = (grid[coord] ?? 0) + 1;
      });

      return grid;
    }, {} as Grid);

    return gridOverlaps;
  };

  /**
   * PART 1
   */
  const Part1 = () => {
    const grid = generateGrid();
    const overlaps = Object.values(grid).filter((mark) => mark > 1).length;
    console.log(`The number of times lines overlap is: ${overlaps}`);
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const grid = generateGrid(true);
    const overlaps = Object.values(grid).filter((mark) => mark > 1).length;
    console.log(
      `The number of times lines overlap, including diagonal lines, is: ${overlaps}`
    );
  };

  Part2();
}
