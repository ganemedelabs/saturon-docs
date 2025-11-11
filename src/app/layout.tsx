// @ts-ignore
import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Saturon",
        template: "%s | Saturon",
    },
    description: "The CSS color engine for the web's future.",
    icons: {
        icon: "favicon.ico",
        apple: "images/apple-touch-icon.png",
    },
    authors: [{ name: "Yusef Almamari", url: "https://github.com/yusefalmamari" }],
    metadataBase: new URL("https://saturon.js.org"),
    openGraph: {
        title: "Saturon",
        description: "The CSS color engine for the web's future.",
        url: "https://saturon.js.org",
        siteName: "Saturon",
        images: [
            {
                url: "images/social-card.png",
                width: 1200,
                height: 675,
                alt: "Saturon Social Card",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Saturon",
        description: "The CSS color engine for the web's future.",
        images: ["images/social-card.png"],
        creator: "@yusefalmamari",
    },
    verification: {
        google: "TYtGUYFKqN_7NhjemdjnkoQBR-IaVjJkPfZsPFapD4s",
        other: {
            "msvalidate.01": "5F41DDE468CA1184D54CA1C40983D75A",
        },
    },
};

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={jetBrainsMono.className} suppressHydrationWarning>
            <body className="flex min-h-screen flex-col overflow-x-hidden">
                <RootProvider>{children}</RootProvider>
            </body>
        </html>
    );
}
