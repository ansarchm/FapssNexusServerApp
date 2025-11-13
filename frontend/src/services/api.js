// src/services/api.js - WITH LED PRODUCT SERVICE
import axios from 'axios';

// Your .NET API base URL
const API_BASE_URL = 'https://localhost:7221/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 30000,
});

// ============================================
// REQUEST INTERCEPTOR - Add JWT token
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token attached to request');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Handle errors globally
// ============================================
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.message);
    
    if (error.response) {
      console.error('📛 Error details:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized - but DON'T auto-redirect
      if (error.response.status === 401) {
        console.error('🚫 Unauthorized - Token may be invalid or expired');
        // Let the component handle the redirect instead
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (username, password) => {
    console.log('🔐 Attempting login...');
    return api.post('/Auth/login', {
      username,
      password,
      lastActivity: 0,
      locationmapid: "string"
    });
  },
  
  logout: () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem('token');
    console.log('🔍 Is authenticated:', hasToken);
    return hasToken;
  }
};

// Card Product Service - Fixed for database schema
export const cardProductService = {
  // Get all card products
  getCardProducts: async () => {
    try {
      if (!authAPI.isAuthenticated()) {
        throw new Error('Not authenticated. Please login first.');
      }

      console.log('🔍 Fetching card products...');
      const response = await api.post('/GetCardProducts', {});
      console.log('📦 Card products response:', response.data);
      
      if (response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching card products:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to API. Make sure your .NET API is running on https://localhost:7221');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Check if CardProductController exists.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response?.data?.detail || error.message}`);
      }
      
      throw error;
    }
  },

  // Get card product by ID
  getCardProductById: async (id) => {
    try {
      console.log('🔍 Fetching card product by ID:', id);
      const response = await api.post('/GetCardProductById', { Id: parseInt(id) });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching card product by ID:', error);
      throw error;
    }
  },

  // Add new card product
  addCardProduct: async (productData) => {
    try {
      console.log('➕ Adding card product:', productData);
      
      // Validation check before sending
      if (!productData.ProductName || productData.ProductName.trim() === "") {
        throw new Error("Product name is required");
      }
      
      // Ensure all required fields are present and properly formatted
      const payload = {
        ProductName: productData.ProductName.trim(),
        PType: productData.PType || "New Card",
        Price: parseFloat(productData.Price) || 0, // Changed from Rate to Price
        Tax: parseFloat(productData.Tax) || 0,
        Status: productData.Status || "1",
        Sequence: parseInt(productData.Sequence) || 0,
        Bonus: parseFloat(productData.Bonus) || 0,
        Duration: parseInt(productData.Duration) || 0,
        CashBalance: parseFloat(productData.CashBalance) || 0,
        TimebandType: productData.TimebandType || "Flexible",
        TaxType: productData.TaxType || "Included",
        GateIp: productData.GateIp || "",
        DepositAmount: parseFloat(productData.DepositAmount) || 0,
        Kot: parseInt(productData.Kot) || 0,
        FavoriteFlag: parseInt(productData.FavoriteFlag) || 0,
        CustomerCard: parseInt(productData.CustomerCard) || 0,
        Kiosk: parseInt(productData.Kiosk) || 0,
        RegMan: parseInt(productData.RegMan) || 0,
        TypeGate: productData.TypeGate || "",
        GateValue: productData.GateValue || "",
        CommonFlag: parseInt(productData.CommonFlag) || 0,
        Expiry: parseInt(productData.Expiry) || 0,
        EnableLed: parseInt(productData.EnableLed) || 0,
        Green: parseInt(productData.Green) || 0,
        Blue: parseInt(productData.Blue) || 0,
        Red: parseInt(productData.Red) || 0,
        CardValidity: productData.CardValidity ? parseInt(productData.CardValidity) : null,
        CardExpiryDate: productData.CardExpiryDate || null,
        VipCard: parseInt(productData.VipCard) || 0,
        PosCounter: productData.PosCounter || "", // Not from database
        TaxCategory: productData.TaxCategory || "",
        PriceNoTax: productData.PriceNoTax ? parseFloat(productData.PriceNoTax) : null,
        DisplayInPos: productData.DisplayInPos || "1",
        SellingPrice: productData.SellingPrice ? parseFloat(productData.SellingPrice) : null,
        CardQuantity: productData.CardQuantity ? parseInt(productData.CardQuantity) : null,
        Membership: productData.Membership || "",
        AccessProfile: productData.AccessProfile || ""
      };

      console.log('📤 Sending payload:', payload);

      const response = await api.post('/AddCardProduct', payload);
      console.log('✅ Card product added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding card product:', error);
      
      // Log detailed error information
      if (error.response?.data?.errors) {
        console.error('🔴 Validation errors:', error.response.data.errors);
      }
      
      throw error;
    }
  },

  // Update card product
  updateCardProduct: async (productData) => {
    try {
      console.log('🔄 Updating card product:', productData);
      
      // Ensure proper data types for update
      const payload = {
        id: parseInt(productData.id),
        productname: String(productData.ProductName || ""),
        category: "Card category",
        ptype: String(productData.PType || "New Card"),
        rate: parseFloat(productData.Price) || 0, // Price maps to rate in DB
        tax: parseFloat(productData.Tax) || 0,
        status: String(productData.Status || "1"),
        sequence: parseInt(productData.Sequence) || 0,
        bonus: parseFloat(productData.Bonus) || 0,
        duration: parseInt(productData.Duration) || 0,
        cashbalance: parseFloat(productData.CashBalance) || 0,
        timebandtype: String(productData.TimebandType || "Flexible"),
        taxtype: String(productData.TaxType || "Included"),
        gateip: String(productData.GateIp || ""),
        depositamount: parseFloat(productData.DepositAmount) || 0,
        kot: parseInt(productData.Kot) || 0,
        favoriteflag: parseInt(productData.FavoriteFlag) || 0,
        customercard: parseInt(productData.CustomerCard) || 0,
        kiosk: parseInt(productData.Kiosk) || 0,
        regman: parseInt(productData.RegMan) || 0,
        typegate: String(productData.TypeGate || ""),
        gatevalue: String(productData.GateValue || ""),
        commonflag: parseInt(productData.CommonFlag) || 0,
        expiry: parseInt(productData.Expiry) || 0,
        enableled: parseInt(productData.EnableLed) || 0,
        green: parseInt(productData.Green) || 0,
        blue: parseInt(productData.Blue) || 0,
        red: parseInt(productData.Red) || 0,
        cardvalidity: parseInt(productData.CardValidity) || 0,
        cardexpirydate: productData.CardExpiryDate || null,
        vipcard: parseInt(productData.VipCard) || 0,
        poscounter: String(productData.PosCounter || ""),
        taxcategory: String(productData.TaxCategory || ""),
        pricenotax: parseFloat(productData.PriceNoTax) || 0,
        displayinpos: String(productData.DisplayInPos || "1"),
        sellingprice: parseFloat(productData.SellingPrice) || 0,
        cardquantity: parseInt(productData.CardQuantity) || 0,
        membership: String(productData.Membership || ""),
        accessprofile: String(productData.AccessProfile || "")
      };

      console.log('📤 Sending update payload:', payload);
      
      const response = await api.post('/UpdateCardProduct', payload);
      console.log('✅ Card product updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating card product:', error);
      
      if (error.response?.data?.errors) {
        console.error('🔴 Validation errors:', error.response.data.errors);
      }
      
      throw error;
    }
  },

  // Delete card product (soft delete)
  deleteCardProduct: async (id) => {
    try {
      console.log('🗑️ Deleting card product:', id);
      const response = await api.post('/DeleteCardProduct', { Id: parseInt(id) });
      console.log('✅ Card product deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting card product:', error);
      throw error;
    }
  }
};
// ============================================
// TIME PRODUCT SERVICE
// ============================================
export const timeProductService = {
  // Get all time products
  getTimeProducts: async () => {
    try {
      if (!authAPI.isAuthenticated()) {
        throw new Error('Not authenticated. Please login first.');
      }

      console.log('⏰ Fetching time products...');
      const response = await api.post('/GetTimeProducts', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        }
      });

      console.log('📦 Time products response:', response.data);

      // Normalize and return data safely
      if (response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching time products:', error);

      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to API. Make sure your .NET API is running on https://localhost:7221');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Check if GetTimeProducts exists.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response?.data?.detail || error.message}`);
      }

      throw error;
    }
  },

  // Get time product by ID
  getTimeProductById: async (id) => {
    try {
      console.log('⏰ Fetching time product by ID:', id);
      const response = await api.post('/GetTimeProductById', { Id: id });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching time product by ID:', error);
      throw error;
    }
  },

  // Add new time product
  addTimeProduct: async (productData) => {
    try {
      console.log('➕ Adding time product:', productData);
      
      const payload = {
        ProductName: productData.productname || productData.ProductName,
        Category: "TimeBand Categoryyy",
        PType: productData.ptype || productData.PType || "Time",
        Rate: productData.rate || productData.Rate || 0,
        Tax: productData.tax || productData.Tax || 0,
        Status: productData.status || productData.Status || "1",
        Sequence: productData.sequence || productData.Sequence || 0,
        Bonus: productData.bonus || productData.Bonus || 0,
        Duration: productData.duration || productData.Duration || 0,
        CashBalance: productData.cashbalance || productData.CashBalance || 0,
        TimebandType: productData.timebandtype || productData.TimebandType || "Flexible",
        TaxType: productData.taxtype || productData.TaxType || "Included",
        GateIp: productData.gateip || productData.GateIp || "",
        DepositAmount: productData.depositamount || productData.DepositAmount || 0,
        Kot: productData.kot || productData.Kot || 0,
        FavoriteFlag: productData.favoriteflag || productData.FavoriteFlag || 0,
        CustomerCard: productData.customercard || productData.CustomerCard || 0,
        Kiosk: productData.kiosk || productData.Kiosk || 0,
        RegMan: productData.regman || productData.RegMan || 0,
        TypeGate: productData.typegate || productData.TypeGate || "",
        GateValue: productData.gatevalue || productData.GateValue || "",
        CommonFlag: productData.commonflag || productData.CommonFlag || 0,
        Expiry: productData.expiry || productData.Expiry || 0,
        EnableLed: productData.enableled || productData.EnableLed || 0,
        Green: productData.green || productData.Green || 0,
        Blue: productData.blue || productData.Blue || 0,
        Red: productData.red || productData.Red || 0,
        Membership: productData.membership || productData.Membership || "",
        CardValidity: productData.cardvalidity || productData.CardValidity || 0,
        CardExpiryDate: productData.cardexpirydate || productData.CardExpiryDate || null,
        VipCard: productData.vipcard || productData.VipCard || 0,
        PosCounter: productData.poscounter || productData.PosCounter || "",
        TaxCategory: productData.taxcategory || productData.TaxCategory || "",
        TaxPercent: productData.taxpercent || productData.TaxPercent || 0,
        PriceNoTax: productData.pricenotax || productData.PriceNoTax || 0,
        DisplayInPos: productData.displayinpos || productData.DisplayInPos || "1",
        FaceValue: productData.facevalue || productData.FaceValue || 0,
        SellingPrice: productData.sellingprice || productData.SellingPrice || 0,
        CardQuantity: productData.cardquantity || productData.CardQuantity || 0,
        AccessProfile: productData.accessprofile || productData.AccessProfile || ""
      };

      const response = await api.post('/AddTimeProduct', payload);
      console.log('✅ Time product added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding time product:', error);
      throw error;
    }
  },

  // Update time product
  updateTimeProduct: async (productData) => {
    try {
      console.log('🔄 Updating time product:', productData);
      const response = await api.post('/UpdateTimeProduct', productData);
      console.log('✅ Time product updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating time product:', error);
      throw error;
    }
  },

  // Delete time product (soft delete)
  deleteTimeProduct: async (id) => {
    try {
      console.log('🗑️ Deleting time product:', id);
      const response = await api.post('/DeleteTimeProduct', { Id: id });
      console.log('✅ Time product deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting time product:', error);
      throw error;
    }
  }
};

