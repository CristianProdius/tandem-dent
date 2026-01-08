"use client";
import * as React from "react";

import { ChartBar, Forklift, Gauge, GraduationCap, LayoutDashboard, Search, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  { group: "Panouri de control", icon: LayoutDashboard, label: "Principal" },
  { group: "Panouri de control", icon: ChartBar, label: "CRM", disabled: true },
  { group: "Panouri de control", icon: Gauge, label: "Analitice", disabled: true },
  { group: "Panouri de control", icon: ShoppingBag, label: "Comerț electronic", disabled: true },
  { group: "Panouri de control", icon: GraduationCap, label: "Academie", disabled: true },
  { group: "Panouri de control", icon: Forklift, label: "Logistică", disabled: true },
  { group: "Autentificare", label: "Autentificare v1" },
  { group: "Autentificare", label: "Autentificare v2" },
  { group: "Autentificare", label: "Înregistrare v1" },
  { group: "Autentificare", label: "Înregistrare v2" },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="link"
        className="!px-0 font-normal text-muted-foreground hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Căutare
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Caută panouri, utilizatori și altele…" />
        <CommandList>
          <CommandEmpty>Niciun rezultat găsit.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group} key={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem className="!py-1.5" key={item.label} onSelect={() => setOpen(false)}>
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
