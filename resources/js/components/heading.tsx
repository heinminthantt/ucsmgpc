export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    if (variant === 'small') {
        return (
            <header>
                <h3 className="text-base font-medium text-foreground">{title}</h3>
                {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </header>
        );
    }

    return (
        <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}