// ============================================
// LED PRODUCT SERVICE
// ============================================
export const ledProductService = {
  // Get all LED products
  getLedProducts: async () => {
    try {
      if (!authAPI.isAuthenticated()) {
        throw new Error('Not authenticated. Please login first.');
      }

      console.log('💡 Fetching LED products...');
      const response = await api.post('/GetLedProducts', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        }
      });

      console.log('📦 LED products response:', response.data);

      // Normalize and return data safely
      if (response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching LED products:', error);

      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to API. Make sure your .NET API is running on https://localhost:7221');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Check if GetLedProducts exists.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response?.data?.detail || error.message}`);
      }

      throw error;
    }
  },

  // Get LED product by ID
  getLedProductById: async (id) => {
    try {
      console.log('💡 Fetching LED product by ID:', id);
      const response = await api.post('/GetLedProductById', { Id: id });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching LED product by ID:', error);
      throw error;
    }
  },

  // Add new LED product
  addLedProduct: async (productData) => {
    try {
      console.log('➕ Adding LED product:', productData);
      
      const payload = {
        ProductName: productData.productname || productData.ProductName,
        Category: "LED Products",
        PType: productData.ptype || productData.PType || "Product",
        Rate: productData.rate || productData.Rate || 0,
        Tax: productData.tax || productData.Tax || 0,
        Status: productData.status || productData.Status || "1",
        Sequence: productData.sequence || productData.Sequence || 0,
        Bonus: productData.bonus || productData.Bonus || 0,
        Duration: productData.duration || productData.Duration || 0,
        CashBalance: productData.cashbalance || productData.CashBalance || 0,
        TimebandType: productData.timebandtype || productData.TimebandType || "Flexible",
        TaxType: productData.taxtype || productData.TaxType || "Included",
        GateIp: productData.gateip || productData.GateIp || "",
        DepositAmount: productData.depositamount || productData.DepositAmount || 0,
        Kot: productData.kot || productData.Kot || 0,
        FavoriteFlag: productData.favoriteflag || productData.FavoriteFlag || 0,
        CustomerCard: productData.customercard || productData.CustomerCard || 0,
        Kiosk: productData.kiosk || productData.Kiosk || 0,
        RegMan: productData.regman || productData.RegMan || 0,
        TypeGate: productData.typegate || productData.TypeGate || "",
        GateValue: productData.gatevalue || productData.GateValue || "",
        CommonFlag: productData.commonflag || productData.CommonFlag || 0,
        Expiry: productData.expiry || productData.Expiry || 0,
        EnableLed: productData.enableled || productData.EnableLed || 0,
        Green: productData.green || productData.Green || 0,
        Blue: productData.blue || productData.Blue || 0,
        Red: productData.red || productData.Red || 0,
        Membership: productData.membership || productData.Membership || "",
        CardValidity: productData.cardvalidity || productData.CardValidity || 0,
        CardExpiryDate: productData.cardexpirydate || productData.CardExpiryDate || null,
        VipCard: productData.vipcard || productData.VipCard || 0,
        PosCounter: productData.poscounter || productData.PosCounter || "",
        TaxCategory: productData.taxcategory || productData.TaxCategory || "",
        TaxPercent: productData.taxpercent || productData.TaxPercent || 0,
        PriceNoTax: productData.pricenotax || productData.PriceNoTax || 0,
        DisplayInPos: productData.displayinpos || productData.DisplayInPos || "1",
        FaceValue: productData.facevalue || productData.FaceValue || 0,
        SellingPrice: productData.sellingprice || productData.SellingPrice || 0,
        CardQuantity: productData.cardquantity || productData.CardQuantity || 0,
        AccessProfile: productData.accessprofile || productData.AccessProfile || ""
      };

      const response = await api.post('/AddLedProduct', payload);
      console.log('✅ LED product added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding LED product:', error);
      throw error;
    }
  },

  // Update LED product
  updateLedProduct: async (productData) => {
    try {
      console.log('🔄 Updating LED product:', productData);
      const response = await api.post('/UpdateLedProduct', productData);
      console.log('✅ LED product updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating LED product:', error);
      throw error;
    }
  },

  // Delete LED product (soft delete)
  deleteLedProduct: async (id) => {
    try {
      console.log('🗑️ Deleting LED product:', id);
      const response = await api.post('/DeleteLedProduct', { Id: id });
      console.log('✅ LED product deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting LED product:', error);
      throw error;
    }
  }
};

