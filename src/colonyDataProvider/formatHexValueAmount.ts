import { utils } from "ethers";

export const formatHexValueAmount = (hexValue: string) => {
  const wei = new utils.BigNumber(10);
  return new utils.BigNumber(hexValue).div(wei.pow(18)).toString();
};
