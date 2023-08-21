import type { LoaderArgs } from "@remix-run/node";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "~/components/ui/card.tsx";

import { ItemCombobox } from "./resources+/search.tsx";

export async function loader({ request }: LoaderArgs) {
  return [];
}

export default function Index() {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Hero Search</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemCombobox
          className="flex-col md:flex-row"
          labelText="Hero Name"
          name="item"
        />
      </CardContent>
    </Card>
  );
}
