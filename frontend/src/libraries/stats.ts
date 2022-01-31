export const cumulativeSumArray = (array: number[]): number[] =>
  array.reduce<number[]>((acc, element) => {
    acc.push(acc.length === 0 ? element : element + acc[acc.length - 1]);
    return acc;
  }, []);
