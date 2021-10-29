// See section "Handling Numbers" for how BigNumber plays a role
import { ColonyClient } from "@colony/colony-js";

export const getUserAddress = async (
  colonyClient: ColonyClient,
  fundingPotId: String
) => {
  const { associatedTypeId } = await colonyClient.getFundingPot(fundingPotId);
  const {recipient} = await colonyClient.getPayment(associatedTypeId);
  return recipient;
};
