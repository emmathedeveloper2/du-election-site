import {Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation} from "react-router";

import "./tailwind.css";
import {Route} from "./+types/root";
import {LoaderIcon} from "lucide-react";
import { Toaster } from "./components/ui/sonner";

export const links: Route.LinksFunction = () => [
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    {
        rel: "icon",
        type: "image/png",
        href: "./logo.png"
    }
];

export function meta({}: Route.MetaArgs) {
    return [
        {title: "NACOS DU"},
        {name: "description", content: "A mordern Auth Template"},
        {property: "og:url", content: "https://example.com"},
        {property: "og:type", content: "website"},
        {property: "og:title", content: "NACOS DU"},
        {property: "og:description", content: "A mordern Auth Template"},
        {property: "og:image", content: "https://example.com/opengraph.png"},
        {property: "twitter:card", content: "summary_large_image"},
        {property: "twitter:title", content: "NACOS DU"},
        {property: "twitter:description", content: "A mordern Auth Template"},
        {property: "twitter:image", content: "https://example.com/opengraph.png"},
        {property: "twitter:site", content: "@example"},
    ];
}

export function Layout({children}: { children: React.ReactNode }) {

    const navigation = useNavigation();
    const isNavigating = Boolean(navigation.location);

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body className={"dark"}>
        {isNavigating && <GlobalLoader/>}
        {children}
        <Toaster style={{ fontFamily: 'Inter' }} className="" position="top-center"/>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

function GlobalLoader() {

    return (
        <main className={'fixed h-screen w-screen top-0 left-0 grid place-items-center z-50 bg-background'}>
            <LoaderIcon className={'animate-spin'}/>
        </main>
    )
}

export default function App() {
    return <Outlet/>;
}
