// See section "Handling Numbers" for how BigNumber plays a role
import { ColonyClient } from "@colony/colony-js";
import { BigNumber } from "ethers/utils";

export const getUserAddressAndPotId = async (
  colonyClient: ColonyClient,
  fundingPotId: BigNumber
) => {
  const humanReadableFundingPotId = new BigNumber(fundingPotId).toString();
  const { associatedTypeId } = await colonyClient.getFundingPot(
    humanReadableFundingPotId
  );

  const { recipient } = await colonyClient.getPayment(associatedTypeId);
  return { userAddress: recipient, humanReadableFundingPotId };
};
