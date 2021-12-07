export module Day_07 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_07/input.txt', 'utf8');

  const crabs: number[] = input.split(',').map((n) => parseInt(n));

  /**
   * PART 1
   */
  const Part1 = () => {
    const align = (target: number): number => {
      return crabs
        .map((crab) => Math.abs(crab - target))
        .reduce((acc: number, val: number) => acc + val, 0);
    };

    const attempt = [...Array(Math.max(...crabs)).keys()].reduce(
      (acc, position) => {
        const fuel = align(position);
        return acc.position === -1 || fuel < acc.fuel
          ? { position, fuel }
          : acc;
      },
      { position: -1, fuel: 0 }
    );

    console.log(
      `The best position for the crabs to align to is ${attempt.position} (${attempt.fuel} fuel)`
    );
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const align = (target: number): number => {
      return crabs
        .map((crab) => usage(Math.abs(crab - target)))
        .reduce((acc: number, val: number) => acc + val, 0);
    };

    const usage = (steps) => {
      let fuel = 0;
      for (let i = 0; i <= steps; i++) fuel = fuel + 1 * i;
      return fuel;
    };

    const attempt = [...Array(Math.max(...crabs)).keys()].reduce(
      (acc, position) => {
        const fuel = align(position);
        return acc.position === -1 || fuel < acc.fuel
          ? { position, fuel }
          : acc;
      },
      { position: -1, fuel: 0 }
    );

    console.log(
      `The new best position for the crabs to align to is ${attempt.position} (${attempt.fuel} fuel)`
    );
  };

  Part2();
}
