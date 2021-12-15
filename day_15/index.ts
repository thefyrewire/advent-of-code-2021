export module Day_15 {
  const fs = require('fs');

  const input: string[] = fs
    .readFileSync('./day_15/input.txt', 'utf8')
    .split('\r\n');

  type Row = number[];
  type Grid = Row[];

  const grid: Grid = input
    .map((row) => row.split('').map((n) => parseInt(n)))
    .filter((r) => r.length > 0);

  /**
   * PART 1
   */
  const Part1 = () => {
    const calculateRisk = (grid: Grid) => {
      const scores: number[][] = [...Array(grid.length)].map((_) =>
        [...Array(grid[0].length)].map((_) => Infinity)
      );

      const x = grid[0].length - 1;
      const y = grid.length - 1;
      scores[y][x] = grid[y][x];

      const bestScore = [];

      const move = (x: number, y: number) => {
        if (grid[y]?.[x] === undefined) return;

        const neighbours = [
          { x, y: y - 1 },
          { x: x - 1, y },
          { x, y: y + 1 },
          { x: x + 1, y },
        ];

        let risk = Math.min(
          ...neighbours.map(({ x, y }) => scores[y]?.[x] ?? Infinity)
        );

        if (x === 0 && y === 0) {
          bestScore.push(risk);
        }

        risk = risk + grid[y][x];

        if (risk < scores[y][x]) {
          scores[y][x] = risk;
          move(x - 1, y);
          move(x, y - 1);
        }
      };

      move(x - 1, y);
      move(x, y - 1);

      return Math.min(...bestScore);
    };

    const risk = calculateRisk(grid);
    console.log(`The lowest risk path has a risk level of: ${risk}`);
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const calculateRisk = (grid: Grid) => {
      const scores: number[][] = [...Array(grid.length)].map((_) =>
        [...Array(grid[0].length)].map((_) => Infinity)
      );

      scores[0][0] = 0;
      grid[0][0] = 0;

      let bestScore = [];

      while (JSON.stringify(scores) !== JSON.stringify(bestScore)) {
        bestScore = scores.map((row) => [...row]);
        for (let x = 0; x < grid[0].length; x++) {
          for (let y = 0; y < grid.length; y++) {
            if (x === 0 && y === 0) continue;
            const neighbours = [
              { x, y: y - 1 },
              { x: x - 1, y },
              { x, y: y + 1 },
              { x: x + 1, y },
            ];
            scores[y][x] =
              Math.min(
                ...neighbours.map(({ x, y }) => scores[y]?.[x] ?? Infinity)
              ) + grid[y][x];
          }
        }
      }

      const score = scores[grid.length - 1][grid[0].length - 1];
      return score;
    };

    const scaleGrid = (grid: Grid) => {
      const hGrid = grid.map((row) => {
        return [
          row,
          ...[...Array(4).keys()].map((_, i) =>
            row.map((n) => n + i * 1 + 1).map((n) => (n % 9 === 0 ? 9 : n % 9))
          ),
        ].flat();
      });

      const vGrid = [...Array(hGrid.length + 2).keys()].reduce((acc, i) => {
        return [
          ...acc,
          ...hGrid.map((row) =>
            row.map((n) => n + i * 1 + 1).map((n) => (n % 9 === 0 ? 9 : n % 9))
          ),
        ];
      }, hGrid);

      return vGrid.slice(0, grid.length * 5);
    };

    const risk = calculateRisk(scaleGrid(grid));
    console.log(
      `The lowest risk path on the expanded map has a risk level of: ${risk}`
    );
  };

  Part2();
}
