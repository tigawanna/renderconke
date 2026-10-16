import { createCollection } from "@tanstack/db";
import { persistedCollectionOptions } from "@tanstack/browser-db-sqlite-persistence";
import { persistence } from "./persistence";

export type Item = {
  id: string;
  title: string;
  body: string;
};

const seed: Item[] = [
  {
    id: "harbor",
    title: "Harbor notes",
    body: "A short record of the morning tide and the boats that left before noon.",
  },
  {
    id: "orchard",
    title: "Orchard walk",
    body: "Rows of young trees, a gravel path, and one bench that faces the hill.",
  },
  {
    id: "archive",
    title: "Archive card",
    body: "A placeholder item so the detail route has something real to open.",
  },
];

export const itemsCollection = createCollection(
  persistedCollectionOptions({
    id: "items",
    getKey: (item: Item) => item.id,
    persistence,
    schemaVersion: 1,
  }),
);

await itemsCollection.preload();

if (itemsCollection.size === 0) {
  itemsCollection.insert(seed);
}
