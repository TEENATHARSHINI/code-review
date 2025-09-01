import { AlertTriangle, Info, Lightbulb, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

type ReviewResult = {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  lineNumber: number;
  codeSnippet: string;
  suggestion?: string;
};

interface ReviewPanelProps {
  results: ReviewResult[];
  isLoading: boolean;
  onResultClick: (lineNumber: number) => void;
}

export function ReviewPanel({ results, isLoading, onResultClick }: ReviewPanelProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityText = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Analyzing your code</h3>
        <p className="text-sm text-muted-foreground">Our AI is reviewing your code for potential issues and improvements.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Lightbulb className="h-8 w-8 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium">No issues found</h3>
        <p className="text-sm text-muted-foreground">Your code looks good! Try adding more code or checking different files.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Review Results</h3>
          <span className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? 'issue' : 'issues'} found
          </span>
        </div>
        
        <div className="space-y-4">
          {results.map((result) => (
            <div 
              key={result.id}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50',
                result.severity === 'error' ? 'border-destructive/20' : 
                result.severity === 'warning' ? 'border-yellow-500/20' : 
                'border-blue-500/20'
              )}
              onClick={() => onResultClick(result.lineNumber)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getSeverityIcon(result.severity)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {getSeverityText(result.severity)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Line {result.lineNumber}
                    </span>
                  </div>
                  <p className="text-sm">{result.message}</p>
                  
                  {result.suggestion && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                        <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
                        Suggestion
                      </div>
                      <p className="text-sm">{result.suggestion}</p>
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <pre className="text-xs p-2 bg-muted/30 rounded overflow-x-auto">
                      <code>{result.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
