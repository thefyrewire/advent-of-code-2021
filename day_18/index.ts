export module Day_18 {
  const fs = require('fs');

  const input: string[] = fs
    .readFileSync('./day_18/input.txt', 'utf8')
    .split('\r\n')
    .filter((l: string) => l.length > 0);

  type SnailfishNumber = (number | number[])[];

  const snailfishNumbers = input.map((l) => JSON.parse(l));

  const getDepth = (arr: number | number[]): number =>
    Array.isArray(arr) ? 1 + Math.max(...arr.map(getDepth)) : 0;

  const explodable = (arr: number[]): boolean => getDepth(arr) > 4;

  const splitable = (arr: number[]): boolean =>
    arr.flat(Infinity).filter((n) => n > 9).length > 0;

  const getExploding = (
    array: number[],
    depth: number,
    exploding: number[]
  ) => {
    if (!Array.isArray(array)) return;

    for (const [index, arr] of array.entries()) {
      if (typeof arr === 'number' || getDepth(arr) !== depth) continue;
      if (depth > 1) getExploding(arr, depth - 1, exploding);
      if (exploding.includes(-1)) {
        exploding[0] = array[index][0];
        exploding[1] = array[index][1];
        array[index] = -1;
      }
    }
  };

  const explode = (array: number[], depth = 4) => {
    const exploding = [-1, -1];
    getExploding(array, depth, exploding);

    let [arrayString, result] = [JSON.stringify(array), ''];

    const arrayNumbers = arrayString.match(/-?\d+/g).map(Number);
    const explodingIndex = arrayNumbers.findIndex((n) => n < 0);

    if (explodingIndex - 1 >= 0)
      arrayNumbers[explodingIndex - 1] += exploding[0];
    if (explodingIndex + 1 < arrayNumbers.length)
      arrayNumbers[explodingIndex + 1] += exploding[1];

    arrayString = arrayString.replace('-1', '*');
    arrayNumbers
      .filter((n) => n >= 0)
      .forEach((n) => {
        const start = /\d+/.exec(arrayString).index;
        let end = start;
        while (Number.isInteger(parseInt(arrayString[end]))) end++;
        result += arrayString.slice(0, start) + n;
        arrayString = arrayString.slice(end);
      });

    JSON.parse((result + arrayString).replace('*', '0')).forEach(
      (n, i) => (array[i] = n)
    );
  };

  let splitDone = false;

  const split = (array: SnailfishNumber | number) => {
    if (!Array.isArray(array)) return;

    for (const [index, val] of array.entries()) {
      if (typeof val === 'number' && val > 9 && !splitDone) {
        array[index] = [Math.floor(val / 2), Math.ceil(val / 2)];
        splitDone = true;
      } else {
        split(val);
      }
    }
  };

  const solve = (a, b) => {
    let arr = [a, b];
    while (true) {
      if (explodable(arr)) explode(arr);
      else if (splitable(arr)) split(arr);
      else break;

      splitDone = false;
    }
    return arr;
  };

  const getMagnitude = (result: SnailfishNumber | number): number => {
    if (typeof result === 'number') return result;
    return 3 * getMagnitude(result[0]) + 2 * getMagnitude(result[1]);
  };

  const addUp = (numbers: SnailfishNumber) => {
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      result = solve(result, numbers[i]);
    }
    return result;
  };

  /**
   * PART 1
   */
  const Part1 = () => {
    const added = addUp(JSON.parse(JSON.stringify(snailfishNumbers)));
    const magnitude = getMagnitude(added);

    console.log(`The magnitude of the final snailfish sum is: ${magnitude}`);
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const magnitudes = [];

    snailfishNumbers.forEach((a, i) => {
      snailfishNumbers.forEach((b, j) => {
        if (i === j) return;
        const added = addUp(JSON.parse(JSON.stringify([a, b])));
        const magnitude = getMagnitude(added);
        magnitudes.push(magnitude);
      });
    });

    const maxMagnitude = Math.max(...magnitudes);

    console.log(
      `The largest magnitude of any sum of two different snailfish numbers is: ${maxMagnitude}`
    );
  };

  Part2();
}
