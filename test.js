if (global.gc) {
  console.log('Running garbage collector...');
  global.gc();
} else {
  console.warn('Garbage collector is not exposed.');
}