import { useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value?: string) => void;
  readOnly?: boolean;
  reviewResults?: {
    id: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    lineNumber: number;
    codeSnippet: string;
    suggestion?: string;
  }[];
}

export function CodeEditor({ 
  code, 
  language, 
  onChange, 
  readOnly = false,
  reviewResults = []
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorations = useRef<string[]>([]);

  // Handle editor mount
  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor, 
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    
    // Register custom theme
    monaco.editor.defineTheme('code-review-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.lineHighlightBackground': '#f5f5f5',
      },
    });
    
    monaco.editor.setTheme('code-review-theme');
    
    // Add keyboard shortcut for formatting (Shift + Alt + F)
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      () => {
        editor.getAction('editor.action.formatDocument')?.run();
      }
    );
  };

  // Update decorations when review results change
  useEffect(() => {
    if (!editorRef.current || !reviewResults.length) {
      return;
    }

    const newDecorations = reviewResults.map(result => ({
      range: {
        startLineNumber: result.lineNumber,
        startColumn: 1,
        endLineNumber: result.lineNumber,
        endColumn: 1,
      },
      options: {
        isWholeLine: true,
        className: `review-highlight review-${result.severity}`,
        glyphMarginClassName: `review-glyph review-glyph-${result.severity}`,
        glyphMarginHoverMessage: {
          value: `**${result.message}**\n\n${result.suggestion || ''}`,
          isTrusted: true,
          supportThemeIcons: true,
        },
        hoverMessage: {
          value: `**${result.message}**\n\n${result.suggestion || ''}`,
          isTrusted: true,
          supportThemeIcons: true,
        },
      },
    }));

    decorations.current = editorRef.current.deltaDecorations(
      [],
      newDecorations
    );

    return () => {
      if (editorRef.current) {
        editorRef.current.deltaDecorations(decorations.current, []);
      }
    };
  }, [reviewResults]);

  // Update editor options when readOnly changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme="vs"
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          readOnly,
          renderLineHighlight: 'all',
          renderWhitespace: 'selection',
          tabSize: 2,
          glyphMargin: true,
          lineNumbersMinChars: 3,
          folding: true,
          lineDecorationsWidth: 10,
          contextmenu: true,
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
        }}
      />
      <style jsx global>{`
        .monaco-editor .review-highlight {
          background-color: rgba(250, 204, 21, 0.1) !important;
        }
        .monaco-editor .review-error {
          background-color: rgba(239, 68, 68, 0.1) !important;
        }
        .monaco-editor .review-warning {
          background-color: rgba(234, 179, 8, 0.1) !important;
        }
        .monaco-editor .review-info {
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
        .monaco-editor .review-glyph {
          width: 8px !important;
          margin-left: 5px !important;
          border-radius: 50%;
          background-color: #f59e0b;
        }
        .monaco-editor .review-glyph-error {
          background-color: #ef4444;
        }
        .monaco-editor .review-glyph-warning {
          background-color: #eab308;
        }
        .monaco-editor .review-glyph-info {
          background-color: #3b82f6;
        }
        .monaco-editor .line-numbers {
          color: #9ca3af !important;
        }
        .monaco-editor .margin {
          background-color: #f9fafb;
        }
        .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input {
          background-color: #f9fafb !important;
        }
      `}</style>
    </div>
  );
}
