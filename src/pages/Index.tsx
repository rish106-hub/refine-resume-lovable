
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResumeRefiner from "@/components/ResumeRefiner";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 pt-6 md:pt-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Lovable Resume Refiner</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your resume, specify your target job role, and let AI enhance your resume to stand out from the competition.
          </p>
        </div>
        
        <Card className="border shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Enhance Your Resume</CardTitle>
            <CardDescription>
              Get your resume optimized for Applicant Tracking Systems and hiring managers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeRefiner />
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by Gemini AI. Your resume data is processed securely and never stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
