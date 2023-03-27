export const addLeadingZeros = (num: number, size: number) => {
  let numStr = num.toString();

  while (numStr.length < size) {
    numStr = '0' + numStr;
  }

  return numStr;
};
