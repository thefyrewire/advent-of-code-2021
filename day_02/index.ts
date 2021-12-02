export module Day_02 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_02/input.txt', 'utf8');

  interface Instruction {
    direction: string;
    value: number;
  }

  interface Part1Result {
    horizontal: number;
    depth: number;
  }

  interface Part2Result {
    horizontal: number;
    depth: number;
    aim: number;
  }

  const instructions: Instruction[] = input.split('\r\n').map((i: string) => {
    const [direction, value] = i.split(' ');
    return { direction, value: parseInt(value) };
  });

  /**
   * PART 1
   */
  const part1 = instructions.reduce(
    ({ horizontal, depth }, { direction, value }) => {
      switch (direction) {
        case 'forward':
          horizontal += value;
          break;
        case 'down':
          depth += value;
          break;
        case 'up':
          depth -= value;
          break;
      }
      return { horizontal, depth };
    },
    { horizontal: 0, depth: 0 } as Part1Result
  );

  console.log(
    `Multiplying the horizontal position and depth gives: ${
      part1.horizontal * part1.depth
    }`
  );

  /**
   * PART 2
   */
  const part2 = instructions.reduce(
    ({ horizontal, depth, aim }, { direction, value }) => {
      switch (direction) {
        case 'down':
          aim += value;
          break;
        case 'up':
          aim -= value;
          break;
        case 'forward':
          horizontal += value;
          depth += aim * value;
          break;
      }
      return { horizontal, depth, aim };
    },
    { horizontal: 0, depth: 0, aim: 0 } as Part2Result
  );

  console.log(
    `Multiplying the newly calculated horizontal position and depth gives: ${
      part2.horizontal * part2.depth
    }`
  );
}
