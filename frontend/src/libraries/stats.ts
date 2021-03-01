export const cumulativeSumArray = (array: Array<number>) =>
  array.reduce((r, a) => {
    if (r.length > 0) a += r[r.length - 1];
    r.push(a);
    return r;
  }, Array());
