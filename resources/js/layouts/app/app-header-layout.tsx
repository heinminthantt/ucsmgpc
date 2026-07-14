import { CatalogNavbar } from '@/components/catalog-navbar';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <CatalogNavbar />
            <main className="flex-1">{children}</main>
        </div>
    );
}
