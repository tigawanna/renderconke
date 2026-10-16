import { createFileRoute } from "@tanstack/react-router";
import { ItemList } from "../components/item-list";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main>
      <h1>Items</h1>
      <ItemList />
    </main>
  );
}
