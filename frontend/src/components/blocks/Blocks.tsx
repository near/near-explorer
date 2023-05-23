import * as React from "react";

import { useTranslation } from "next-i18next";

import { id } from "@/common/utils/utils";
import BlocksRow from "@/frontend/components/blocks/BlocksRow";
import FlipMove from "@/frontend/components/utils/FlipMove";
import ListHandler from "@/frontend/components/utils/ListHandler";
import Placeholder from "@/frontend/components/utils/Placeholder";
import { subscriptions } from "@/frontend/hooks/use-subscription";
import { trpc } from "@/frontend/libraries/trpc";

const BLOCKS_PER_PAGE = 15;

const Blocks: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const latestBlockSub = subscriptions.latestBlock.useSubscription();

  const query = trpc.block.list.useInfiniteQuery(
    { limit: BLOCKS_PER_PAGE },
    {
      getNextPageParam: (lastPage) => {
        const lastElement = lastPage[lastPage.length - 1];
        if (!lastElement) {
          return;
        }
        return { timestamp: lastElement.timestamp };
      },
    }
  );

  const { refetch } = query;
  const onRefetchClick = React.useCallback(() => refetch(), [refetch]);

  return (
    <ListHandler<"block.list">
      query={query}
      parser={id}
      prependChildren={
        <Placeholder onClick={onRefetchClick}>
          {latestBlockSub.status === "success"
            ? t("utils.ListHandler.last_block", {
                height: latestBlockSub.data.height,
              })
            : null}
          {t("utils.Update.refresh")}
        </Placeholder>
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
