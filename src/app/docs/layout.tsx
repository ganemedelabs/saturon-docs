import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import Alert from "@/components/Alert";

export default function Layout({ children }: LayoutProps<"/docs">) {
    return (
        <DocsLayout tree={source.pageTree} {...baseOptions()}>
            <Alert
                message="🚧 This documentation covers a pre-1.0 release. Expect breaking changes."
                variant="warning"
            />
            {children}
        </DocsLayout>
    );
}
