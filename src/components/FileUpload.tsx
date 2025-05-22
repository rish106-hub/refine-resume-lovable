
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  isLoading: boolean;
}

const FileUpload = ({ onFileChange, isLoading }: FileUploadProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };
  
  const handleFiles = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    onFileChange(file);
  };
  
  return (
    <Card className={`border-2 border-dashed ${dragActive ? 'border-primary' : 'border-muted'} transition-all duration-200`}>
      <CardContent className="p-6">
        <div 
          className="flex flex-col items-center justify-center py-10"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-1">Upload your resume</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Drag & drop your PDF resume here or click to browse
          </p>
          
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
          >
            Select PDF
          </Button>
          
          {selectedFile && (
            <div className="mt-4 text-center">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
