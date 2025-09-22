import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const severityData = [
  { name: 'Critical', value: 3, color: 'hsl(var(--critical))' },
  { name: 'High', value: 7, color: 'hsl(var(--high))' },
  { name: 'Medium', value: 9, color: 'hsl(var(--medium))' },
  { name: 'Low', value: 4, color: 'hsl(var(--low))' }
];

const cvssDistribution = [
  { range: '9.0-10.0', count: 3, severity: 'Critical' },
  { range: '7.0-8.9', count: 7, severity: 'High' },
  { range: '4.0-6.9', count: 9, severity: 'Medium' },
  { range: '0.0-3.9', count: 4, severity: 'Low' }
];

const dependencyRisk = [
  { name: 'commons-fileupload', risk: 9.8, vulnerabilities: 1 },
  { name: 'jackson-databind', risk: 8.1, vulnerabilities: 1 },
  { name: 'spring-web', risk: 7.5, vulnerabilities: 1 },
  { name: 'spring-security', risk: 6.2, vulnerabilities: 2 },
  { name: 'apache-commons', risk: 5.3, vulnerabilities: 3 },
  { name: 'junit', risk: 3.1, vulnerabilities: 1 },
];

export const RiskChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Severity Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Severity Distribution</CardTitle>
          <CardDescription>
            Breakdown of vulnerabilities by severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CVSS Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>CVSS Score Distribution</CardTitle>
          <CardDescription>
            Distribution of vulnerabilities by CVSS score ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cvssDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* High-Risk Dependencies */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Dependencies by Risk Level</CardTitle>
          <CardDescription>
            Your most vulnerable dependencies ranked by highest CVSS score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dependencyRisk} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 10]} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'risk' ? `${value} CVSS Score` : `${value} vulnerabilities`,
                  name === 'risk' ? 'Risk Score' : 'Vulnerabilities'
                ]}
              />
              <Bar 
                dataKey="risk" 
                fill="hsl(var(--high))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};