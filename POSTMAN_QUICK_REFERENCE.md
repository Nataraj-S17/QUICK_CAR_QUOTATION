# Quick Postman Testing Reference

## 🚀 Quick Start - Copy & Paste Ready

### 1️⃣ Customer Registration
```
POST http://localhost:3000/api/customer/register
Content-Type: application/json
```
**Body**:
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

---

### 2️⃣ Customer Login
```
POST http://localhost:3000/api/customer/login
Content-Type: application/json
```
**Body**:
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**⚠️ IMPORTANT**: Copy the `token` from the response!

---

### 3️⃣ Access Customer Profile (Protected)
```
GET http://localhost:3000/api/customer/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the actual token from login response.

---

### 4️⃣ Test Role Protection - Customer → Admin (Should Fail)
```
GET http://localhost:3000/api/admin/dashboard
Authorization: Bearer YOUR_CUSTOMER_TOKEN_HERE
```

**Expected**: `403 Forbidden - Access denied. Insufficient permissions.`

---

### 5️⃣ Admin Login
```
POST http://localhost:3000/api/admin/login
Content-Type: application/json
```
**Body**:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

---

### 6️⃣ Access Admin Dashboard (Protected)
```
GET http://localhost:3000/api/admin/dashboard
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

---

## 📋 Expected Response Examples

### ✅ Successful Customer Login
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

### ❌ Customer Not Found
```json
{
  "success": false,
  "message": "Customer not found"
}
```

### ❌ Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### ❌ Access Denied (No Token)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### ❌ Insufficient Permissions (Wrong Role)
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

---

## 🎯 Testing Checklist

- [ ] Register a new customer
- [ ] Login with customer credentials
- [ ] Copy the JWT token
- [ ] Access customer profile with token
- [ ] Try accessing admin dashboard with customer token (should fail)
- [ ] Login as admin
- [ ] Access admin dashboard with admin token
- [ ] Try accessing customer profile with admin token (should fail)

---

## 💡 Postman Pro Tips

### Setting Authorization Header
1. Go to **Authorization** tab in Postman
2. Select **Type**: `Bearer Token`
3. Paste token in **Token** field

### Save Token as Variable
In the **Tests** tab of login request, add:
```javascript
pm.environment.set("customer_token", pm.response.json().token);
```

Then use in headers:
```
Authorization: Bearer {{customer_token}}
```

---

**All endpoints are working! Start testing! 🚀**
