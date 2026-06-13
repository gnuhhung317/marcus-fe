import {
  AcademyMetricsData,
  BlogPageData,
  BlogPost,
  ResearchLibraryFile,
  ResearchPageData,
  ResearchReport,
  TrainingCourse,
  TrainingPageData,
} from '@/lib/contracts/types';
import {
  requestContractJson,
  toNumber,
  normalizeCourseLevel,
  clamp,
  toDateOnly,
} from '@/lib/services/base.service';

// --- Internal Response Interfaces ---

interface AcademyCourseSummaryResponse {
  courseId?: string;
  title?: string;
  level?: string;
  progress?: number;
  modules?: number;
  durationHours?: number;
}

interface AcademyCoursesResponse {
  items?: AcademyCourseSummaryResponse[];
}

interface AcademyMetricsResponse {
  activeStudents?: number;
  botsDeployed?: number;
  averagePerformancePercent?: number;
  academyRating?: number;
}

interface BlogPostSummaryResponse {
  postId?: string;
  title?: string;
  category?: string;
  excerpt?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
}

interface BlogPostsResponse {
  items?: BlogPostSummaryResponse[];
}

interface ResearchReportSummaryResponse {
  reportId?: string;
  title?: string;
  category?: string;
  summary?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
}

interface ResearchReportsResponse {
  items?: ResearchReportSummaryResponse[];
}

interface ResearchLibraryFileResponse {
  fileId?: string;
  title?: string;
  format?: string;
  sizeMb?: number;
}

// --- Defaults ---

const defaultAcademyMetrics: AcademyMetricsData = {
  activeStudents: 0,
  botsDeployed: 0,
  averagePerformancePercent: 0,
  academyRating: 0,
};

// --- Mapping Helpers ---

function mapAcademyCourse(item: AcademyCourseSummaryResponse, index: number): TrainingCourse {
  const modules = Math.max(0, Math.round(toNumber(item.modules)));
  const durationHours = Math.max(0, toNumber(item.durationHours));
  const generatedSummary = modules > 0 || durationHours > 0
    ? `${modules || 0} modules · ${durationHours.toFixed(1)}h guided content.`
    : 'Practical algorithmic modules with execution-focused labs.';

  return {
    id: item.courseId ?? `course-${index + 1}`,
    title: item.title ?? `Academy Course ${index + 1}`,
    level: normalizeCourseLevel(item.level),
    progress: clamp(Math.round(toNumber(item.progress, 0)), 0, 100),
    summary: generatedSummary,
  };
}

function mapBlogPost(item: BlogPostSummaryResponse, index: number): BlogPost {
  const readTimeMinutes = Math.max(1, Math.round(toNumber(item.readTimeMinutes, NaN)));

  return {
    id: item.postId ?? `post-${index + 1}`,
    title: item.title ?? `Market Insight ${index + 1}`,
    category: item.category ?? 'Insights',
    excerpt: item.excerpt ?? 'No excerpt available yet.',
    readTime: Number.isFinite(readTimeMinutes) ? `${readTimeMinutes} min` : '5 min',
  };
}

function mapResearchReport(item: ResearchReportSummaryResponse, index: number): ResearchReport {
  const readTimeMinutes = Math.max(1, Math.round(toNumber(item.readTimeMinutes, NaN)));

  return {
    id: item.reportId ?? `report-${index + 1}`,
    title: item.title ?? `Research Report ${index + 1}`,
    category: item.category ?? 'Research',
    readTime: Number.isFinite(readTimeMinutes) ? `${readTimeMinutes} min` : '8 min',
    publishedAt: toDateOnly(item.publishedAt, '2026-01-01'),
  };
}

function mapResearchLibraryFile(item: ResearchLibraryFileResponse, index: number): ResearchLibraryFile {
  return {
    fileId: item.fileId ?? `file-${index + 1}`,
    title: item.title ?? `Research File ${index + 1}`,
    format: item.format ?? 'PDF',
    sizeMb: Math.max(0, toNumber(item.sizeMb, 1.2)),
  };
}

// --- Service Functions ---

export async function getTrainingPageData(): Promise<TrainingPageData> {
  const [coursesResponse, metricsResponse] = await Promise.all([
    requestContractJson<AcademyCoursesResponse>('academy-courses', {
      queryParams: { limit: 12 },
    }),
    requestContractJson<AcademyMetricsResponse>('academy-metrics'),
  ]);

  const courses = (coursesResponse.items ?? []).map((course, index) => mapAcademyCourse(course, index));
  const metrics: AcademyMetricsData = {
    activeStudents: Math.max(0, Math.round(toNumber(metricsResponse?.activeStudents, defaultAcademyMetrics.activeStudents))),
    botsDeployed: Math.max(0, Math.round(toNumber(metricsResponse?.botsDeployed, defaultAcademyMetrics.botsDeployed))),
    averagePerformancePercent: toNumber(metricsResponse?.averagePerformancePercent, defaultAcademyMetrics.averagePerformancePercent),
    academyRating: toNumber(metricsResponse?.academyRating, defaultAcademyMetrics.academyRating),
  };

  return {
    courses,
    metrics,
  };
}

export async function getBlogPageData(): Promise<BlogPageData> {
  const response = await requestContractJson<BlogPostsResponse>('content-blog', {
    queryParams: { page: 0, size: 12 },
  });

  const posts = (response.items ?? []).map((item, index) => mapBlogPost(item, index));

  return {
    posts,
  };
}

export async function getResearchPageData(): Promise<ResearchPageData> {
  const [reportsResponse, libraryResponse] = await Promise.all([
    requestContractJson<ResearchReportsResponse>('content-research', {
      queryParams: { page: 0, size: 12 },
    }),
    requestContractJson<ResearchLibraryFileResponse[]>('content-research-library', {
      queryParams: { limit: 8 },
    }),
  ]);

  const reports = (reportsResponse.items ?? []).map((item, index) => mapResearchReport(item, index));
  const library = libraryResponse.map((item, index) => mapResearchLibraryFile(item, index));

  return {
    reports,
    library,
  };
}
