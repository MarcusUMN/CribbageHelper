export function combinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = [];
  function helper(start: number, path: T[]) {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      helper(i + 1, path);
      path.pop();
    }
  }
  helper(0, []);
  return result;
}
