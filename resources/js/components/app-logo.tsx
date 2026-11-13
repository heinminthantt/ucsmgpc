import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-full border border-sidebar-primary/40 bg-sidebar-accent text-sidebar-primary">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="font-display text-[17px] leading-none font-semibold tracking-wide text-white">
                    UCSMGY
                </span>
                <span className="mt-1 block text-[9px] leading-none font-medium tracking-[0.2em] text-sidebar-foreground/60 uppercase">
                    Project Catalog
                </span>
            </div>
        </>
    );
}
