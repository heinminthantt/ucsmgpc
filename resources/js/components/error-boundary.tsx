import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { Button } from 'journal-ds';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-md border border-journal-burgundy/30 bg-journal-burgundy/5 p-6 text-center space-y-3">
                    <Icon icon="mdi:alert-circle-outline" className="mx-auto text-4xl text-journal-burgundy" aria-hidden="true" />
                    <h3 className="font-display text-lg font-semibold text-journal-ink">Component failed to load</h3>
                    <p className="font-serif text-sm italic text-journal-sepia max-w-sm mx-auto text-pretty">
                        An error occurred while loading this section of the interface. This might be due to a network interruption.
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Reload Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
