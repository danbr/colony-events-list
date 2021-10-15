// import { ListItem } from "./ListItem";
import { IColonyEventLog } from "../colony/types";
import { EventTitle } from "./EventTitle";

import makeBlockie from "ethereum-blockies-base64";
// import {Blockies} from 'blockies/react-component';
// const Blockies = require("blockies/react-component");

import styles from "./styles.module.css";

export const EventListItem = ({ eventLog }: { eventLog: IColonyEventLog }) => {
  return (
    <li className={styles.eventListItem}>
      <div>
        <img
          src={makeBlockie(
            eventLog.userAddress ||
              eventLog.address ||
              eventLog.values.blockHash
          )}
          alt="blockie"
          className={styles.avatar}
        />
      </div>
      <div>
        <EventTitle eventLog={eventLog} />
        <div className={styles.subtitle}>
          {new Date(eventLog.logTime).toLocaleDateString("en-UK", {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </li>
  );
};
