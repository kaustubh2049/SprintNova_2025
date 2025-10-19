import { Winner, ClassTally, DepartmentTally, ChartData, FestFilter } from '@/lib/types/standings';

export function calculateClassTally(winners: Winner[]): ClassTally[] {
  const classMap = new Map<string, ClassTally>();

  winners.forEach(winner => {
    const key = winner.class_name;
    
    if (!classMap.has(key)) {
      classMap.set(key, {
        className: winner.class_name,
        department: winner.department,
        medals: { gold: 0, silver: 0, bronze: 0, total: 0 },
        rank: 0,
        events: []
      });
    }

    const classTally = classMap.get(key)!;
    
    if (winner.medal === 'gold') classTally.medals.gold++;
    if (winner.medal === 'silver') classTally.medals.silver++;
    if (winner.medal === 'bronze') classTally.medals.bronze++;
    classTally.medals.total++;
    
    if (winner.event_name && !classTally.events.includes(winner.event_name)) {
      classTally.events.push(winner.event_name);
    }
  });

  // Sort by medals and assign ranks
  const sortedClasses = Array.from(classMap.values()).sort((a, b) => {
    if (b.medals.gold !== a.medals.gold) return b.medals.gold - a.medals.gold;
    if (b.medals.silver !== a.medals.silver) return b.medals.silver - a.medals.silver;
    return b.medals.bronze - a.medals.bronze;
  });

  sortedClasses.forEach((classTally, index) => {
    classTally.rank = index + 1;
  });

  return sortedClasses;
}

export function calculateDepartmentTally(winners: Winner[]): DepartmentTally[] {
  const departmentMap = new Map<string, DepartmentTally>();

  winners.forEach(winner => {
    const key = winner.department;
    
    if (!departmentMap.has(key)) {
      departmentMap.set(key, {
        department: winner.department,
        medals: { gold: 0, silver: 0, bronze: 0, total: 0 },
        rank: 0,
        classes: [],
        events: []
      });
    }

    const departmentTally = departmentMap.get(key)!;
    
    if (winner.medal === 'gold') departmentTally.medals.gold++;
    if (winner.medal === 'silver') departmentTally.medals.silver++;
    if (winner.medal === 'bronze') departmentTally.medals.bronze++;
    departmentTally.medals.total++;
    
    if (!departmentTally.classes.includes(winner.class_name)) {
      departmentTally.classes.push(winner.class_name);
    }
    
    if (winner.event_name && !departmentTally.events.includes(winner.event_name)) {
      departmentTally.events.push(winner.event_name);
    }
  });

  // Sort by medals and assign ranks
  const sortedDepartments = Array.from(departmentMap.values()).sort((a, b) => {
    if (b.medals.gold !== a.medals.gold) return b.medals.gold - a.medals.gold;
    if (b.medals.silver !== a.medals.silver) return b.medals.silver - a.medals.silver;
    return b.medals.bronze - a.medals.bronze;
  });

  sortedDepartments.forEach((departmentTally, index) => {
    departmentTally.rank = index + 1;
  });

  return sortedDepartments;
}

export function convertToChartData(data: ClassTally[] | DepartmentTally[]): ChartData[] {
  return data.map(item => ({
    name: 'className' in item ? item.className : item.department,
    gold: item.medals.gold,
    silver: item.medals.silver,
    bronze: item.medals.bronze,
    total: item.medals.total
  }));
}

export function calculateFestTally(winners: Winner[]): ChartData[] {
  const festMap = new Map<string, ChartData>();

  winners.forEach(winner => {
    const festName = winner.fest_name || 'Unknown Fest';
    
    if (!festMap.has(festName)) {
      festMap.set(festName, {
        name: festName,
        gold: 0,
        silver: 0,
        bronze: 0,
        total: 0
      });
    }

    const festTally = festMap.get(festName)!;
    
    if (winner.medal === 'gold') festTally.gold++;
    if (winner.medal === 'silver') festTally.silver++;
    if (winner.medal === 'bronze') festTally.bronze++;
    festTally.total++;
  });

  return Array.from(festMap.values()).sort((a, b) => b.total - a.total);
}

export function filterByFest(winners: Winner[], festFilter: string): Winner[] {
  if (festFilter === 'all') return winners;
  return winners.filter(winner => winner.fest_name === festFilter);
}

export function getTopPerformers(data: ClassTally[] | DepartmentTally[], count: number = 3) {
  return data.slice(0, count);
}

export function getMedalDistribution(data: ClassTally[] | DepartmentTally[]) {
  const total = data.reduce((sum, item) => sum + item.medals.total, 0);
  const gold = data.reduce((sum, item) => sum + item.medals.gold, 0);
  const silver = data.reduce((sum, item) => sum + item.medals.silver, 0);
  const bronze = data.reduce((sum, item) => sum + item.medals.bronze, 0);

  return {
    total,
    gold,
    silver,
    bronze,
    goldPercentage: total > 0 ? (gold / total) * 100 : 0,
    silverPercentage: total > 0 ? (silver / total) * 100 : 0,
    bronzePercentage: total > 0 ? (bronze / total) * 100 : 0
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateExportData(
  classes: ClassTally[],
  departments: DepartmentTally[],
  totalWinners: number
) {
  return {
    classes,
    departments,
    totalWinners,
    exportDate: formatDate(new Date())
  };
}
