import axios from 'axios';

const API_BASE_URL = 'https://ismaal.taamsolutions.net';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Submission API functions
export const submissionApi = {
  // Get all pending submissions from all sources (including plan upgrade requests)
  getAllSubmissions: async () => {
    try {
      // Fetch from all four endpoints in parallel
      const [productsRes, professionalsRes, businessesRes, planRequestsRes] = await Promise.allSettled([
        api.get('/api/products/pending'),
        api.get('/api/professionals/pending'),
        api.get('/api/businesses/pending'),
        api.get('/api/upgrade-requests'),
      ]);

      const submissions = [];

      // Process products
      if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
        const products = Array.isArray(productsRes.value.data) 
          ? productsRes.value.data 
          : productsRes.value.data.products || [];
        products.forEach((item) => {
          submissions.push({
            ...item,
            type: 'Product',
            submissionType: 'product',
          });
        });
      }

      // Process professionals
      if (professionalsRes.status === 'fulfilled' && professionalsRes.value?.data) {
        const professionals = Array.isArray(professionalsRes.value.data)
          ? professionalsRes.value.data
          : professionalsRes.value.data.professionals || [];
        professionals.forEach((item) => {
          submissions.push({
            ...item,
            type: 'Professional',
            submissionType: 'professional',
          });
        });
      }

      // Process businesses
      if (businessesRes.status === 'fulfilled' && businessesRes.value?.data) {
        const businesses = Array.isArray(businessesRes.value.data)
          ? businessesRes.value.data
          : businessesRes.value.data.businesses || [];
        businesses.forEach((item) => {
          submissions.push({
            ...item,
            type: 'Business',
            submissionType: 'business',
          });
        });
      }

      // Process plan upgrade requests
      if (planRequestsRes.status === 'fulfilled' && planRequestsRes.value?.data) {
        const planRequests = Array.isArray(planRequestsRes.value.data)
          ? planRequestsRes.value.data
          : planRequestsRes.value.data?.requests || [];
        planRequests.forEach((item) => {
          submissions.push({
            ...item,
            type: 'Plan Request',
            submissionType: 'planRequest',
            name: `Plan Upgrade: ${item.currentPlan?.name || 'Current'} → ${item.requestedPlan?.name || 'Requested'}`,
          });
        });
      }

      // Sort by submission date (newest first)
      submissions.sort((a, b) => {
        const dateA = new Date(a.submittedDate || a.createdAt);
        const dateB = new Date(b.submittedDate || b.createdAt);
        return dateB - dateA;
      });

      return submissions;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  },

  // Approve a submission based on type
  approveSubmission: async (id, submissionType, adminNotes) => {
    try {
      let response;
      if (submissionType === 'planRequest') {
        response = await api.put(`/api/admin/upgrade-requests/${id}/status`, {
          status: 'APPROVED',
          adminNotes: adminNotes || null,
        });
      } else {
        let endpoint;
        switch (submissionType) {
          case 'product':
            endpoint = `/api/products/${id}/approve`;
            break;
          case 'professional':
            endpoint = `/api/professionals/${id}/approve`;
            break;
          case 'business':
            endpoint = `/api/businesses/${id}/approve`;
            break;
          default:
            throw new Error('Unknown submission type');
        }
        response = await api.put(endpoint);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('APPROVE endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error approving submission:', error);
      throw error;
    }
  },

  // Reject a submission based on type
  rejectSubmission: async (id, submissionType, adminNotes) => {
    try {
      let response;
      if (submissionType === 'planRequest') {
        response = await api.put(`/api/admin/upgrade-requests/${id}/status`, {
          status: 'REJECTED',
          adminNotes: adminNotes || null,
        });
      } else {
        let endpoint;
        switch (submissionType) {
          case 'product':
            endpoint = `/api/products/${id}/reject`;
            break;
          case 'professional':
            endpoint = `/api/professionals/${id}/reject`;
            break;
          case 'business':
            endpoint = `/api/businesses/${id}/reject`;
            break;
          default:
            throw new Error('Unknown submission type');
        }
        response = await api.put(endpoint);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('REJECT endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error rejecting submission:', error);
      throw error;
    }
  },

  // Delete a submission based on type
  deleteSubmission: async (id, submissionType) => {
    try {
      let endpoint;
      switch (submissionType) {
        case 'product':
          endpoint = `/api/products/${id}`;
          break;
        case 'professional':
          endpoint = `/api/professionals/${id}`;
          break;
        case 'business':
          endpoint = `/api/businesses/${id}`;
          break;
        default:
          throw new Error('Unknown submission type');
      }

      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('DELETE endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error deleting submission:', error);
      throw error;
    }
  },
};

export default submissionApi;
