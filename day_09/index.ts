export module Day_09 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_09/input.txt', 'utf8').split('\r\n');

  type Row = number[];
  type HeightMap = Row[];

  interface Point {
    height: number;
    coords: string;
  }

  const heights: HeightMap = input.map((line) =>
    line.split('').map((n) => parseInt(n))
  );

  const allLowPoints = heights.reduce((acc, row, i) => {
    const lowPoints = row
      .map((point, j) => ({ height: point, coords: `${i},${j}` }))
      .filter(({ height }, j) => {
        const up = heights[i - 1]?.[j];
        const down = heights[i + 1]?.[j];
        const left = row[j - 1];
        const right = row[j + 1];
        return (
          (up === undefined || (up && height < up)) &&
          (down === undefined || (down && height < down)) &&
          (left === undefined || (left && height < left)) &&
          (right === undefined || (right && height < right))
        );
      });
    return [...acc, ...lowPoints];
  }, [] as Point[]);

  /**
   * PART 1
   */
  const Part1 = () => {
    const riskLevels = allLowPoints
      .map(({ height, coords }) => height + 1)
      .reduce((acc, val) => acc + val, 0);

    console.log(
      `The sum of the risk level of all low points on the heightmap is: ${riskLevels}`
    );
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const exploreBasin = ({ height, coords }: Point, basin: Set<string>) => {
      const [row, col] = coords.split(',').map((n) => parseInt(n));

      const up = heights[row - 1]?.[col];
      if (up !== undefined && up !== 9 && up > height) {
        const point = `${row - 1},${col}`;
        basin.add(point);
        exploreBasin({ height: up, coords: point }, basin).forEach((p) =>
          basin.add(p)
        );
      }

      const down = heights[row + 1]?.[col];
      if (down !== undefined && down !== 9 && down > height) {
        const point = `${row + 1},${col}`;
        basin.add(point);
        exploreBasin({ height: down, coords: point }, basin).forEach((p) =>
          basin.add(p)
        );
      }

      const left = heights[row][col - 1];
      if (left !== undefined && left !== 9 && left > height) {
        const point = `${row},${col - 1}`;
        basin.add(point);
        exploreBasin({ height: left, coords: point }, basin).forEach((p) =>
          basin.add(p)
        );
      }

      const right = heights[row][col + 1];
      if (right !== undefined && right !== 9 && right > height) {
        const point = `${row},${col + 1}`;
        basin.add(point);
        exploreBasin({ height: right, coords: point }, basin).forEach((p) =>
          basin.add(p)
        );
      }

      return basin;
    };

    const basinPoints = allLowPoints.map((lowPoint) => {
      const [row, col] = lowPoint.coords.split(',').map((n) => parseInt(n));
      return exploreBasin(lowPoint, new Set([`${row},${col}`]));
    });

    const basins = basinPoints
      .map((b) => b.size)
      .sort((a, b) => b - a)
      .slice(0, 3);

    const result = basins.reduce((acc, val) => acc * val, 1);

    console.log(
      `Multiplying together the sizes of the three largest basins gives: ${result}`
    );
  };

  Part2();
}