// ============================================
// LOCATION SERVICE
// ============================================
export const locationService = {
  // Get all locations (existing method - keeping for backward compatibility)
  getLocations: async () => {
    try {
      const response = await api.post('/GetLocations', {});
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching locations:', error);
      throw error;
    }
  },

  // Get all locations (new REST-style endpoint)
  getAllLocations: async () => {
    try {
      console.log('🔍 Fetching all locations...');
      const response = await api.get('/Location/all');
      console.log('📦 Locations response:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching all locations:', error);
      throw error;
    }
  },
  
  // Get single location by ID
  getLocationById: async (locationId) => {
    try {
      console.log('🔍 Fetching location by ID:', locationId);
      const response = await api.get(`/Location/details/${locationId}`);
      console.log('📦 Location details:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching location by ID:', error);
      throw error;
    }
  },
  
  // Update location
  updateLocation: async (locationData) => {
    try {
      console.log('🔄 Updating location:', locationData);
      const response = await api.put('/Location/update', locationData);
      console.log('✅ Location updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating location:', error);
      throw error;
    }
  }
};

export const locationAPI = locationService;


// ============================================
// COMBO PRODUCT SERVICE
// ============================================
export const comboProductService = {
  // Get all combo products
  getComboProducts: async () => {
    try {
      if (!authAPI.isAuthenticated()) {
        throw new Error('Not authenticated. Please login first.');
      }

      console.log('🎁 Fetching combo products...');
      const response = await api.post('/GetComboProducts', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        }
      });

      console.log('📦 Combo products response:', response.data);

      // Normalize and return data safely
      if (response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching combo products:', error);

      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to API. Make sure your .NET API is running on https://localhost:7221');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Check if GetComboProducts exists.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response?.data?.detail || error.message}`);
      }

      throw error;
    }
  },

  // Get combo product by ID
  getComboProductById: async (id) => {
    try {
      console.log('🎁 Fetching combo product by ID:', id);
      const response = await api.post('/GetComboProductById', { Id: id });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching combo product by ID:', error);
      throw error;
    }
  },

  // Add new combo product
  addComboProduct: async (productData) => {
    try {
      console.log('➕ Adding combo product:', productData);
      
      const payload = {
        ProductName: productData.productname || productData.ProductName,
        Category: "Combo List",
        PType: productData.ptype || productData.PType || "Combo",
        Rate: productData.rate || productData.Rate || 0,
        Tax: productData.tax || productData.Tax || 0,
        Status: productData.status || productData.Status || "1",
        Sequence: productData.sequence || productData.Sequence || 0,
        Bonus: productData.bonus || productData.Bonus || 0,
        Duration: productData.duration || productData.Duration || 0,
        CashBalance: productData.cashbalance || productData.CashBalance || 0,
        TimebandType: productData.timebandtype || productData.TimebandType || "Flexible",
        TaxType: productData.taxtype || productData.TaxType || "Included",
        GateIp: productData.gateip || productData.GateIp || "",
        DepositAmount: productData.depositamount || productData.DepositAmount || 0,
        Kot: productData.kot || productData.Kot || 0,
        FavoriteFlag: productData.favoriteflag || productData.FavoriteFlag || 0,
        CustomerCard: productData.customercard || productData.CustomerCard || 0,
        Kiosk: productData.kiosk || productData.Kiosk || 0,
        RegMan: productData.regman || productData.RegMan || 0,
        TypeGate: productData.typegate || productData.TypeGate || "",
        GateValue: productData.gatevalue || productData.GateValue || "",
        CommonFlag: productData.commonflag || productData.CommonFlag || 0,
        Expiry: productData.expiry || productData.Expiry || 0,
        EnableLed: productData.enableled || productData.EnableLed || 0,
        Green: productData.green || productData.Green || 0,
        Blue: productData.blue || productData.Blue || 0,
        Red: productData.red || productData.Red || 0,
        Membership: productData.membership || productData.Membership || "",
        CardValidity: productData.cardvalidity || productData.CardValidity || 0,
        CardExpiryDate: productData.cardexpirydate || productData.CardExpiryDate || null,
        VipCard: productData.vipcard || productData.VipCard || 0,
        PosCounter: productData.poscounter || productData.PosCounter || "",
        TaxCategory: productData.taxcategory || productData.TaxCategory || "",
        TaxPercent: productData.taxpercent || productData.TaxPercent || 0,
        PriceNoTax: productData.pricenotax || productData.PriceNoTax || 0,
        DisplayInPos: productData.displayinpos || productData.DisplayInPos || "1",
        FaceValue: productData.facevalue || productData.FaceValue || 0,
        SellingPrice: productData.sellingprice || productData.SellingPrice || 0,
        CardQuantity: productData.cardquantity || productData.CardQuantity || 0,
        AccessProfile: productData.accessprofile || productData.AccessProfile || ""
      };

      const response = await api.post('/AddComboProduct', payload);
      console.log('✅ Combo product added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding combo product:', error);
      throw error;
    }
  },

  // Update combo product
  updateComboProduct: async (productData) => {
    try {
      console.log('🔄 Updating combo product:', productData);
      const response = await api.post('/UpdateComboProduct', productData);
      console.log('✅ Combo product updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating combo product:', error);
      throw error;
    }
  },

  // Delete combo product (soft delete)
  deleteComboProduct: async (id) => {
    try {
      console.log('🗑️ Deleting combo product:', id);
      const response = await api.post('/DeleteComboProduct', { Id: id });
      console.log('✅ Combo product deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting combo product:', error);
      throw error;
    }
  }
};


