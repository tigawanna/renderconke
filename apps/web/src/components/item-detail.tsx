import { eq } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { itemsCollection as ItemsCollection } from "../db/items";

type ItemsModule = { itemsCollection: typeof ItemsCollection };

export function ItemDetail({ itemId }: { itemId: string }) {
  const [mod, setMod] = useState<ItemsModule | null>(null);

  useEffect(() => {
    void import("../db/items").then(setMod);
  }, []);

  if (!mod) return <p>Loading item…</p>;
  return <ItemBody collection={mod.itemsCollection} itemId={itemId} />;
}

function ItemBody({
  collection,
  itemId,
}: {
  collection: ItemsModule["itemsCollection"];
  itemId: string;
}) {
  const { data, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ item: collection })
        .where(({ item }) => eq(item.id, itemId))
        .findOne(),
    [itemId],
  );

  return (
    <>
      <Link to="/" className="back">
        All items
      </Link>
      {isLoading ? <p>Loading item…</p> : null}
      {!isLoading && !data ? <p>This item is not in the collection.</p> : null}
      {data ? (
        <>
          <h1>{data.title}</h1>
          <p className="body">{data.body}</p>
        </>
      ) : null}
    </>
  );
}
