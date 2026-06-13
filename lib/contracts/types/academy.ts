export interface TrainingCourse {
  id: string;
  title: string;
  level: 'FOUNDATION' | 'ADVANCED' | 'EXPERT';
  progress: number;
  summary: string;
}

export interface AcademyMetricsData {
  activeStudents: number;
  botsDeployed: number;
  averagePerformancePercent: number;
  academyRating: number;
}

export interface TrainingPageData {
  courses: TrainingCourse[];
  metrics: AcademyMetricsData;
}

export interface ResearchReport {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
}

export interface ResearchLibraryFile {
  fileId: string;
  title: string;
  format: string;
  sizeMb: number;
}

export interface ResearchPageData {
  reports: ResearchReport[];
  library: ResearchLibraryFile[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
}

export interface BlogPageData {
  posts: BlogPost[];
}
