import { useState, useEffect } from "react";
import Header from "./components/Header";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import ResultsState from "./components/ResultsState";
import type { AnalysisResponse } from "./types";

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger analysis dynamically from window messages
  const handleApiCall = async (codeToAnalyze: string) => {
    setIsLoading(true);
    setAnalysis(null); // Clear previous results while loading

    try {
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeToAnalyze,
        }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // content.js posts { type: "ANALYZE_CODE", code: "..." }
      if (
        event.data?.type === "ANALYZE_CODE" &&
        typeof event.data.code === "string"
      ) {
        handleApiCall(event.data.code);
      }
    };

    window.addEventListener("message", handleMessage);

    // Tell parent (content.js) we are ready to receive messages
    window.parent.postMessage({ type: "ALGOINTEL_APP_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="h-screen bg-bg-primary text-text-primary antialiased flex flex-col overflow-hidden rounded-2xl">
      <Header isLoading={isLoading} />

      <div className="flex-1 flex flex-col px-5 py-4 overflow-y-auto">
        {!analysis && !isLoading && <EmptyState />}
        {isLoading && <LoadingState />}
        {analysis && !isLoading && <ResultsState analysis={analysis} />}
      </div>
    </div>
  );
}
