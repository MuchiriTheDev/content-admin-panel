import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    this.setState({ errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    // Reset state and attempt to reload the page
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-fadeBrown p-4">
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 hover:scale-105">
            {/* Error Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-brown rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-yellowGreen"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-brown mb-4">
              Oops, Something Went Wrong
            </h1>
            <p className="text-appleGreen mb-6">
              We encountered an unexpected issue. Our team has been notified, and
              we're working to fix it. Please try again or reload the page.
            </p>

            {/* Error Details (for developers) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left text-sm text-brown mb-6">
                <summary className="cursor-pointer font-semibold">
                  Error Details
                </summary>
                <pre className="mt-2 p-4 bg-fadeBrown rounded-lg overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-yellowGreen text-white font-semibold rounded-lg shadow-md hover:bg-appleGreen transition-colors duration-200"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-brown text-white font-semibold rounded-lg shadow-md hover:bg-fadeBrown transition-colors duration-200"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;