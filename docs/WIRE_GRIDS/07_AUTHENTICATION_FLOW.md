# WIRE GRID 7 – AUTHENTICATION FLOW
## How User Login and Security Works

---

```
╔══════════════════════════════════════════════════════════════════╗
║         FENCE ESTIMATOR – AUTHENTICATION FLOW DIAGRAM           ║
╚══════════════════════════════════════════════════════════════════╝

1. USER REGISTRATION (First Time Setup)
═══════════════════════════════════════

  Admin fills in:                 
  Username, Email, Password       
           │                      
           ▼                      
  POST /api/auth/register         
           │                      
           ▼                      
  Backend validates:              
  ✅ Username not taken           
  ✅ Email not taken              
  ✅ Password meets requirements  
           │                      
           ▼                      
  Password hashed:                
  bcrypt.hash(password, 10)       
  (password is NEVER stored plain)
           │                      
           ▼                      
  User saved to database          
  (username, email, password_hash)
           │                      
           ▼                      
  ✅ Registration successful      


2. USER LOGIN
═════════════

  User enters:                    
  Username + Password             
           │                      
           ▼                      
  POST /api/auth/login            
           │                      
           ▼                      
  Backend looks up user by        
  username in database            
           │                      
           ├── User not found ──► ❌ "Invalid credentials"
           │                      
           ▼                      
  bcrypt.compare(                 
    enteredPassword,              
    storedHash                    
  )                               
           │                      
           ├── No match ──────► ❌ "Invalid credentials"
           │                      
           ▼                      
  ✅ Password matches!            
           │                      
           ▼                      
  Create JWT Token:               
  jwt.sign(                       
    { userId, username, role },   
    JWT_SECRET,                   
    { expiresIn: '24h' }          
  )                               
           │                      
           ▼                      
  Return token to browser         
  Browser stores token in         
  localStorage                    
           │                      
           ▼                      
  ✅ User is now logged in        


3. USING THE APPLICATION (After Login)
═══════════════════════════════════════

  User clicks any button that     
  saves data to backend           
           │                      
           ▼                      
  Frontend adds token to request: 
  headers: {                      
    Authorization: "******"
  }                               
           │                      
           ▼                      
  Backend middleware: verifyToken 
           │                      
           ├── No token ────────► ❌ 401 Unauthorized
           │                      
           ├── Token expired ───► ❌ 401 Token expired
           │                      
           ├── Token invalid ───► ❌ 401 Invalid token
           │                      
           ▼                      
  ✅ Token valid                  
  req.user = { userId, role }     
           │                      
           ▼                      
  Request continues to controller 
  Controller processes the data   
  Only shows data owned by user   


4. ROLE-BASED ACCESS CONTROL
══════════════════════════════

  USER ROLES:
  ┌──────────┬─────────────────────────────────────────────────┐
  │ Role     │ What they can do                                │
  ├──────────┼─────────────────────────────────────────────────┤
  │ admin    │ Everything – manage users, see all projects     │
  │ manager  │ See all projects, create users, run reports     │
  │ user     │ Only see their own projects/estimates           │
  └──────────┴─────────────────────────────────────────────────┘

  MIDDLEWARE CHECK:
  ┌────────────────────────────────────────────────────────┐
  │  if (req.user.role !== 'admin') {                      │
  │    // Filter results to only show this user's data     │
  │    query.createdBy = req.user.userId;                  │
  │  }                                                     │
  └────────────────────────────────────────────────────────┘


5. TOKEN EXPIRATION & REFRESH
════════════════════════════

  Token expires after 24 hours    
           │                      
           ▼                      
  User tries to use application   
           │                      
           ▼                      
  401 Unauthorized returned       
           │                      
           ▼                      
  Frontend detects expired token  
           │                      
           ▼                      
  User redirected to login page   
           │                      
           ▼                      
  User logs in again              
  New 24-hour token issued        
```

---

## 🔐 SECURITY SUMMARY

| Security Feature | How It Works |
|-----------------|-------------|
| Password storage | bcrypt hash (never stored plain text) |
| Session tokens | JWT with 24h expiration |
| API protection | Every request requires valid JWT |
| Data isolation | Users only see their own data |
| Password reset | Email verification required |
| HTTPS | Required in production (SSL certificate) |

---

## ✅ WHAT THIS MEANS FOR YOU

- Each salesperson has their own login
- Their estimates stay private unless shared
- Passwords are never visible to anyone (including admin)
- Sessions automatically expire after 24 hours
- The system is safe to use on shared computers
