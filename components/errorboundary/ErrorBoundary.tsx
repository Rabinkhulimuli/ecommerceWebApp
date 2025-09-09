"use client";

import React, { Component, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Global Error Caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorModal error={this.state.error?.message} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

const ErrorModal = ({
  error,
  onReset,
}: {
  error?: string;
  onReset: () => void;
}) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-700 mb-6">{error || "An unexpected error occurred."}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onReset}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
