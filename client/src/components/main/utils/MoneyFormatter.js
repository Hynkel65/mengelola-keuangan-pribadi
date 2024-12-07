function moneyFormatter(num) {
  let p = Math.abs(num).toString();
  return (
    'Rp ' +
    (num < 0 ? '-' : '') +
    p
      .split('')
      .reverse()
      .reduce(function (acc, num, i, orig) {
        return num + (i && !(i % 3) ? '.' : '') + acc;
      }, '')
  );
}

export default moneyFormatter;