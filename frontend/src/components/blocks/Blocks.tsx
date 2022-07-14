import * as React from "react";
import { useTranslation } from "react-i18next";

import ListHandler from "../utils/ListHandler";
import FlipMove from "../utils/FlipMove";

import BlocksRow from "./BlocksRow";
import Placeholder from "../utils/Placeholder";
import { trpc } from "../../libraries/trpc";
import { useSubscription } from "../../hooks/use-subscription";
import { BlockBase } from "../../types/common";
import { id } from "../../libraries/common";

const BLOCKS_PER_PAGE = 15;

const Blocks: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const latestBlockSub = useSubscription(["latestBlock"]);

  const query = trpc.useInfiniteQuery(
    ["block.list", { limit: BLOCKS_PER_PAGE }],
    {
      getNextPageParam: (lastPage) => {
        const lastElement = lastPage[lastPage.length - 1];
        if (!lastElement) {
          return;
        }
        return lastElement.timestamp;
      },
    }
  );

  const refetch = React.useCallback(() => query.refetch(), [query.refetch]);

  return (
    <ListHandler<BlockBase>
      query={query}
      parser={id}
      prependChildren={
        <div onClick={refetch}>
          <Placeholder>
            {latestBlockSub.status === "success"
              ? t("utils.ListHandler.last_block", {
                  height: latestBlockSub.data.height,
                })
              : null}
            {t("utils.Update.refresh")}
          </Placeholder>
        </div>
      }
    >
      {(items) => (
        <FlipMove duration={1000} staggerDurationBy={0}>
          {items.map((block) => (
            <div key={block.hash}>
              <BlocksRow block={block} />
            </div>
          ))}
        </FlipMove>
      )}
    </ListHandler>
  );
});

export default Blocks;
