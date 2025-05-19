import axios from 'axios';

// Base API instance
const BASE_URL ='http://localhost:8080';

const api = axios.create({
    baseURL: BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPaymentById = async (id) => {
  try {
      const response = await api.get(`/payment/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error fetching payment with ID ${id}:`, error);
      throw error;
  }
};

export const bookDairyProduct = (bookingData) => api.post('/api/bookings/book', bookingData);

export const getAllBookings = () => api.get('/api/bookings/all');
// Function to handle API errors
const handleApiError = (error) => {
    if (error.response) {
        console.error('API Error:', error.response.data);
        throw new Error(error.response.data.message || 'An error occurred');
    } else {
        console.error('API Error:', error.message);
        throw new Error('Network error: ' + error.message);
    }
};
export const updateProfile = async (userId, profileData) => {
  try {
      const response = await api.put(`/updateProfile`, profileData, {
          params: { userId },
          headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
  } catch (error) {
      handleApiError(error);
  }
};



export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
export const resetPassword = async (data) => {
    const response = await fetch('/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        try {
            const errorData = await response.json(); // Attempt to parse error details from JSON
            throw new Error(errorData.message || 'Failed to reset password');
        } catch (error) {
            throw new Error('Failed to reset password: ' + response.statusText||error.message);
            // Fallback for non-JSON response
        }
    }

    const responseData = await response.json(); // Always expect valid JSON response here
    return { success: responseData.success, message: responseData.message };
};

export const forgotPassword = async (data) => {
    try {
        const response = await api.post('/forgot-password', data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const userProfileUpdate = async (userId, formData) => {
    try {
        const response = await api.put(`/users/update/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Register a new user
export const registerUser = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        if (error.response) {
            throw new Error(error.response?.data?.message || 'Error registering user');
        } else if (error.request) {
            throw new Error('No response from server. Please try again.');
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

// Log in a user
export const login = async (loginData) => {
    try {
        const response = await api.post('/login', loginData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Verify account with OTP
export const verifyAccount = async (email, otp) => {
    try {
        const response = await axios.put(`${BASE_URL}/verify`, { email, otp });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error verifying account';
    }
};

// Regenerate OTP
export const regenerateOtp = async (email) => {
    try {
        const response = await axios.put(`${BASE_URL}/regenerate-otp`, null, {
            params: { email },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error regenerating OTP';
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
const Product_BASE_URL =`${BASE_URL}/products`;


export const getAllProducts  = async () => {
  try {
      const response = await api.get('/products/all');
      return response.data;
  } catch (error) {
      handleApiError(error);
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${Product_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${Product_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (formData) => {
  try {
    const response = await axios.post(`${Product_BASE_URL}/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(`${Product_BASE_URL}/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${Product_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
//wishlist:
export const WishlistAPI = {
    // Get wishlist items for a user
    getWishlist: async (userId) => {
        try {
            const response = await api.get(`/wishlist/${userId}`);
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // Add a product to the wishlist
    addToWishlist: async (userId, productId) => {
        try {
            const response = await api.post(`/wishlist/${userId}/${productId}`);
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // Remove a product from the wishlist
    removeFromWishlist: async (userId, productId) => {
        try {
            const response = await api.delete(`/wishlist/${userId}/${productId}`);
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
};

// 🛒 **Cart API**
export const CartAPI = {
    // Get cart items by user ID
    getCart: async (userId) => {
      try {
        const response = await api.get(`/cart/${userId}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
  
    // Add a product to the cart
    addToCart: async (userId, productId, quantity) => {
      try {
        const response = await api.post(`/cart/${userId}/${productId}/${quantity}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    updateCart: async (userId, productId, newQuantity) => {
        try {
          const response = await api.put(`/cart/${userId}/${productId}/${newQuantity}`);
          return response.data;
        } catch (error) {
          handleApiError(error);
        }
      },
    // Remove a product from the cart
    removeFromCart: async (userId, productId) => {
      try {
        const response = await api.delete(`/cart/${userId}/${productId}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    clearCart: async (userId) => {
      try {
          const response = await api.delete(`/cart/clear/${userId}`);
          return response.data;
      } catch (error) {
          console.error(error);
      }
  }
  };
  // Payment API
export const PaymentAPI = {
  // Register a payment account
  registerPaymentAccount: async (userId, paymentData) => {
      try {
          const response = await api.post(`/api/payment/register/${userId}`, paymentData);
          return response.data;
      } catch (error) {
          handleApiError(error);
      }
  },

  // Get payment account by user ID
  getPaymentAccountByUserId: async (userId) => {
      try {
          const response = await api.get(`/api/payment/user/${userId}`);
          return response.data;
      } catch (error) {
          handleApiError(error);
      }
  },
  getOrdersBySeller: async (sellerId) => {
    try {
      const response = await api.get(`/payment/merchant/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      throw error;
    }
  },
  getOrdersByCustomer: async (customerId) => {
    try {
      const response = await api.get(`/payment/customer/orders/${customerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      throw error;
    }
  },
};

// Function to create a payment order
export const createOrder = async (productId, amount) => {
  try {
      const response = await api.post('/payment/create', {
          productId,
          amount,
      });
      return response.data;
  } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw error;
  }
};


export const getRecommendations = async (userId) => {
  const response = await api.get(`/recommendations/${userId}`);
  return response.data;
};
export const getOrdersByCustomer = async (orderId) => {
  try {
      const response = await api.get(`/payment/customer/${orderId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
  }
};

// Get orders by merchant (seller) ID
export const getOrdersBySeller = async (sellerId) => {
  try {
      const response = await api.get(`/payment/merchant/${sellerId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching seller orders:', error);
      throw error;
  }
};
