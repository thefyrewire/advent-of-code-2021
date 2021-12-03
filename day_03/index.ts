export module Day_03 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_03/input.txt', 'utf8');

  const numbers: string[] = input.split('\r\n').map((i: string) => i);

  const bitsByIndex: Record<number, number[]> = [];
  numbers.forEach((line) => {
    const bits = line.split('').map((b) => parseInt(b));
    bits.forEach((bit, i) => {
      if (bitsByIndex[i]) bitsByIndex[i].push(bit);
      else bitsByIndex[i] = [bit];
    });
  });

  /**
   * PART 1
   */
  const Part1 = () => {
    const grouped = Object.values(bitsByIndex).map((b: number[]) => {
      const bit0 = b.filter((bit) => bit === 0).length;
      const bit1 = b.filter((bit) => bit === 1).length;
      return { gamma: bit0 > bit1 ? 0 : 1, epsilon: bit1 > bit0 ? 0 : 1 };
    });

    const gamma = parseInt(
      grouped.reduce((acc, val) => `${acc}${val.gamma}`, ''),
      2
    );
    const epsilon = parseInt(
      grouped.reduce((acc, val) => `${acc}${val.epsilon}`, ''),
      2
    );

    console.log(`The power consumption rate is: ${gamma * epsilon}`);
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const oxygenNumbers = numbers.reduce((acc, val, i) => {
      if (acc.length === 1) return acc;
      const bit0 = acc.filter((l) => parseInt(l.charAt(i)) === 0).length;
      const bit1 = acc.filter((l) => parseInt(l.charAt(i)) === 1).length;
      const mostCommonBit = bit1 >= bit0 ? 1 : 0;
      return acc.filter((l) => parseInt(l.charAt(i)) === mostCommonBit);
    }, numbers);

    const co2Numbers = numbers.reduce((acc, val, i) => {
      if (acc.length === 1) return acc;
      const bit0 = acc.filter((l) => parseInt(l.charAt(i)) === 0).length;
      const bit1 = acc.filter((l) => parseInt(l.charAt(i)) === 1).length;
      const leastCommonBit = bit0 <= bit1 ? 0 : 1;
      return acc.filter((l) => parseInt(l.charAt(i)) === leastCommonBit);
    }, numbers);

    const oxygen = parseInt(oxygenNumbers[0], 2);
    const co2 = parseInt(co2Numbers[0], 2);

    console.log(`The life support rating is: ${oxygen * co2}`);
  };

  Part2();
}
