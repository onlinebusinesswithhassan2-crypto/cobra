import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Props;

  constructor(props: Props) {
    super(props);
  }

  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Snake Escape App:', error, errorInfo);
  }

  public handleReload = () => {
    try {
      // Clear non-critical session state but keep user progress
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/20">
            <AlertTriangle className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            Game Encountered an Issue
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mb-4">
            A temporary display glitch occurred. Tap below to refresh the game smoothly.
          </p>

          {this.state.error?.message && (
            <div className="text-left text-[11px] font-mono bg-red-950/60 border border-red-500/40 text-red-300 p-2.5 rounded-xl max-w-sm mb-4 max-h-24 overflow-y-auto">
              <span className="font-bold">Error: </span>{this.state.error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restart Game</span>
            </button>
            <button
              type="button"
              onClick={this.handleResetStorage}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-700 cursor-pointer"
            >
              <span>Clear Game Cache & Reset</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
