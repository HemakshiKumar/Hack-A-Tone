const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  message?: string;
  token?: string;
  data?: T;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async signup(userData: SignupData): Promise<ApiResponse> {
    return this.request('/api/v1/user/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signin(userData: SigninData): Promise<ApiResponse> {
    return this.request('/api/v1/user/signin', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<ApiResponse> {
    return this.request('/api/v1/user/profile', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth utilities
export const authUtils = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};