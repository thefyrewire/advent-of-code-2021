export module Day_11 {
  const fs = require('fs');

  const input: string[] = fs
    .readFileSync('./day_11/input.txt', 'utf8')
    .split('\r\n');

  type Row = number[];
  type Grid = Row[];

  const octopuses: Grid = input
    .map((row) =>
      row
        .split('')
        .map((n) => parseInt(n))
        .filter((n) => !isNaN(n))
    )
    .filter((r) => r.length > 0);

  const flashAroundPoint = (grid: Grid, x: number, y: number) => {
    for (let row = x - 1; row <= x + 1; row++) {
      if (row >= 0 && row < grid[0].length) {
        for (let col = y - 1; col <= y + 1; col++) {
          if (col >= 0 && col < grid.length) {
            if (!(row == x && col == y)) {
              grid[col][row]++;
            }
          }
        }
      }
    }
  };

  const checkFlash = (grid: Grid, flashed = new Set<string>()) => {
    let start = flashed.size;

    do {
      start = flashed.size;
      grid.forEach((row, x) => {
        row.forEach((col, y) => {
          const key = `${x},${y}`;
          if (col <= 9 || flashed.has(key)) return;
          flashed.add(key);
          flashAroundPoint(grid, y, x);
        });
      });
    } while (start !== flashed.size);

    grid.forEach((row, x) => {
      row.forEach((col, y) => {
        if (col > 9) {
          grid[x][y] = 0;
        }
      });
    });

    return { grid, flashed: flashed.size };
  };

  /**
   * PART 1
   */
  const Part1 = () => {
    const flashed = [...Array(100)].reduce(
      (acc) => {
        const increment = acc.grid.map((row) => row.map((n) => n + 1));
        const dumbos = checkFlash(increment);
        return {
          grid: dumbos.grid,
          flashed: acc.flashed + dumbos.flashed,
        };
      },
      { grid: octopuses, flashed: 0 }
    ).flashed;

    console.log(`There are a total of ${flashed} flashes after 100 steps`);
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    let steps = 0;
    let state = { grid: octopuses, flashed: 0 };

    while (state.flashed < 100) {
      steps++;
      const increment = state.grid.map((row) => row.map((n) => n + 1));
      state = checkFlash(increment);
    }

    console.log(
      `The dumbo octopuses all synchronise flashes after ${steps} steps`
    );
  };

  Part2();
}
