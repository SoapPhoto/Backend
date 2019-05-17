
/**
 * 转换经纬坐标
 *
 * @export
 * @param {number} d
 * @param {number} f
 * @param {number} m
 * @returns
 */
export function changeToDu(d: number, f: number, m: number) {
  const c = parseFloat(f.toString()) + parseFloat((m / 60).toString());
  const du = parseFloat((c / 60).toString()) + parseFloat(d.toString());
  return du;
}
