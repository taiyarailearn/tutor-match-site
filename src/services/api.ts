import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-fastapi-backend.com' 
  : 'http://localhost:8000';

class ApiService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.detail || error.message || 'Request failed');
    }

    return response.json();
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(data: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Job endpoints
  async getJobs() {
    return this.request('/jobs');
  }

  async createJob(data: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Connection endpoints
  async getConnections() {
    return this.request('/connections');
  }

  async createConnection(connected_user_id: string) {
    return this.request('/connections', {
      method: 'POST',
      body: JSON.stringify({ connected_user_id }),
    });
  }

  // Message endpoints
  async sendMessage(receiver_id: string, content: string) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiver_id, content }),
    });
  }

  async getConversation(other_id: string) {
    return this.request(`/messages/${other_id}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();