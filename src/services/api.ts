
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

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function authHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = 'Bearer ' + token;
  }

  return headers;
}

async function apiRequest<T>(
  endpoint: string,
  options?: { method?: string; body?: unknown; token?: string },
): Promise<T> {
  const response = await fetch(API_BASE_URL + endpoint, {
    method: options?.method || 'GET',
    headers: authHeaders(options?.token),
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Request failed: ' + response.status);
  }

  return response.json();
}

export async function submitFeedback(
  data: FeedbackData,
  token?: string,
): Promise<FeedbackResponse> {
  const response = await fetch(API_BASE_URL + '/feedback', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to submit feedback');
  }

  return response.json() as Promise<FeedbackResponse>;
}

export function getAnalytics(token?: string) {
  return apiRequest<AnalyticsData>('/analytics', { token });
}

export function getCourseAnalytics(token?: string) {
  return apiRequest<CourseAnalytics[]>('/analytics/courses', { token });
}

export function getSentimentAnalytics(token?: string) {
  return apiRequest<SentimentAnalytics[]>('/analytics/sentiment', { token });
}

export function getAllFeedback(token?: string) {
  return apiRequest<FeedbackResponse[]>('/feedback', { token });
}

export function getAdminUsers(token?: string) {
  return apiRequest<User[]>('/admin/users', { token });
}

export function createAdminUser(
  data: { name: string; email: string; password: string; role: 'student' | 'faculty' },
  token?: string,
) {
  return apiRequest<User>('/admin/users', {
    method: 'POST',
    body: data,
    token,
  });
}
