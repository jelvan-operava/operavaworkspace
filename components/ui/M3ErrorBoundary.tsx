import React, { Component, ErrorInfo, ReactNode } from 'react';
import { M3ErrorState } from './M3ErrorState';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class M3ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('M3ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <M3ErrorState
          title={this.props.fallbackTitle || 'Component Rendering Exception'}
          description="A visual component encountered an unexpected error while rendering view data."
          errorCode="ERR_REACT_RENDER"
          errorDetails={
            this.state.error
              ? `${this.state.error.toString()}\n\nStack:\n${this.state.errorInfo?.componentStack || 'N/A'}`
              : 'Unknown error details'
          }
          onRetry={this.handleReset}
          onSecondaryAction={() => window.location.reload()}
          secondaryActionText="Reload Portal"
        />
      );
    }

    return this.props.children;
  }
}
