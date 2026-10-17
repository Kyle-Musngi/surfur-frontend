import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('SurFur Uncaught Application Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-surfur-app text-surfur-main transition-colors">
          <div className="max-w-md w-full bg-white dark:bg-[#2A1A2A] rounded-3xl shadow-xl border border-[#F1D5DF] dark:border-[#4D2E4D] p-8 text-center">
            <div className="w-16 h-16 bg-[#FCE4EC] dark:bg-[#382338] text-[#F4435A] dark:text-[#F48FB1] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#352633] dark:text-[#FCE4EC] mb-2">Something went wrong</h2>
            <p className="text-[#786875] dark:text-[#C9B8C7] text-sm mb-6">
              We encountered an unexpected display issue. Your data is safe. You can reload this page or head back to the SurFur homepage.
            </p>
            {this.state.error && (
              <div className="bg-[#FCE4EC]/50 dark:bg-[#1E121E] text-[#352633] dark:text-[#FCE4EC] p-3 rounded-xl text-xs text-left mb-6 font-mono overflow-auto max-h-32 border border-[#F1D5DF] dark:border-[#4D2E4D]">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4435A] hover:bg-[#C62845] text-white font-bold transition cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#DDF5D5] hover:bg-[#cbf0c0] dark:bg-[#382338] dark:hover:bg-[#4a2e4a] text-[#352633] dark:text-[#FCE4EC] font-bold transition"
              >
                <Home className="w-4 h-4" />
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
