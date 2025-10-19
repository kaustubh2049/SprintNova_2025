'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Download, Filter, SortAsc, SortDesc } from 'lucide-react';
import { ClassTally, DepartmentTally, SortOption, TooltipData } from '@/lib/types/standings';
import { cn } from '@/lib/utils';

interface MedalTableProps {
  data: ClassTally[] | DepartmentTally[];
  type: 'class' | 'department';
  onExport?: () => void;
}

const sortOptions: SortOption[] = [
  { value: 'total', label: 'Total Medals' },
  { value: 'gold', label: 'Gold Medals' },
  { value: 'silver', label: 'Silver Medals' },
  { value: 'bronze', label: 'Bronze Medals' },
  { value: 'name', label: 'Name' },
];

export default function MedalTable({ data, type, onExport }: MedalTableProps) {
  const [sortBy, setSortBy] = useState<string>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const sortedData = [...data].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    if (sortBy === 'name') {
      aValue = type === 'class' ? (a as ClassTally).className : (a as DepartmentTally).department;
      bValue = type === 'class' ? (b as ClassTally).className : (b as DepartmentTally).department;
    } else {
      aValue = a.medals[sortBy as keyof typeof a.medals] as number;
      bValue = b.medals[sortBy as keyof typeof b.medals] as number;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500 glow-gold">🥇 1st</Badge>;
    if (index === 1) return <Badge className="bg-gray-400 glow-silver">🥈 2nd</Badge>;
    if (index === 2) return <Badge className="bg-orange-600 glow-bronze">🥉 3rd</Badge>;
    return <Badge variant="outline">{index + 1}th</Badge>;
  };

  const getMedalIcon = (medalType: 'gold' | 'silver' | 'bronze') => {
    const icons = {
      gold: '🥇',
      silver: '🥈',
      bronze: '🥉'
    };
    return icons[medalType];
  };

  const getMedalColor = (medalType: 'gold' | 'silver' | 'bronze') => {
    const colors = {
      gold: 'text-yellow-500',
      silver: 'text-gray-400',
      bronze: 'text-orange-600'
    };
    return colors[medalType];
  };

  const getGlowClass = (medalType: 'gold' | 'silver' | 'bronze') => {
    const glows = {
      gold: 'glow-gold',
      silver: 'glow-silver',
      bronze: 'glow-bronze'
    };
    return glows[medalType];
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="hover-lift"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="hover-lift"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded-md bg-background text-foreground"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="hover-lift"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {type === 'class' ? 'Class' : 'Department'} Medal Tally
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-4 font-semibold">Rank</th>
                    <th className="text-left p-4 font-semibold">
                      {type === 'class' ? 'Class' : 'Department'}
                    </th>
                    {type === 'class' && <th className="text-left p-4 font-semibold">Department</th>}
                    <th className="text-center p-4 font-semibold">🥇 Gold</th>
                    <th className="text-center p-4 font-semibold">🥈 Silver</th>
                    <th className="text-center p-4 font-semibold">🥉 Bronze</th>
                    <th className="text-center p-4 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item, index) => (
                    <tr
                      key={type === 'class' ? (item as ClassTally).className : (item as DepartmentTally).department}
                      className={cn(
                        "border-b hover:bg-muted/20 transition-colors",
                        index < 3 && "bg-gradient-to-r from-primary/5 to-transparent"
                      )}
                    >
                      <td className="p-4">
                        {getRankBadge(index)}
                      </td>
                      <td className="p-4 font-medium">
                        {type === 'class' ? (item as ClassTally).className : (item as DepartmentTally).department}
                      </td>
                      {type === 'class' && (
                        <td className="p-4 text-muted-foreground">
                          {(item as ClassTally).department}
                        </td>
                      )}
                      <td className="p-4 text-center">
                        <div className={cn("text-2xl font-bold", getMedalColor('gold'))}>
                          {item.medals.gold}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className={cn("text-2xl font-bold", getMedalColor('silver'))}>
                          {item.medals.silver}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className={cn("text-2xl font-bold", getMedalColor('bronze'))}>
                          {item.medals.bronze}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {item.medals.total}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {sortedData.map((item, index) => (
          <Card
            key={type === 'class' ? (item as ClassTally).className : (item as DepartmentTally).department}
            className={cn(
              "hover-lift transition-all duration-300",
              index < 3 && "border-2 border-primary/30 glow-primary"
            )}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getRankBadge(index)}
                  <div>
                    <CardTitle className="text-lg">
                      {type === 'class' ? (item as ClassTally).className : (item as DepartmentTally).department}
                    </CardTitle>
                    {type === 'class' && (
                      <p className="text-sm text-muted-foreground">
                        {(item as ClassTally).department}
                      </p>
                    )}
                  </div>
                </div>
                <Trophy className={cn(
                  "h-6 w-6",
                  index === 0 ? 'text-yellow-500' : 
                  index === 1 ? 'text-gray-400' : 
                  index === 2 ? 'text-orange-600' : 'text-muted-foreground'
                )} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={cn("text-2xl font-bold", getMedalColor('gold'))}>
                    {item.medals.gold}
                  </div>
                  <div className="text-xs text-muted-foreground">Gold</div>
                </div>
                <div className="text-center">
                  <div className={cn("text-2xl font-bold", getMedalColor('silver'))}>
                    {item.medals.silver}
                  </div>
                  <div className="text-xs text-muted-foreground">Silver</div>
                </div>
                <div className="text-center">
                  <div className={cn("text-2xl font-bold", getMedalColor('bronze'))}>
                    {item.medals.bronze}
                  </div>
                  <div className="text-xs text-muted-foreground">Bronze</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {item.medals.total}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
