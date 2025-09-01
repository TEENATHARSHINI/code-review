import { useState } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { ReviewPanel } from './components/ReviewPanel';
import { Header } from './components/Header';
import { Toaster } from './components/ui/toast';

type ReviewResult = {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  lineNumber: number;
  codeSnippet: string;
  suggestion?: string;
};

export default function App() {
  const [code, setCode] = useState<string>('// Paste or type your code here\n// Our AI will analyze it for potential issues, best practices, and improvements');
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [reviewResults, setReviewResults] = useState<ReviewResult[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'review'>('code');
  const [language, setLanguage] = useState<string>('javascript');

  const handleCodeChange = (value: string = '') => {
    setCode(value);
  };

  const handleReview = async () => {
    if (!code.trim()) return;
    
    setIsReviewing(true);
    setActiveTab('review');
    
    try {
      // Simulate API call to AI code review service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock review results
      const mockResults: ReviewResult[] = [
        {
          id: '1',
          message: 'Consider adding error handling for async operations',
          severity: 'warning',
          lineNumber: 5,
          codeSnippet: 'fetch(url).then(response => response.json())',
          suggestion: 'Add try/catch block to handle potential errors in async operations.'
        },
        {
          id: '2',
          message: 'Unused variable detected',
          severity: 'warning',
          lineNumber: 8,
          codeSnippet: 'const unusedVar = 42;',
          suggestion: 'Remove the unused variable or use it in your code.'
        },
        {
          id: '3',
          message: 'Consider using async/await for better readability',
          severity: 'info',
          lineNumber: 12,
          codeSnippet: '.then(data => processData(data))',
          suggestion: 'Convert to: const data = await fetchData(); processData(data);'
        }
      ];
      
      setReviewResults(mockResults);
    } catch (error) {
      console.error('Error during code review:', error);
      // In a real app, you would show an error toast here
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
          {/* Code Editor Section */}
          <div className={`flex-1 flex flex-col ${activeTab === 'code' ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Code Editor</h2>
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-background border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
                <button
                  onClick={handleReview}
                  disabled={isReviewing || !code.trim()}
                  className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isReviewing ? 'Reviewing...' : 'Review Code'}
                </button>
                <button
                  onClick={() => setActiveTab('review')}
                  className="lg:hidden bg-secondary text-secondary-foreground px-4 py-1.5 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  View Review
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-lg border">
              <CodeEditor
                code={code}
                language={language}
                onChange={handleCodeChange}
                readOnly={isReviewing}
                reviewResults={reviewResults}
              />
            </div>
          </div>

          {/* Review Panel */}
          <div className={`lg:w-96 flex flex-col ${activeTab === 'review' ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Code Review</h2>
              <button
                onClick={() => setActiveTab('code')}
                className="lg:hidden bg-secondary text-secondary-foreground px-4 py-1.5 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Back to Code
              </button>
            </div>
            <div className="flex-1 overflow-hidden rounded-lg border">
              <ReviewPanel 
                results={reviewResults} 
                isLoading={isReviewing} 
                onResultClick={(lineNumber) => {
                  // In a real implementation, you would scroll to the specific line in the editor
                  console.log('Navigate to line:', lineNumber);
                }}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}
