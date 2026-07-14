import { Heading as JournalHeading, Text } from 'journal-ds';

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
                <JournalHeading level="h3" className="text-base font-medium text-journal-ink">
                    {title}
                </JournalHeading>
                {description && (
                    <Text variant="muted" className="mt-0.5 text-xs">
                        {description}
                    </Text>
                )}
            </header>
        );
    }

    return (
        <div className="mb-8">
            <JournalHeading level="h1" className="text-3xl text-journal-ink">
                {title}
            </JournalHeading>
            {description && (
                <Text variant="muted" className="mt-1.5">
                    {description}
                </Text>
            )}
        </div>
    );
}
