// Attendance validation utilities for student-side features

// Geolocation check - verify student is near lecture hall
export const checkGeolocation = async (lectureHallLocation, maxDistanceMeters = 100) => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const studentLat = position.coords.latitude;
        const studentLng = position.coords.longitude;
        
        const distance = calculateDistance(
          studentLat,
          studentLng,
          lectureHallLocation.lat,
          lectureHallLocation.lng
        );
        
        if (distance <= maxDistanceMeters) {
          resolve({ 
            withinRange: true, 
            distance: distance,
            location: { lat: studentLat, lng: studentLng }
          });
        } else {
          resolve({ 
            withinRange: false, 
            distance: distance,
            location: { lat: studentLat, lng: studentLng }
          });
        }
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Network check - verify connected to campus Wi-Fi
export const checkNetworkConnection = async (campusSSID = null) => {
  // Note: Browser security restrictions prevent direct SSID access
  // This is a simplified check that can be enhanced with backend integration
  
  if (!navigator.onLine) {
    return { connected: false, reason: 'No internet connection' };
  }

  // Check if we can reach the campus network (simulated)
  // In production, this would make an API call to a campus-specific endpoint
  try {
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    
    return { 
      connected: true, 
      isCampusNetwork: false, // Cannot detect SSID in browser
      message: 'Connected to internet. Campus network verification requires backend integration.'
    };
  } catch (error) {
    return { connected: false, reason: 'Network unreachable' };
  }
};

// Time-bound access check - verify within lecture window
export const checkTimeWindow = (sessionStartTime, windowMinutes = 15) => {
  const now = new Date();
  const start = new Date(sessionStartTime);
  const windowEnd = new Date(start.getTime() + windowMinutes * 60 * 1000);
  
  const isWithinWindow = now >= start && now <= windowEnd;
  const timeRemaining = windowEnd - now;
  
  return {
    isWithinWindow,
    timeRemaining: Math.max(0, timeRemaining),
    windowStart: start,
    windowEnd: windowEnd,
    currentTime: now
  };
};

// Validate university email format
export const validateUniversityEmail = (email, allowedDomains = ['.edu']) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }
  
  const domain = email.split('@')[1];
  const isUniversityDomain = allowedDomains.some(allowed => 
    domain.endsWith(allowed) || domain === allowed.replace('.', '')
  );
  
  if (!isUniversityDomain) {
    return { valid: false, reason: 'Must use a university email address' };
  }
  
  return { valid: true };
};

// Generate mock 2FA code (in production, this would be sent via SMS/email)
export const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verify 2FA code (with time-based expiry)
export const verify2FACode = (inputCode, storedCode, expiryMinutes = 5) => {
  if (!storedCode || !storedCode.code) {
    return { valid: false, reason: 'No 2FA code generated' };
  }
  
  const now = new Date();
  const expiryTime = new Date(storedCode.timestamp + expiryMinutes * 60 * 1000);
  
  if (now > expiryTime) {
    return { valid: false, reason: '2FA code expired' };
  }
  
  if (inputCode !== storedCode.code) {
    return { valid: false, reason: 'Invalid 2FA code' };
  }
  
  return { valid: true };
};

// Validate QR code format
export const validateQRCode = (qrData) => {
  try {
    const data = JSON.parse(qrData);
    
    // Required fields for QR code
    const requiredFields = ['sessionId', 'timestamp', 'classId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return { valid: false, reason: `Missing required fields: ${missingFields.join(', ')}` };
    }
    
    // Check if QR code is expired (e.g., 1 hour validity)
    const qrTime = new Date(data.timestamp);
    const now = new Date();
    const age = now - qrTime;
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    if (age > maxAge) {
      return { valid: false, reason: 'QR code has expired' };
    }
    
    return { valid: true, data };
  } catch (error) {
    return { valid: false, reason: 'Invalid QR code format' };
  }
};
