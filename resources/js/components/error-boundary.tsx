import { AlertCircle } from 'lucide-react';
import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';
import { Button } from '@/components/ui/button';

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
                <div className="space-y-3 rounded-xl border border-border bg-card p-6 text-center">
                    <AlertCircle className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
                    <h3 className="text-base font-medium text-foreground">Something failed to load</h3>
                    <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                        An error occurred while loading this section. This might be due to a network interruption.
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Reload page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
