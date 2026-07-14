import { CatalogNavbar } from '@/components/catalog-navbar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-journal-paper">
            <CatalogNavbar />
            <main className="flex-1 animate-page-enter">{children}</main>
        </div>
    );
}
