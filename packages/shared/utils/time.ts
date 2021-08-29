export function dateTimeDifference(startDate: Date, endDate: Date): string {
  return Array(2)
    .fill([3600, endDate.getTime() - startDate.getTime()])
    .map((v, i, a) => {
      // hours -> minutes -> seconds
      const timeUnit = a[i][0] / 60;
      const differenceByTimeUnit = v[1] / (v[0] * 1000);
      const conversion = (differenceByTimeUnit % 1) * (v[0] * 1000);

      a[i + 1] = [timeUnit, conversion];

      return `0${Math.floor(differenceByTimeUnit)}`.slice(-2);
    })
    .join(':');
}
