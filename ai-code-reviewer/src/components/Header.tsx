import { Code2, Github, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">AI Code Reviewer</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/yourusername/ai-code-reviewer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub repository"
          >
            <Github className="h-5 w-5" />
          </a>
          
          <div className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </header>
  );
}