// ============================================
// STICKER PRODUCT SERVICE
// ============================================
export const stickerProductService = {
  // Get all sticker products
  getStickerProducts: async () => {
    try {
      if (!authAPI.isAuthenticated()) {
        throw new Error('Not authenticated. Please login first.');
      }

      console.log('🎨 Fetching sticker products...');
      const response = await api.post('/GetStickerProducts', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        }
      });

      console.log('📦 Sticker products response:', response.data);

      // Normalize and return data safely
      if (response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching sticker products:', error);

      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to API. Make sure your .NET API is running on https://localhost:7221');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Check if GetStickerProducts exists.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response?.data?.detail || error.message}`);
      }

      throw error;
    }
  },

  // Get sticker product by ID
  getStickerProductById: async (id) => {
    try {
      console.log('🎨 Fetching sticker product by ID:', id);
      const response = await api.post('/GetStickerProductById', { Id: id });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching sticker product by ID:', error);
      throw error;
    }
  },

  // Add new sticker product
  addStickerProduct: async (productData) => {
    try {
      console.log('➕ Adding sticker product:', productData);
      
      const payload = {
        ProductName: productData.productname || productData.ProductName,
        Category: "Sticker",
        PType: productData.ptype || productData.PType || "Sticker",
        Rate: productData.rate || productData.Rate || 0,
        Tax: productData.tax || productData.Tax || 0,
        Status: productData.status || productData.Status || "1",
        Sequence: productData.sequence || productData.Sequence || 0,
        Bonus: productData.bonus || productData.Bonus || 0,
        Duration: productData.duration || productData.Duration || 0,
        CashBalance: productData.cashbalance || productData.CashBalance || 0,
        TimebandType: productData.timebandtype || productData.TimebandType || "Flexible",
        TaxType: productData.taxtype || productData.TaxType || "Included",
        GateIp: productData.gateip || productData.GateIp || "",
        DepositAmount: productData.depositamount || productData.DepositAmount || 0,
        Kot: productData.kot || productData.Kot || 0,
        FavoriteFlag: productData.favoriteflag || productData.FavoriteFlag || 0,
        CustomerCard: productData.customercard || productData.CustomerCard || 0,
        Kiosk: productData.kiosk || productData.Kiosk || 0,
        RegMan: productData.regman || productData.RegMan || 0,
        TypeGate: productData.typegate || productData.TypeGate || "",
        GateValue: productData.gatevalue || productData.GateValue || "",
        CommonFlag: productData.commonflag || productData.CommonFlag || 0,
        Expiry: productData.expiry || productData.Expiry || 0,
        EnableLed: productData.enableled || productData.EnableLed || 0,
        Green: productData.green || productData.Green || 0,
        Blue: productData.blue || productData.Blue || 0,
        Red: productData.red || productData.Red || 0,
        Membership: productData.membership || productData.Membership || "",
        CardValidity: productData.cardvalidity || productData.CardValidity || 0,
        CardExpiryDate: productData.cardexpirydate || productData.CardExpiryDate || null,
        VipCard: productData.vipcard || productData.VipCard || 0,
        PosCounter: productData.poscounter || productData.PosCounter || "",
        TaxCategory: productData.taxcategory || productData.TaxCategory || "",
        TaxPercent: productData.taxpercent || productData.TaxPercent || 0,
        PriceNoTax: productData.pricenotax || productData.PriceNoTax || 0,
        DisplayInPos: productData.displayinpos || productData.DisplayInPos || "1",
        FaceValue: productData.facevalue || productData.FaceValue || 0,
        SellingPrice: productData.sellingprice || productData.SellingPrice || 0,
        CardQuantity: productData.cardquantity || productData.CardQuantity || 0,
        AccessProfile: productData.accessprofile || productData.AccessProfile || "",
        GameTime: productData.gamed || productData.GameTime || 0
      };

      const response = await api.post('/AddStickerProduct', payload);
      console.log('✅ Sticker product added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding sticker product:', error);
      throw error;
    }
  },

  // Update sticker product
  updateStickerProduct: async (productData) => {
    try {
      console.log('🔄 Updating sticker product:', productData);
      const response = await api.post('/UpdateStickerProduct', productData);
      console.log('✅ Sticker product updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating sticker product:', error);
      throw error;
    }
  },

  // Delete sticker product (soft delete)
  deleteStickerProduct: async (id) => {
    try {
      console.log('🗑️ Deleting sticker product:', id);
      const response = await api.post('/DeleteStickerProduct', { Id: id });
      console.log('✅ Sticker product deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting sticker product:', error);
      throw error;
    }
  }







  
};
// ============================================
// GAME SETTINGS SERVICE - CORRECTED VERSION
// ============================================
export const gameSettingsService = {
  // Get all game settings
  getAllGameSettings: async () => {
    try {
      if (!authAPI.isAuthenticated()) {
        throw new Error('Not authenticated. Please login first.');
      }

      console.log('🎮 Fetching all game settings...');
      const response = await api.post('/GetAllGameSettings', {});
      console.log('📦 Game settings response:', response.data);
      
      // Normalize response
      if (response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching game settings:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to API. Make sure your .NET API is running on https://localhost:7221');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Check if GetAllGameSettings exists.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response?.data?.detail || error.message}`);
      }
      
      throw error;
    }
  },

  // Get game setting by ID
  getGameSettingById: async (id) => {
    try {
      console.log('🎮 Fetching game setting by ID:', id);
      const response = await api.post('/GetGameSettingById', { Id: parseInt(id) });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching game setting by ID:', error);
      throw error;
    }
  },

  // Add new game setting
  addGameSetting: async (settingData) => {
    try {
      console.log('➕ Adding game setting:', settingData);
      
      // Validation
      if (!settingData.Description || settingData.Description.trim() === "") {
        throw new Error("Description is required");
      }
      
      // Prepare payload matching your controller's expected format
      const payload = {
        Description: settingData.Description?.trim() || "",
        MacId: settingData.MacId || "",
        Category: settingData.Category || "",
        SubCategory: settingData.SubCategory || "",
        CashPlayPrice: parseFloat(settingData.CashPlayPrice) || 0,
        VipDiscountPrice: parseFloat(settingData.VipDiscountPrice) || 0,
        CoinPlayPrice: parseFloat(settingData.CoinPlayPrice) || 0,
        GameInterface: settingData.GameInterface || "",
        CurrencyDecimalPlace: settingData.CurrencyDecimalPlace || "",
        DebitOrder: settingData.DebitOrder || "",
        PulseWidth: settingData.PulseWidth || "",
        PulsePauseWidth: settingData.PulsePauseWidth || "",
        PulseToActuate: settingData.PulseToActuate || "",
        RfidTapDelay: settingData.RfidTapDelay || "",
        DisplayOrientation: settingData.DisplayOrientation || "",
        LedPattern: settingData.LedPattern || ""
      };

      console.log('📤 Sending payload:', payload);

      const response = await api.post('/AddGameSetting', payload);
      console.log('✅ Game setting added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding game setting:', error);
      
      if (error.response?.data?.errors) {
        console.error('🔴 Validation errors:', error.response.data.errors);
      }
      
      throw error;
    }
  },

  // Update game setting
  updateGameSetting: async (settingData) => {
    try {
      console.log('🔄 Updating game setting:', settingData);
      
      if (!settingData.Id || settingData.Id === 0) {
        throw new Error("Game setting ID is required for update");
      }

      // Prepare payload
      const payload = {
        Id: parseInt(settingData.Id),
        Description: settingData.Description?.trim() || "",
        MacId: settingData.MacId || "",
        Category: settingData.Category || "",
        SubCategory: settingData.SubCategory || "",
        CashPlayPrice: parseFloat(settingData.CashPlayPrice) || 0,
        VipDiscountPrice: parseFloat(settingData.VipDiscountPrice) || 0,
        CoinPlayPrice: parseFloat(settingData.CoinPlayPrice) || 0,
        GameInterface: settingData.GameInterface || "",
        CurrencyDecimalPlace: settingData.CurrencyDecimalPlace || "",
        DebitOrder: settingData.DebitOrder || "",
        PulseWidth: settingData.PulseWidth || "",
        PulsePauseWidth: settingData.PulsePauseWidth || "",
        PulseToActuate: settingData.PulseToActuate || "",
        RfidTapDelay: settingData.RfidTapDelay || "",
        DisplayOrientation: settingData.DisplayOrientation || "",
        LedPattern: settingData.LedPattern || ""
      };

      console.log('📤 Sending update payload:', payload);
      
      const response = await api.post('/UpdateGameSetting', payload);
      console.log('✅ Game setting updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating game setting:', error);
      
      if (error.response?.data?.errors) {
        console.error('🔴 Validation errors:', error.response.data.errors);
      }
      
      throw error;
    }
  },

  // Delete game setting
  deleteGameSetting: async (id) => {
    try {
      console.log('🗑️ Deleting game setting:', id);
      const response = await api.post('/DeleteGameSetting', { Id: parseInt(id) });
      console.log('✅ Game setting deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting game setting:', error);
      throw error;
    }
  }
};
// ============================================
// ============================================
// GAME CATEGORY & SUBCATEGORY SERVICE (CORRECTED)
// ============================================

