export module Day_06 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_06/input.txt', 'utf8');

  const initialFish: number[] = input
    .split(',')
    .map((n: string) => parseInt(n))
    .filter((n: number) => !isNaN(n));

  const simulate = (days: number) => {
    const school = Array(9)
      .fill(0)
      .map((_, age) => initialFish.filter((a) => a === age).length);

    for (let day = 0; day < days; day++) {
      const newFish = school.shift();
      school[6] += newFish;
      school[8] = newFish;
    }

    return school.reduce((acc, val) => acc + val);
  };

  /**
   * PART 1
   */
  const Part1 = () => {
    const lanternfish = simulate(80);
    console.log(`After 80 days there are ${lanternfish} lanternfish`);
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const lanternfish = simulate(256);
    console.log(`After 256 days there are ${lanternfish} lanternfish`);
  };

  Part2();
}
