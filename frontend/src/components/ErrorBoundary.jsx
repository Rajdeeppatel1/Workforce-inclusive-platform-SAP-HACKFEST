import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SkillNav App Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('skillnav_candidate_profile');
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.href = '/onboarding';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-xl p-8 shadow-sm text-center space-y-5">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-neutral-900">Something went wrong</h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                An unexpected interface issue occurred. You can reset your session or reload the page.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-neutral-100 rounded text-left font-mono text-[11px] text-neutral-700 max-h-28 overflow-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded border border-blue-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset &amp; Go Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
