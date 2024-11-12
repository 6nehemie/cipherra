/**
 * Converts an amount in Ether to USD (using a fixed rate of 1800 USD per Ether).
 *
 * @param {number} ethAmount - The amount in Ether.
 * @returns {number} - The value in USD, rounded to two decimal places.
 */
export const convertEthToUsd = (ethAmount: number): number => {
  const usdValue = ethAmount * 1800;
  return Math.round(usdValue * 100) / 100;
};

/**
 * Converts a value in Wei (hex) to Ether.
 *
 * @param {string} weiValue - The value in Wei as hexadecimal.
 * @returns {number} - The value converted to Ether.
 */
export const convertWeiToEther = (weiValue: string): number => {
  // ? Convert the hexadecimal value to a BigNumber
  const weiNumber = parseInt(weiValue, 16);

  // ? Convert Wei to Ether
  const etherValue = weiNumber / 1e18;

  return etherValue;
};
