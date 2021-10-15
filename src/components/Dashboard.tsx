import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import useAsyncEffect from "use-async-effect";

import { IColonyEventLog } from "../colony/types";
import { getColonyEventLogs } from "../colony/getColonyEventLogs";
import { EventListItem } from "./EventListItem";
import styles from "./styles.module.css";

const PAGE_SIZE = 10;

export const Dashboard = () => {

  const [colonyEventLogs, setColonyEventLogs] =
    useState<readonly IColonyEventLog[]>();
  const [listItems, setListItems] = useState<IColonyEventLog[]>();
  const [hasMoreData, setHasMoreData] = useState(true);

  useAsyncEffect(async () => {
    try {
      const events = await getColonyEventLogs();
      setColonyEventLogs(events);
      setListItems(events.slice(0, PAGE_SIZE));
      setHasMoreData(true);
    } catch (error: unknown) {
      console.log("Error fetching Colony Event data:\n", error);
    }
  }, []);

  const loadMoreData = (page: number) => {
    setListItems(colonyEventLogs?.slice(0, page * PAGE_SIZE));
    if (listItems && colonyEventLogs) {
      setHasMoreData(listItems.length < colonyEventLogs.length ? true : false);
    }
  };

  return listItems === undefined ? (
    <div className={styles.dashboardMessage}>
      Searching for events, please wait...
    </div>
  ) : (
    <ul className={styles.dashboardList}>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreData}
        hasMore={hasMoreData}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }>
        {listItems.map((event, key) => (
          <EventListItem eventLog={event} key={key} />
        ))}
      </InfiniteScroll>
    </ul>
  );
};
