import { getLogs, getBlockTime } from "@colony/colony-js";
import { Log } from "ethers/providers";

import { getColonyClient } from "./getColonyClient";
import { getUserAddressAndPotId } from "./getUserAddressAndPotId";
import { formatHexValueAmount } from "./helper";
import { ColonyEventType } from "./types";


export const getColonyEventLogs = async () => {
  const colonyClient = await getColonyClient();

  // ColonyInitialised;
  // ColonyRoleSet; 
  // PayoutClaimed;
  // DomainAdded;

  // Get the filters
  const domainAddedFilter = colonyClient.filters.DomainAdded(null);

  const colonyRoleSetFilter = colonyClient.filters.ColonyRoleSet(
    null,
    null,
    null,
    null,
  );

  const colonyInitialisedFilter = colonyClient.filters.ColonyInitialised(
    null,
    null
  );
  const payoutClaimedFilter = colonyClient.filters.PayoutClaimed(
    null,
    null,
    null
  );

  // get events logs with filters
  const colonyRoleSetLogs = await getLogs(colonyClient, colonyRoleSetFilter);
  const payoutClaimedLogs = await getLogs(colonyClient, payoutClaimedFilter);
  const domainAddedLogs = await getLogs(colonyClient, domainAddedFilter);
  const colonyInitialisedLogs = await getLogs(
    colonyClient,
    colonyInitialisedFilter
  );

  const mergedEventLogs: readonly Log[] = [
    ...colonyRoleSetLogs,
    ...payoutClaimedLogs,
    ...domainAddedLogs,
    ...colonyInitialisedLogs,
  ];

  const parsedLogs = mergedEventLogs.map((event) => ({
    ...event,
    ...colonyClient.interface.parseLog(event),
  }));

  const formattedLogs = await Promise.all(
    parsedLogs.map(async (eventLog) => {
      // Use the blockHash to look up the actual time of the
      // block that mined the transactions of the current event
      const logTime = await getBlockTime(
        colonyClient.provider,
        eventLog.blockHash || ""
      );

      if (eventLog.name === ColonyEventType.PayoutClaimed) {
        const userAddressAndPotId = await getUserAddressAndPotId(
          colonyClient,
          eventLog.values.fundingPotId
        );
        const payoutClaimed = formatHexValueAmount(eventLog.values.amount);

        return {
          ...eventLog,
          ...userAddressAndPotId,
          payoutClaimed,
          logTime,
        };
      } else {
        return { ...eventLog, logTime };
      }
    })
  );
  // be sorted reverse chronological (newest at the top)
  return formattedLogs.sort((a, b) => b.logTime - a.logTime);
};
