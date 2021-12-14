export module Day_14 {
  const fs = require('fs');

  const input: string[] = fs
    .readFileSync('./day_14/input.txt', 'utf8')
    .split('\r\n');

  type Rules = Record<string, string>;

  const { template, rules }: { template: string; rules: Rules } = input.reduce(
    (acc, val) => {
      if (val.length === 0) return { ...acc, swap: true };
      if (!acc.swap)
        return {
          ...acc,
          template: val,
        };
      else {
        const [k, v] = val.split(' -> ');
        return {
          ...acc,
          rules: { ...acc.rules, [k]: v },
        };
      }
    },
    { template: '', rules: {}, swap: false }
  );

  /**
   * PART 1
   */
  const Part1 = () => {
    const polymerise = (input: string[]) => {
      const chain = input.reduce((acc, val, i, arr) => {
        const pair = `${val}${arr[i + 1]}`;
        const insert = rules[pair];
        if (!insert) return [...acc, val];
        return [...acc, val, insert];
      }, []);
      return chain;
    };

    let chain = template.split('');
    for (let i = 0; i < 10; i++) {
      chain = polymerise(chain);
    }

    const unique = [...new Set(chain)].map(
      (u) => chain.filter((e) => e === u).length
    );
    const result = Math.max(...unique) - Math.min(...unique);

    console.log(
      `After 10 steps, taking the quantity of the most common element and subtracting the quantity of the least common element gives: ${result}`
    );
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const polymerise = (pairs: Map<string, number>) => {
      const newPairs = new Map<string, number>();
      for (const pair of pairs.keys()) {
        if (!rules[pair]) continue;
        const count = pairs.get(pair);
        const pair1 = `${pair[0]}${rules[pair]}`;
        const pair2 = `${rules[pair]}${pair[1]}`;
        newPairs.set(pair1, (newPairs.get(pair1) ?? 0) + count);
        newPairs.set(pair2, (newPairs.get(pair2) ?? 0) + count);
      }
      return newPairs;
    };

    const startPolymer = (chain: string[]): Map<string, number> => {
      return chain.reduce((acc, val, i, arr) => {
        const pair = `${val}${arr[i + 1]}`;
        acc.set(pair, (acc.get(pair) ?? 0) + 1);
        return acc;
      }, new Map<string, number>());
    };

    const chain = template.split('');

    let pairs = startPolymer(chain);
    for (let i = 0; i < 40; i++) {
      pairs = polymerise(pairs);
    }

    const last = template.slice(-2);
    const lastPair = `${rules[last]}${last[1]}`;

    const count = new Map<string, number>();
    for (const pair of pairs.keys()) {
      const element = pair[0];
      count.set(element, (count.get(element) ?? 0) + pairs.get(pair));
      if (pair === lastPair) {
        const lastElement = lastPair[1];
        count.set(lastElement, (count.get(lastElement) ?? 0) + 1);
      }
    }

    const unique = [...count.entries()].map(([_, count]) => count);
    const result = Math.max(...unique) - Math.min(...unique);

    console.log(
      `After 40 steps, taking the quantity of the most common element and subtracting the quantity of the least common element gives: ${result}`
    );
  };

  Part2();
}
