export module Day_01 {
  const fs = require('fs');

  const input = fs.readFileSync('./day_01/input.txt', 'utf8');

  const depths: number[] = input.split('\r\n').map((n: string) => parseInt(n));

  /**
   * PART 1
   */
  const increased = depths.reduce((count, currentDepth, i) => {
    if (i === 0) return 0;
    if (currentDepth > depths[i - 1]) return count + 1;
    return count;
  }, 0);

  console.log(`Depths increased ${increased} times!`);

  /**
   * PART 2
   */
  const increasedAsWindow = depths.reduce((count, currentDepth, i) => {
    if (i === 0) return 0;
    const lastSum = depths[i - 1] + currentDepth + depths[i + 1];
    const currentSum = currentDepth + depths[i + 1] + depths[i + 2];
    if (currentSum > lastSum) return count + 1;
    return count;
  }, 0);

  console.log(
    `Considering depths through a sliding window, depths increased ${increasedAsWindow} times!`
  );
}
