import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, FolderOpen, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onScan: () => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export const FileUpload = ({ onScan }: FileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  const processFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(file => 
      file.name.endsWith('.xml') || 
      file.name === 'pom.xml' ||
      file.type === 'application/xml' ||
      file.type === 'text/xml'
    );

    if (validFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload pom.xml files or XML files only.",
        variant: "destructive"
      });
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type || 'application/xml'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files Uploaded",
      description: `Successfully uploaded ${newFiles.length} file(s)`,
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleStartScan = () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please upload at least one pom.xml file to start scanning.",
        variant: "destructive"
      });
      return;
    }
    
    onScan();
    toast({
      title: "Scan Started",
      description: "Beginning comprehensive vulnerability analysis...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card 
        className={`transition-all duration-200 ${
          isDragOver 
            ? 'border-primary border-2 bg-primary/5' 
            : 'border-dashed border-2 border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Maven Project Files</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Drag and drop your pom.xml files here, or click to browse. 
            Supports multiple files and nested project structures.
          </p>
          <div className="flex gap-2">
            <Button variant="default">
              <input
                type="file"
                multiple
                accept=".xml,application/xml,text/xml"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FolderOpen className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Example pom.xml
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Uploaded Files ({files.length})
          </h4>
          
          <div className="grid gap-2">
            {files.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">XML</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Scan Button */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Ready to Scan</h4>
                  <p className="text-sm text-muted-foreground">
                    {files.length} file(s) uploaded • CVE database ready
                  </p>
                </div>
                <Button 
                  onClick={handleStartScan}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Start Security Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};