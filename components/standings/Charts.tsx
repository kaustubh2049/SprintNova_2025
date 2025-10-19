'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartData } from '@/lib/types/standings';

interface ChartsProps {
  classData: ChartData[];
  departmentData: ChartData[];
  festData: ChartData[];
}

const COLORS = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  primary: '#3B82F6'
};

const MEDAL_COLORS = [COLORS.gold, COLORS.silver, COLORS.bronze];

export default function Charts({ classData, departmentData, festData }: ChartsProps) {
  const topClasses = classData.slice(0, 10);
  const topDepartments = departmentData.slice(0, 8);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p style={{ color: data.fill }}>
            {data.name}: {data.value} medals
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bar">Bar Charts</TabsTrigger>
          <TabsTrigger value="pie">Pie Charts</TabsTrigger>
          <TabsTrigger value="fest">Fest Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-6">
          {/* Top Classes Bar Chart */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Top Performing Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topClasses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="gold" stackId="a" fill={COLORS.gold} name="Gold" />
                  <Bar dataKey="silver" stackId="a" fill={COLORS.silver} name="Silver" />
                  <Bar dataKey="bronze" stackId="a" fill={COLORS.bronze} name="Bronze" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Departments Bar Chart */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏢 Top Performing Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topDepartments} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="gold" stackId="a" fill={COLORS.gold} name="Gold" />
                  <Bar dataKey="silver" stackId="a" fill={COLORS.silver} name="Silver" />
                  <Bar dataKey="bronze" stackId="a" fill={COLORS.bronze} name="Bronze" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Medal Distribution Pie Chart */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🥇 Overall Medal Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Gold', value: classData.reduce((sum, item) => sum + item.gold, 0) },
                        { name: 'Silver', value: classData.reduce((sum, item) => sum + item.silver, 0) },
                        { name: 'Bronze', value: classData.reduce((sum, item) => sum + item.bronze, 0) }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {MEDAL_COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top 5 Classes Pie Chart */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏆 Top 5 Classes by Total Medals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={classData.slice(0, 5).map(item => ({
                        name: item.name,
                        value: item.total
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {classData.slice(0, 5).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fest" className="space-y-6">
          {/* Fest-wise Medal Distribution */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎭 Medal Distribution Across Fests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={festData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="gold" stackId="a" fill={COLORS.gold} name="Gold" />
                  <Bar dataKey="silver" stackId="a" fill={COLORS.silver} name="Silver" />
                  <Bar dataKey="bronze" stackId="a" fill={COLORS.bronze} name="Bronze" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fest Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {festData.map((fest, index) => (
              <Card key={fest.name} className="hover-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{fest.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🥇 Gold:</span>
                      <span className="font-semibold text-yellow-500">{fest.gold}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🥈 Silver:</span>
                      <span className="font-semibold text-gray-400">{fest.silver}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🥉 Bronze:</span>
                      <span className="font-semibold text-orange-600">{fest.bronze}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-sm font-medium">Total:</span>
                      <span className="font-bold text-primary">{fest.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
