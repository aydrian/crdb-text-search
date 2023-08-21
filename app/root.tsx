import type { LinksFunction } from "@remix-run/node";

import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import crlLogo from "~/images/CockroachLabs_Full-Logo-Horizontal_Reduced-Color-Light-BG.png";
import styles from "~/tailwind.css";

import { Icon } from "./components/icon.tsx";

export const links: LinksFunction = () => [
  { href: "/fonts/poppins/font.css", rel: "stylesheet" },
  { href: styles, rel: "stylesheet" },
  ...(cssBundleHref ? [{ href: cssBundleHref, rel: "stylesheet" }] : [])
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body className="from-crl-dark-blue to-crl-iridescent-blue via-crl-electric-purple flex min-h-screen flex-col gap-4 bg-gradient-to-br p-4 md:p-6">
        <header className="rounded-sm bg-white p-4 shadow-md">
          <img alt="Cockroach Labs" className="mx-auto h-12" src={crlLogo} />
        </header>
        <main className="grow">
          <Outlet />
        </main>
        <footer className="bg-crl-deep-purple rounded-sm text-white shadow-md">
          <ul className="mx-auto flex max-w-7xl items-center justify-between p-4 text-sm font-bold text-white">
            <li>
              <a
                href={`https://twitter.com/cockroachdb/`}
                rel="noreferrer"
                target="_blank"
              >
                @CockroachDB
              </a>
            </li>
            <li>
              <a
                href="https://github.com/aydrian/crdb-text-search"
                rel="noreferrer"
                target="_blank"
              >
                <Icon className="aspect-square h-7 text-white" name="github" />
              </a>
            </li>
          </ul>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
