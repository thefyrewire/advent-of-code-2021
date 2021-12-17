export module Day_17 {
  const fs = require('fs');

  const input: number[][] = fs
    .readFileSync('./day_17/input.txt', 'utf8')
    .slice(13)
    .split(',')
    .map((l: string) =>
      l
        .trim()
        .slice(2)
        .split('..')
        .map((n) => parseInt(n))
    );

  const [[minX, maxX], [minY, maxY]] = input;

  const rangeX = [...Array(maxX - minX + 1).keys()].map((i) => minX + i);
  const rangeY = [...Array(maxY - minY + 1).keys()].map((i) => minY + i);

  const stepProbe = ({ posX, posY, velX, velY, bestY }) => {
    bestY = Math.max(bestY, posY + velY);

    posX += velX;
    posY += velY;

    velX = velX !== 0 ? (Math.abs(velX) - 1) * Math.sign(velX) : 0;
    velY -= 1;

    return { posX, posY, velX, velY, bestY };
  };

  const iterateAttempts = (velX: number, velY: number, attempts: object) => {
    let probe = { posX: 0, posY: 0, velX, velY, bestY: 0 };

    while (
      (!rangeX.includes(probe.posX) || !rangeY.includes(probe.posY)) &&
      probe.posX < maxX &&
      probe.posY > minY
    ) {
      probe = stepProbe(probe);
    }

    attempts[`${velX},${velY},${probe.posX},${probe.posY}`] = probe.bestY;
  };

  let attempts = {};

  for (let i = maxX * -1; i <= maxX; i++) {
    for (let j = maxX * -1; j <= maxX; j++) {
      iterateAttempts(i, j, attempts);
    }
  }

  /**
   * PART 1
   */
  const Part1 = () => {
    const probe = Object.entries(attempts).reduce(
      (acc, [k, v]) => {
        const [x, y, posX, posY] = k.split(',').map((n) => parseInt(n));
        return rangeX.includes(posX) && rangeY.includes(posY) && v > acc.best
          ? { x, y, best: v }
          : acc;
      },
      { x: 0, y: 0, best: 0 }
    );

    console.log(
      `The highest y position that any velocity can reach and still hit the target area is: ${probe.best}`
    );
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const filtered = Object.entries(attempts).filter(([k, v]) => {
      const [x, y, posX, posY] = k.split(',').map((n) => parseInt(n));
      return rangeX.includes(posX) && rangeY.includes(posY);
    });

    console.log(
      `There are ${filtered.length} distinct initial velocity values which cause the probe to be within the target area after any step`
    );
  };

  Part2();
}
