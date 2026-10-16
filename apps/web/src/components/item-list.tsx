import { useLiveQuery } from "@tanstack/react-db";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { itemsCollection as ItemsCollection } from "../db/items";

type ItemsModule = { itemsCollection: typeof ItemsCollection };

export function ItemList() {
  const [mod, setMod] = useState<ItemsModule | null>(null);

  useEffect(() => {
    void import("../db/items").then(setMod);
  }, []);

  if (!mod) return <p>Loading items…</p>;
  return <ItemRows collection={mod.itemsCollection} />;
}

function ItemRows({ collection }: { collection: ItemsModule["itemsCollection"] }) {
  const { data, isLoading } = useLiveQuery((q) =>
    q.from({ item: collection }).select(({ item }) => ({
      id: item.id,
      title: item.title,
      body: item.body,
    })),
  );

  if (isLoading) return <p>Loading items…</p>;

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <Link to="/items/$itemId" params={{ itemId: item.id }}>
            <span className="title">{item.title}</span>
            <span className="summary">{item.body}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
