export interface AnalysisResponse {
  approach: string;
  timeComplexity: string;
  suggestedTimeComplexity: string;
  spaceComplexity: string;
  suggestedSpaceComplexity: string;
  summary: string;
  improvements: string[];
}
