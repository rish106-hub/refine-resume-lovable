
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { extractTextFromPDF } from '@/utils/pdfUtils';
import { enhanceResume } from '@/utils/gemini';
import FileUpload from './FileUpload';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download } from 'lucide-react';

const ResumeRefiner = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('');
  const [originalResume, setOriginalResume] = useState('');
  const [enhancedResume, setEnhancedResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file upload
  const handleFileChange = async (file: File) => {
    setFile(file);
    setIsLoading(true);
    
    try {
      const text = await extractTextFromPDF(file);
      setOriginalResume(text);
      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract text from PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalResume) {
      toast({
        title: "No resume",
        description: "Please upload a resume first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!jobRole) {
      toast({
        title: "No job role",
        description: "Please enter a target job role.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const improved = await enhanceResume({
        resumeText: originalResume,
        jobRole
      });
      
      setEnhancedResume(improved);
      toast({
        title: "Resume enhanced",
        description: "Your resume has been successfully enhanced.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle download of enhanced resume
  const handleDownload = () => {
    if (!enhancedResume) return;
    
    const blob = new Blob([enhancedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-resume-${jobRole.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FileUpload onFileChange={handleFileChange} isLoading={isLoading} />
        
        <div className="space-y-2">
          <Label htmlFor="job-role">Target Job Role</Label>
          <Input
            id="job-role"
            placeholder="e.g., Full Stack Developer, Product Manager"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            disabled={isProcessing}
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isProcessing || !originalResume || !jobRole}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing Resume...
            </>
          ) : (
            'Enhance Resume'
          )}
        </Button>
      </form>
      
      {enhancedResume && (
        <div className="mt-8 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Enhanced Resume</h3>
                <Button variant="outline" onClick={handleDownload} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download as TXT
                </Button>
              </div>
              
              <Textarea
                value={enhancedResume}
                onChange={(e) => setEnhancedResume(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResumeRefiner;
