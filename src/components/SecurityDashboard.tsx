import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Shield, AlertTriangle, CheckCircle, Clock, FileText, Download } from "lucide-react";
import { VulnerabilityTable } from "./VulnerabilityTable";
import { RiskChart } from "./RiskChart";
import { FileUpload } from "./FileUpload";

interface ScanResult {
  totalDependencies: number;
  vulnerableDependencies: number;
  criticalVulns: number;
  highVulns: number;
  mediumVulns: number;
  lowVulns: number;
  riskScore: number;
  scanTime: string;
}

const mockScanResult: ScanResult = {
  totalDependencies: 247,
  vulnerableDependencies: 23,
  criticalVulns: 3,
  highVulns: 7,
  mediumVulns: 9,
  lowVulns: 4,
  riskScore: 8.2,
  scanTime: "2m 14s"
};

export const SecurityDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScan = () => {
    setIsScanning(true);
    setProgress(0);
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-critical text-critical-foreground';
      case 'high': return 'bg-high text-high-foreground';
      case 'medium': return 'bg-medium text-medium-foreground';
      case 'low': return 'bg-low text-low-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-critical';
    if (score >= 6) return 'text-high';
    if (score >= 4) return 'text-medium';
    return 'text-low';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Security Vulnerability Scanner</h1>
              <p className="text-muted-foreground">Maven Project CVE Analysis Tool</p>
            </div>
          </div>
          {scanComplete && (
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>

        {/* Upload Section */}
        {!scanComplete && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Maven Project
              </CardTitle>
              <CardDescription>
                Upload your pom.xml files or project directory for comprehensive vulnerability analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onScan={handleScan} />
            </CardContent>
          </Card>
        )}

        {/* Scanning Progress */}
        {isScanning && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 animate-spin text-primary" />
                  <div>
                    <h3 className="font-semibold">Scanning Dependencies...</h3>
                    <p className="text-sm text-muted-foreground">
                      Analyzing pom.xml files and querying CVE databases
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Progress: {Math.round(progress)}% • Estimated time remaining: {Math.max(0, Math.round((100 - progress) * 0.02))}m
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Dashboard */}
        {scanComplete && (
          <>
            {/* Risk Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                      <p className={`text-2xl font-bold ${getRiskColor(mockScanResult.riskScore)}`}>
                        {mockScanResult.riskScore}/10
                      </p>
                    </div>
                    <AlertTriangle className={`h-8 w-8 ${getRiskColor(mockScanResult.riskScore)}`} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Dependencies</p>
                      <p className="text-2xl font-bold">{mockScanResult.totalDependencies}</p>
                    </div>
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vulnerable Dependencies</p>
                      <p className="text-2xl font-bold text-high">{mockScanResult.vulnerableDependencies}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-high" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Scan Time</p>
                      <p className="text-2xl font-bold text-low">{mockScanResult.scanTime}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-low" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Severity Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-critical">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Badge className={getSeverityColor('critical')}>Critical</Badge>
                    <p className="text-2xl font-bold">{mockScanResult.criticalVulns}</p>
                    <p className="text-xs text-muted-foreground">Immediate action required</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-high">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Badge className={getSeverityColor('high')}>High</Badge>
                    <p className="text-2xl font-bold">{mockScanResult.highVulns}</p>
                    <p className="text-xs text-muted-foreground">Patch within 7 days</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-medium">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Badge className={getSeverityColor('medium')}>Medium</Badge>
                    <p className="text-2xl font-bold">{mockScanResult.mediumVulns}</p>
                    <p className="text-xs text-muted-foreground">Patch within 30 days</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-low">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Badge className={getSeverityColor('low')}>Low</Badge>
                    <p className="text-2xl font-bold">{mockScanResult.lowVulns}</p>
                    <p className="text-xs text-muted-foreground">Monitor for updates</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Critical Vulnerabilities Alert */}
            {mockScanResult.criticalVulns > 0 && (
              <Alert className="border-critical/50 bg-critical/5">
                <AlertTriangle className="h-4 w-4 text-critical" />
                <AlertTitle className="text-critical">Critical Vulnerabilities Detected</AlertTitle>
                <AlertDescription>
                  Found {mockScanResult.criticalVulns} critical vulnerabilities requiring immediate attention. 
                  Review the detailed report below and apply patches as soon as possible.
                </AlertDescription>
              </Alert>
            )}

            {/* Detailed Analysis */}
            <Tabs defaultValue="vulnerabilities" className="space-y-4">
              <TabsList>
                <TabsTrigger value="vulnerabilities">Vulnerability Details</TabsTrigger>
                <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vulnerabilities" className="space-y-4">
                <VulnerabilityTable />
              </TabsContent>
              
              <TabsContent value="risk-analysis" className="space-y-4">
                <RiskChart />
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Patch Recommendations</CardTitle>
                    <CardDescription>
                      Prioritized list of actions to improve your security posture
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 border border-critical/20 rounded-lg bg-critical/5">
                        <div className="p-1 bg-critical/10 rounded">
                          <AlertTriangle className="h-4 w-4 text-critical" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-critical">Priority 1: Critical Vulnerabilities</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Update Apache Commons FileUpload to version 1.5.0 or later (CVE-2023-24998)
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 border border-high/20 rounded-lg bg-high/5">
                        <div className="p-1 bg-high/10 rounded">
                          <AlertTriangle className="h-4 w-4 text-high" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-high">Priority 2: High Severity Issues</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Upgrade Jackson Databind to version 2.15.2 or later (CVE-2023-35116)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};