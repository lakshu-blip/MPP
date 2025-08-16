import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ImportProblems() {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV or Excel file containing the problems data.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      // For CSV files, parse directly
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const problems = parseCSV(text);
        await importProblems(problems);
      } else {
        toast({
          title: "Excel Support",
          description: "Please convert your Excel file to CSV format for import.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the problems. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      return {
        title: values[headers.indexOf('title')] || values[0],
        description: values[headers.indexOf('description')] || values[1] || 'Problem description',
        difficulty: (values[headers.indexOf('difficulty')] || values[2] || 'Medium') as 'Easy' | 'Medium' | 'Hard',
        topics: (values[headers.indexOf('topics')] || values[3] || 'Arrays').split(';').filter(Boolean),
        companies: (values[headers.indexOf('companies')] || values[4] || 'FAANG').split(';').filter(Boolean),
        leetcodeId: parseInt(values[headers.indexOf('leetcodeId')] || values[5]) || null,
        solution: values[headers.indexOf('solution')] || values[6] || 'Solution approach',
        patterns: (values[headers.indexOf('patterns')] || values[7] || '').split(';').filter(Boolean),
        hints: (values[headers.indexOf('hints')] || values[8] || '').split(';').filter(Boolean),
        timeComplexity: values[headers.indexOf('timeComplexity')] || values[9] || 'O(n)',
        spaceComplexity: values[headers.indexOf('spaceComplexity')] || values[10] || 'O(1)',
        importOrder: index + 1,
      };
    });
  };

  const importProblems = async (problems: any[]) => {
    const batchSize = 10;
    let imported = 0;

    for (let i = 0; i < problems.length; i += batchSize) {
      const batch = problems.slice(i, i + batchSize);
      
      try {
        await apiRequest('POST', '/api/problems/import', { problems: batch });
        imported += batch.length;
        setImportedCount(imported);
        setImportProgress((imported / problems.length) * 100);
      } catch (error) {
        console.error(`Error importing batch ${i / batchSize + 1}:`, error);
      }
    }

    toast({
      title: "Import Complete",
      description: `Successfully imported ${imported} problems out of ${problems.length}`,
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <header className="bg-dark-secondary border-b border-dark-border p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary">Import Problems</h2>
          <p className="text-text-secondary">Upload your Excel/CSV file containing the 350 problems</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-dark-secondary border-dark-border">
          <CardHeader>
            <CardTitle className="text-text-primary">File Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-dark-border rounded-lg p-8 text-center">
              <i className="fas fa-cloud-upload-alt text-4xl text-text-muted mb-4"></i>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Upload Problems File
              </h3>
              <p className="text-text-secondary mb-4">
                Select a CSV file containing your 350 coding problems
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,.xlsx"
                className="hidden"
                data-testid="file-input"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="bg-accent-blue hover:bg-accent-blue/80"
                data-testid="button-upload"
              >
                <i className="fas fa-upload mr-2"></i>
                {isImporting ? 'Importing...' : 'Choose File'}
              </Button>
            </div>

            {isImporting && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Importing problems... ({importedCount} imported)
                  </span>
                  <span className="text-sm text-accent-blue">
                    {Math.round(importProgress)}%
                  </span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>
            )}

            <div className="bg-dark-surface p-4 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Expected CSV Format:</h4>
              <div className="text-sm text-text-secondary space-y-1 font-mono">
                <div>title,description,difficulty,topics,companies,leetcodeId,solution,patterns,hints,timeComplexity,spaceComplexity</div>
                <div className="text-xs mt-2">
                  • Separate multiple topics/companies/patterns/hints with semicolons (;)
                  • Difficulty should be: Easy, Medium, or Hard
                  • LeetCode ID should be a number (optional)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}