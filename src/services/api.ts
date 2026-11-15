
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

export interface FeedbackData {
  course_name: string;
  instructor_name: string;
  rating: number;
  comment: string;
}

export interface FeedbackResponse extends FeedbackData {
  id: number;
  sentiment?: string | null;
  sentiment_score?: number | null;
  created_at?: string | null;
}

export interface AnalyticsData {
  total_feedback: number;
  average_rating: number;
  positive_feedback: number;
  negative_feedback: number;
  neutral_feedback: number;
}

export interface CourseAnalytics {
  course_name: string;
  instructor_name: string;
  total_feedback: number;
  average_rating: number;
}

export interface SentimentAnalytics {
  course_name: string;
  instructor_name: string;
  positive: number;
  negative: number;
  neutral: number;
}

async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function submitFeedback(data: FeedbackData) {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to submit feedback');
  }

  return response.json() as Promise<FeedbackResponse>;
}

export function getAnalytics() {
  return apiRequest<AnalyticsData>('/analytics');
}

export function getCourseAnalytics() {
  return apiRequest<CourseAnalytics[]>('/analytics/courses');
}

export function getSentimentAnalytics() {
  return apiRequest<SentimentAnalytics[]>('/analytics/sentiment');
}

export function getAllFeedback() {
  return apiRequest<FeedbackResponse[]>('/feedback');
}
