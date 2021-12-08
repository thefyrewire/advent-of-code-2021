export module Day_08 {
  const fs = require('fs');

  const input = fs
    .readFileSync('./day_08/input.txt', 'utf8')
    .split('\r\n')
    .filter((l: string) => l.length > 0);

  const data: string[][] = input.map((line) => line.split(' | '));

  /**
   * PART 1
   */
  const Part1 = () => {
    const SEGMENT = {
      0: 6,
      1: 2,
      2: 5,
      3: 5,
      4: 4,
      5: 5,
      6: 6,
      7: 3,
      8: 7,
      9: 6,
    };

    const values = data.flatMap(([sig, val]) =>
      val
        .split(' ')
        .filter(
          (v) =>
            v.length === SEGMENT[1] ||
            v.length === SEGMENT[4] ||
            v.length === SEGMENT[7] ||
            v.length === SEGMENT[8]
        )
    );

    console.log(
      `In the output values, the digits 1, 4, 7 and 8 appear ${values.length} times`
    );
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    // seven-segment patterns of each number
    const SEGMENTMAP = {
      abcefg: 0,
      cf: 1,
      acdeg: 2,
      acdfg: 3,
      bcdf: 4,
      abdfg: 5,
      abdefg: 6,
      acf: 7,
      abcdefg: 8,
      abcdfg: 9,
    };

    const result = data.map(([sig, val]) => {
      const clues = sig.split(' ').map((l) => l.split(''));

      // compare 1 and 7 to deduce a
      const n1 = clues.find((s) => s.length === 2);
      const n7 = clues.find((s) => s.length === 3);

      const [a] = n7.filter((l) => n1.every((c) => c !== l));

      const letters = Object.entries(
        clues
          .flat()
          .reduce((acc, val) => ({ ...acc, [val]: (acc[val] || 0) + 1 }), {})
      );

      // deduce letters by total count across all numbers
      const remap = letters.reduce((acc, [pos, count]) => {
        switch (count) {
          case 6:
            return { ...acc, [pos]: 'b' };
          case 8:
            if (pos === a) return { ...acc, [pos]: 'a' };
            return { ...acc, [pos]: 'c' };
          case 4:
            return { ...acc, [pos]: 'e' };
          case 9:
            return { ...acc, [pos]: 'f' };
          default:
            return acc;
        }
      }, {});

      // use 4 to find d
      const n4 = clues.find((s) => s.length === 4);

      const reversemap = Object.fromEntries(
        Object.entries(remap).map(([a, b]) => [b, a])
      );

      const [d] = n4.filter((l) =>
        [reversemap.b, reversemap.c, reversemap.f].every((c) => c !== l)
      );
      remap[d] = 'd';

      // find the last remaining letter g
      const [g] = 'abcdefg'
        .split('')
        .filter((l) => Object.keys(remap).every((c) => c !== l));
      remap[g] = 'g';

      const mapped = val
        .split(' ')
        .map((num) =>
          num
            .split('')
            .map((c) => remap[c])
            .sort((a, b) => (a > b ? 1 : -1))
            .join('')
        )
        .map((key) => SEGMENTMAP[key])
        .join('');

      const parsed = parseInt(mapped);

      return parsed;
    });

    const sum = result.reduce((acc, val) => acc + val, 0);

    console.log(`The total sum of the decoded output values is: ${sum}`);
  };

  Part2();
}
