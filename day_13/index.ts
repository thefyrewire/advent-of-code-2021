export module Day_13 {
  const fs = require('fs');

  const input: string[] = fs
    .readFileSync('./day_13/input.txt', 'utf8')
    .split('\r\n');

  type Point = number[];
  type Instruction = ['x' | 'y', number];

  const {
    coords,
    instructions,
  }: { coords: Point[]; instructions: Instruction[] } = input.reduce(
    (acc, val) => {
      if (val.length === 0) return { ...acc, swap: true };
      if (!acc.swap)
        return {
          ...acc,
          coords: [...acc.coords, val.split(',').map((n) => parseInt(n))],
        };
      else
        return {
          ...acc,
          instructions: [
            ...acc.instructions,
            val
              .substr(11, val.length)
              .split('=')
              .map((c, i) => (i === 1 ? parseInt(c) : c)),
          ],
        };
    },
    { coords: [], instructions: [], swap: false }
  );

  const foldAxis = (points: Point[], axis: 'x' | 'y', line: number) => {
    const merged = points.map(([x, y]) =>
      axis === 'x' && x > line
        ? [line - (x - line), y]
        : axis === 'y' && y > line
        ? [x, line - (y - line)]
        : [x, y]
    );
    const unique: Point[] = [
      ...new Set<string>(merged.map(([x, y]) => `${x},${y}`)),
    ].map((c) => c.split(',').map((n) => parseInt(n)));
    return unique;
  };

  /**
   * PART 1
   */
  const Part1 = () => {
    const [[axis, line]] = instructions;
    const folded = foldAxis(coords, axis, line);
    console.log(
      `After completing only the first instruction for folding the paper, there are ${folded.length} dots visible`
    );
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const folded: Point[] = instructions.reduce(
      (points, [axis, line]) => foldAxis(points, axis, line),
      coords
    );

    const maxX = Math.max(...folded.map(([x]) => x));
    const maxY = Math.max(...folded.map(([_, y]) => y));

    const graph: string[][] = [...Array(maxY + 1)].map((_) =>
      [...Array(maxX + 1)].map((_) => '.')
    );

    folded.forEach(([x, y]) => (graph[y][x] = '#'));

    // holy moly this is cool!
    console.log(graph.map((l) => l.join(' ')));
  };

  Part2();
}
