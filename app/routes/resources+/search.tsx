import { type LoaderArgs, json } from "@remix-run/node";
import { useCombobox } from "downshift";
import { useId, useState } from "react";
import { useSpinDelay } from "spin-delay";
import invariant from "tiny-invariant";

import { Icon } from "~/components/icon.tsx";
import { Label } from "~/components/ui/label.tsx";
import { useDebounceFetcher } from "~/hooks/debounce-fetcher.tsx";
import { prisma } from "~/utils/db.server.ts";
import { cn } from "~/utils/misc.ts";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  invariant(typeof query === "string", "query is required");

  if (query.length < 1) {
    return json({ items: [] });
  }

  const items = await prisma.hero.findMany({
    orderBy: { name: "asc" },
    select: { alignment: true, id: true, name: true, publisher: true },
    where: { name: { contains: query } }
  });

  return json({ items });
}

export function ItemCombobox({
  className,
  error,
  labelText = "Item",
  name,
  onChange
}: {
  className?: string;
  error?: null | string;
  labelText?: string;
  name: string;
  onChange?: (itemId: string) => void;
}) {
  const itemFetcher = useDebounceFetcher<typeof loader>();
  const id = useId();
  const items = itemFetcher.data?.items ?? [];
  type Item = (typeof items)[number];
  const [selectedItem, setSelectedItem] = useState<Item | null | undefined>(
    null
  );

  const cb = useCombobox<Item>({
    id,
    itemToString: (item) => (item ? item.name : ""),
    items: items,
    onInputValueChange: (changes) => {
      itemFetcher.debounceSubmit(
        { query: changes.inputValue ?? "" },
        { action: "/resources/search", debounceTimeout: 60 * 5, method: "GET" }
      );
    },
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedItem(selectedItem);
      if (selectedItem && onChange) {
        onChange(selectedItem.id);
      }
    }
  });

  const busy = itemFetcher.state !== "idle";
  const showSpinner = useSpinDelay(busy, { delay: 150, minDuration: 500 });
  const displayMenu = cb.isOpen && items.length;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <input name={name} type="hidden" value={selectedItem?.id ?? ""} />
      <Label {...cb.getLabelProps()}>{labelText}</Label>
      <div className="relative w-full grow">
        <div
          className={cn(
            "flex items-center gap-1 rounded-md bg-white p-0.5 shadow-sm",
            displayMenu && "rounded-b-none"
          )}
        >
          <div className="relative grow">
            <input
              className="w-full p-1.5"
              placeholder="Start typing..."
              {...cb.getInputProps()}
            />
            <Spinner showSpinner={showSpinner} />
          </div>
          <button
            aria-label="toggle menu"
            className="px-1.5"
            type="button"
            {...cb.getToggleButtonProps()}
          >
            {displayMenu ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
        <ul
          className={cn(
            "absolute z-10 max-h-80 w-full overflow-scroll rounded-b-md bg-white p-0 shadow-md",
            !displayMenu && "hidden"
          )}
          {...cb.getMenuProps()}
        >
          {displayMenu &&
            items.map((item, index) => {
              const icon =
                item.alignment === "good"
                  ? "venetian-mask"
                  : item.alignment === "bad"
                  ? "skull"
                  : "shield";
              return (
                <li
                  className={cn(
                    cb.highlightedIndex === index && "bg-green-100",
                    cb.selectedItem === item && "font-bold",
                    "flex items-center gap-1 gap-2 px-3 py-2 shadow-sm"
                  )}
                  key={item.id}
                  {...cb.getItemProps({ index, item })}
                >
                  <Icon className="h-8 w-8 text-black" name={icon} />
                  <div>
                    <div className="text-lg font-semibold leading-tight">
                      {item.name}
                    </div>
                    <div className="text-sm font-light">{item.publisher}</div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      {error ? (
        <em className="text-d-p-xs text-red-600" id={`${id}-error`}>
          {error}
        </em>
      ) : null}
    </div>
  );
}

function Spinner({ showSpinner }: { showSpinner: boolean }) {
  return (
    <div
      className={`absolute right-0 top-[6px] transition-opacity ${
        showSpinner ? "opacity-100" : "opacity-0"
      }`}
    >
      <svg
        className="-ml-1 mr-3 h-5 w-5 animate-spin"
        fill="none"
        height="1em"
        viewBox="0 0 24 24"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx={12}
          cy={12}
          r={10}
          stroke="currentColor"
          strokeWidth={4}
        />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
