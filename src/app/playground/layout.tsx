import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Playground",
        template: "Playground",
    },
    description: "Experiment with Saturon's color parsing and conversion features in real-time.",
};

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <HomeLayout suppressHydrationWarning={true} {...baseOptions()}>
            {children}
        </HomeLayout>
    );
}
