"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: "Home",
    href: "/dashboard",
  },
  {
    name: "Intervenants",
    href: "/dashboard/intervenants",
  },
  {
    name: "Disponibilités",
    href: "/dashboard/disponibilites",
  },
  {
    name: "Exporter disponibilités",
    href: "/dashboard/exporter-dispos",
  },
  {
    name: "Importer semaines de travail",
    href: "/dashboard/importer-semaines",
  }
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-100 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-red-100 text-red-600": pathname === link.href,
              }
            )}
          >
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
