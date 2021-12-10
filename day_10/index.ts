export module Day_10 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_10/input.txt', 'utf8').split('\r\n');

  /**
   * PART 1
   */
  const Part1 = () => {
    const CHARMAP = {
      ')': { open: '(', points: 3 },
      ']': { open: '[', points: 57 },
      '}': { open: '{', points: 1197 },
      '>': { open: '<', points: 25137 },
    };

    const isClose = (input) => Object.keys(CHARMAP).indexOf(input) !== -1;

    const points = input.reduce((acc, input) => {
      const openers = [];
      for (const c of input.split('')) {
        if (isClose(c)) {
          const lastOpener = openers.pop();
          const closer = CHARMAP[c];
          if (lastOpener !== closer.open) {
            acc += closer.points;
            break;
          }
        } else {
          openers.push(c);
        }
      }
      return acc;
    }, 0);

    console.log(
      `The total syntax error score for all the corrupted lines is: ${points}`
    );
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const CHARMAP = {
      ')': { open: '(', points: 1 },
      ']': { open: '[', points: 2 },
      '}': { open: '{', points: 3 },
      '>': { open: '<', points: 4 },
    };

    const isClose = (input) => Object.keys(CHARMAP).indexOf(input) !== -1;

    const incomplete: string[] = input.filter((input) => {
      const openers = [];
      for (const c of input.split('')) {
        if (isClose(c)) {
          const lastOpener = openers.pop();
          const closer = CHARMAP[c];
          if (lastOpener !== closer.open) {
            return false;
          }
        } else {
          openers.push(c);
        }
      }
      return true;
    });

    const pairs = Object.entries(CHARMAP).map(([k, v]) => `${v.open}${k}`);

    const hasPair = (input: string): boolean =>
      pairs.some((pair) => input.includes(pair));

    const filterPair = (input: string): string =>
      input.replace(/(\[\]|\(\)|\{\}|\<\>)/gm, '');

    const reverseCloses = (input: string): string[] =>
      input
        .split('')
        .reverse()
        .map((c) => Object.entries(CHARMAP).find(([k, v]) => v.open === c)[0]);

    const scores = incomplete.reduce((acc, input) => {
      while (hasPair(input)) {
        input = filterPair(input);
      }
      const closers = reverseCloses(input);
      const score: number = closers.reduce(
        (acc, val) => acc * 5 + CHARMAP[val].points,
        0
      );
      return [...acc, score];
    }, [] as number[]);

    scores.sort((a, b) => a - b);

    const middleScore = scores[Math.floor(scores.length / 2)];

    console.log(
      `The middle score of all calculated autocompleted lines is: ${middleScore}`
    );
  };

  Part2();
}
