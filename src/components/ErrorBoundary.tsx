import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });

        // Log to console in development
        console.error("Error caught by ErrorBoundary:", error, errorInfo);

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // In production, you would send to Sentry or similar
        // if (process.env.NODE_ENV === 'production') {
        //   Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    private handleGoHome = () => {
        window.location.href = "/dashboard";
    };

    private handleReportBug = () => {
        // Open support or bug report form
        window.open("mailto:support@leadrockets.com?subject=Bug Report", "_blank");
    };

    public render() {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <Card className="max-w-md w-full shadow-lg border-red-100">
                        <CardContent className="p-8 text-center">
                            {/* Error Icon */}
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>

                            {/* Error Message */}
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Something went wrong
                            </h2>
                            <p className="text-gray-500 mb-6">
                                We're sorry, but something unexpected happened. Our team has been notified.
                            </p>

                            {/* Error Details (development only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-3 bg-gray-50 rounded-lg text-left overflow-auto max-h-32">
                                    <p className="text-xs font-mono text-red-600">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <p className="text-xs font-mono text-gray-500 mt-2">
                                            {this.state.errorInfo.componentStack?.slice(0, 200)}...
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                                <Button onClick={this.handleRetry} className="w-full gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 gap-2"
                                        onClick={this.handleGoHome}
                                    >
                                        <Home className="w-4 h-4" />
                                        Go Home
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 gap-2"
                                        onClick={this.handleReportBug}
                                    >
                                        <Bug className="w-4 h-4" />
                                        Report
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for wrapping components
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WithErrorBoundary(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}

export default ErrorBoundary;
