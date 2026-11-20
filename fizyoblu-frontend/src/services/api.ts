import type {
  Service,
  Branch,
  TeamMember,
  Category,
  BlogPost,
  MediaItem,
  ContactMessage,
  User,
  SiteSettings
} from '../types';

const API_BASE = '/api';

function getStoredToken(): string | null {
  return localStorage.getItem('fizyoblu_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('fizyoblu_token', token);
  } else {
    localStorage.removeItem('fizyoblu_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Include credentials for HttpOnly cookie support
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include'
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    setStoredToken(null);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `İşlem gerçekleştirilemedi (${response.status})`);
  }

  return data;
}

export const api = {
  // Public
  getServices: () => request<{ success: boolean; data: Service[] }>('/services'),
  getServiceBySlug: (slug: string) => request<{ success: boolean; data: Service }>(`/services/${slug}`),

  getBranches: () => request<{ success: boolean; data: Branch[] }>('/branches'),

  getTeam: () => request<{ success: boolean; data: TeamMember[] }>('/teamMembers'),

  getCategories: () => request<{ success: boolean; data: Category[] }>('/categories'),

  getBlogPosts: (category?: string, query?: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (query) params.set('q', query);
    const qs = params.toString();
    return request<{ success: boolean; data: BlogPost[] }>(`/blogPosts${qs ? `?${qs}` : ''}`);
  },
  getBlogPostBySlug: (slug: string) => request<{ success: boolean; data: BlogPost }>(`/blogPosts/${slug}`),

  getGallery: (category?: string) => {
    const qs = category ? `?category=${encodeURIComponent(category)}` : '';
    return request<{ success: boolean; data: MediaItem[] }>(`/media/gallery${qs}`);
  },

  getSettings: () => request<{ success: boolean; data: SiteSettings }>('/siteSettings'),

  sendContactMessage: (payload: {
    fullName: string;
    email: string;
    phone: string;
    interestedService?: string;
    preferredBranch?: string;
    message: string;
  }) =>
    request<{ success: boolean; message: string }>('/contactMessages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; data: { token: string; user: User } }>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),

  logout: () =>
    request<{ success: boolean }>('/auth/logout', {
      method: 'POST'
    }),

  getMe: () => request<{ success: boolean; data: User }>('/auth/me'),

  // Admin CRUD: Services
  getAdminServices: () => request<{ success: boolean; data: Service[] }>('/services/admin/all'),
  createService: (service: Partial<Service>) =>
    request<{ success: boolean; data: Service }>('/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    }),
  updateService: (id: number, service: Partial<Service>) =>
    request<{ success: boolean; data: Service }>(`/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    }),
  deleteService: (id: number) =>
    request<{ success: boolean }>(`/services/${id}`, {
      method: 'DELETE'
    }),

  // Admin CRUD: Branches
  getAdminBranches: () => request<{ success: boolean; data: Branch[] }>('/branches/admin/all'),
  createBranch: (branch: Partial<Branch>) =>
    request<{ success: boolean; data: Branch }>('/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branch)
    }),
  updateBranch: (id: number, branch: Partial<Branch>) =>
    request<{ success: boolean; data: Branch }>(`/branches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branch)
    }),
  deleteBranch: (id: number) =>
    request<{ success: boolean }>(`/branches/${id}`, {
      method: 'DELETE'
    }),

  // Admin CRUD: Team Members
  getAdminTeam: () => request<{ success: boolean; data: TeamMember[] }>('/teamMembers/admin/all'),
  createTeamMember: (member: Partial<TeamMember>) =>
    request<{ success: boolean; data: TeamMember }>('/teamMembers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    }),
  updateTeamMember: (id: number, member: Partial<TeamMember>) =>
    request<{ success: boolean; data: TeamMember }>(`/teamMembers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    }),
  deleteTeamMember: (id: number) =>
    request<{ success: boolean }>(`/teamMembers/${id}`, {
      method: 'DELETE'
    }),

  // Admin CRUD: Blog
  getAdminBlogPosts: () => request<{ success: boolean; data: BlogPost[] }>('/blogPosts/admin/all'),
  createBlogPost: (post: Partial<BlogPost>) =>
    request<{ success: boolean; data: BlogPost }>('/blogPosts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    }),
  updateBlogPost: (id: number, post: Partial<BlogPost>) =>
    request<{ success: boolean; data: BlogPost }>(`/blogPosts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    }),
  deleteBlogPost: (id: number) =>
    request<{ success: boolean }>(`/blogPosts/${id}`, {
      method: 'DELETE'
    }),

  // Admin Categories
  createCategory: (cat: { name: string; slug?: string; description?: string }) =>
    request<{ success: boolean; data: Category }>('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    }),
  deleteCategory: (id: number) =>
    request<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE'
    }),

  // Admin Media
  getAllMedia: () => request<{ success: boolean; data: MediaItem[] }>('/media'),
  uploadMedia: (formData: FormData) =>
    request<{ success: boolean; data: MediaItem }>('/media/upload', {
      method: 'POST',
      body: formData
    }),
  deleteMedia: (id: number) =>
    request<{ success: boolean }>(`/media/${id}`, {
      method: 'DELETE'
    }),

  // Admin Messages
  getMessages: (unreadOnly?: boolean) => {
    const qs = unreadOnly ? '?unreadOnly=true' : '';
    return request<{ success: boolean; data: ContactMessage[] }>(`/contactMessages${qs}`);
  },
  updateMessageStatus: (id: number, isRead: boolean, adminNotes?: string) =>
    request<{ success: boolean; data: ContactMessage }>(`/contactMessages/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead, adminNotes })
    }),
  deleteMessage: (id: number) =>
    request<{ success: boolean }>(`/contactMessages/${id}`, {
      method: 'DELETE'
    }),

  // Admin Settings
  updateSettings: (settings: Record<string, string>) =>
    request<{ success: boolean; data: SiteSettings }>('/siteSettings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    })
};
