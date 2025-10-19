export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface ClassTally {
  className: string;
  department: string;
  medals: MedalCount;
  rank: number;
  events: string[];
}

export interface DepartmentTally {
  department: string;
  medals: MedalCount;
  rank: number;
  classes: string[];
  events: string[];
}

export interface Winner {
  id: string;
  event_id: string;
  student_name: string;
  class_name: string;
  department: string;
  medal: 'gold' | 'silver' | 'bronze';
  event_name?: string;
  fest_name?: string;
  created_at: string;
}

export interface FestFilter {
  id: string;
  name: string;
  type: 'cultural' | 'technical' | 'sports';
}

export interface SortOption {
  value: string;
  label: string;
}

export interface ExportData {
  classes: ClassTally[];
  departments: DepartmentTally[];
  totalWinners: number;
  exportDate: string;
}

export interface ChartData {
  name: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface TooltipData {
  eventName: string;
  festName: string;
  studentName: string;
  medal: string;
}
