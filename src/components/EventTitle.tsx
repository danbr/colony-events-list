import React from "react";
import { ColonyRole } from "@colony/colony-js";
import { BigNumber } from "ethers/utils";

import {
  ColonyEventType,
  colonyTokenType,
  IColonyEventLog,
} from "../colonyDataProvider/types";
import styles from "./styles.module.css";

const formatBigNumber = (bigNumber: BigNumber) =>
  new BigNumber(bigNumber).toString();

export const EventTitle = ({ eventLog }: { eventLog: IColonyEventLog }) => {
  const {
    name,
    userAddress,
    payoutClaimed,
    humanReadableFundingPotId,
    values: { role, user, domainId, setTo, token },
  } = eventLog;

  switch (name) {
    case ColonyEventType.ColonyInitialised:
      return (
        <p className={styles.eventTitle}>
          {/* ColonyInitialised */}
          Congratulations! It's a beautiful baby colony!
        </p>
      );
    case ColonyEventType.ColonyRoleSet:
      return (
        <p className={styles.eventTitle}>
          {/* ColonyRoleSet */}
          <span>
            {ColonyRole[role]}
          </span> 
          {" "}role{setTo ? " assigned to " : " revoked from "}user{" "}
          <span>{user}</span> 
          {" "}in domain{" "}
          <span>
            {formatBigNumber(domainId)}
          </span>
        </p>
      );
    case ColonyEventType.PayoutClaimed:
      return (
        <p className={styles.eventTitle}>
          {/* PayoutClaimed */}
          User{" "}
          <span>{userAddress}</span> 
          {" "}claimed{" "}
          <span>
            {payoutClaimed}
            {colonyTokenType[token]}
          </span>
          {" "}payout from pot{" "}
          <span>
            {humanReadableFundingPotId}
          </span>
        </p>
      );
    case ColonyEventType.DomainAdded:
      return (
        <p className={styles.eventTitle}>
          {/* DomainAdded */}
          Domain{" "}<span>
            {formatBigNumber(domainId)}
          </span>{" "}added
        </p>
      );
    default:
      console.debug("EventTitle: unexpected ColonyEventType");
      return null;
  }
};