export const gameCategoryService = {
  // ✅ Get all categories
  getAllCategories: async () => {
    try {
      console.log("📂 Fetching all game categories...");
      const response = await api.get("/GameCategory/GetAllCategories");
      console.log("✅ Categories fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      throw error;
    }
  },

  // ✅ Add new category
  addCategory: async (categoryData) => {
    try {
      console.log("➕ Adding new category:", categoryData);
      const payload = {
        description: categoryData.description || categoryData.Description || "",
      };
      const response = await api.post("/GameCategory/AddCategory", payload);
      console.log("✅ Category added:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding category:", error);
      throw error;
    }
  },

  // ✅ Delete category
  deleteCategory: async (id) => {
    try {
      console.log("🗑️ Deleting category with ID:", id);
      const response = await api.delete("/GameCategory/DeleteCategory", {
        params: { id: parseInt(id) },
      });
      console.log("✅ Category deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      throw error;
    }
  },

  // ✅ Get all subcategories
  getAllSubCategories: async () => {
    try {
      console.log("📂 Fetching all subcategories...");
      const response = await api.get("/GameCategory/GetAllSubCategories");
      console.log("✅ Subcategories fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching subcategories:", error);
      throw error;
    }
  },

  // ✅ Add new subcategory
  addSubCategory: async (subCategoryData) => {
    try {
      console.log("➕ Adding new subcategory:", subCategoryData);
      const payload = {
        description: subCategoryData.description || subCategoryData.Description || "",
      };
      const response = await api.post("/GameCategory/AddSubCategory", payload);
      console.log("✅ Subcategory added:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding subcategory:", error);
      throw error;
    }
  },

  // ✅ Delete subcategory
  deleteSubCategory: async (id) => {
    try {
      console.log("🗑️ Deleting subcategory with ID:", id);
      const response = await api.delete("/GameCategory/DeleteSubCategory", {
        params: { id: parseInt(id) },
      });
      console.log("✅ Subcategory deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting subcategory:", error);
      throw error;
    }
  },
};


export const usersservices={
  GetAllUserRoles: async () => {
    try {
      if (!authAPI.isAuthenticated()) {
        throw new Error('Not authenticated. Please login first.');
      }

      console.log('🔍 Fetching card products...');
      const response = await api.post('/GetAllUserRoles', {});
      console.log('📦 Card products response:', response.data);
      
      if (response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching card products:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to API. Make sure your .NET API is running on https://localhost:7221');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Check if CardProductController exists.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response?.data?.detail || error.message}`);
      }
      
      throw error;
    }
  },

  GetAllUsers: async () => {
    try {
      if (!authAPI.isAuthenticated()) {
        throw new Error('Not authenticated. Please login first.');
      }

      console.log('🔍 Fetching card products...');
      const response = await api.post('/GetAllUsers', {});
      console.log('📦 Card products response:', response.data);
      
      if (response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching card products:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Cannot connect to API. Make sure your .NET API is running on https://localhost:7221');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Check if CardProductController exists.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response?.data?.detail || error.message}`);
      }
      
      throw error;
    }
  },

}



// Export the main api instance for direct use if needed
export default api;