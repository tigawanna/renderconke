import { createFileRoute } from "@tanstack/react-router";
import { ItemDetail } from "../../components/item-detail";

export const Route = createFileRoute("/items/$itemId")({
  component: ItemPage,
});

function ItemPage() {
  const { itemId } = Route.useParams();
  return (
    <main>
      <ItemDetail itemId={itemId} />
    </main>
  );
}
