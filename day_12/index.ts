export module Day_12 {
  const fs = require('fs');

  const input: string[] = fs
    .readFileSync('./day_12/input.txt', 'utf8')
    .split('\r\n');

  const connections = input.map((conn) => conn.split('-'));
  const caveMap = connections.reduce(
    (acc, [a, b]) => ({
      ...acc,
      [a]: acc[a] ? [...acc[a], b] : [b],
      [b]: acc[b] ? [...acc[b], a] : [a],
    }),
    []
  );

  const searchPaths = (
    paths: string[][] = [],
    smallCave: boolean = false,
    cave: string = 'start',
    path: string[] = []
  ) => {
    const nextCave = caveMap[cave];

    if (
      cave === cave.toLowerCase() &&
      path.filter((c) => c === cave).length >= 1
    ) {
      if (!smallCave) return;
      smallCave = false;
    }

    if (cave === 'start' && path.includes('start')) return;
    else if (cave === 'end') {
      paths.push([...path, 'end']);
      return;
    }

    nextCave.forEach((c) => {
      searchPaths(paths, smallCave, c, [...path, cave]);
    });
  };

  /**
   * PART 1
   */
  const Part1 = () => {
    const paths = [];
    searchPaths(paths);
    console.log(`There are ${paths.length} paths through the cave system`);
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const paths = [];
    searchPaths(paths, true);
    console.log(
      `Allowing for one small cave, there are now ${paths.length} paths through the cave system`
    );
  };

  Part2();
}
