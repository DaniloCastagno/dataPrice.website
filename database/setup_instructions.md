# dataPrice Database Setup Instructions

## Database Choice: SQLite
We recommend SQLite for this project because:
- **Lightweight**: Perfect for small to medium businesses
- **Serverless**: No separate server process needed
- **Zero Configuration**: Works out of the box
- **Reliable**: Used by major companies worldwide
- **Cost-Effective**: No licensing fees
- **Easy Deployment**: Single file database

## Database Schema

### Tables Required:

#### 1. companies
```sql
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    company_size TEXT NOT NULL,
    company_address TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active' -- active, suspended, deleted
);
```

#### 2. users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    job_title TEXT NOT NULL,
    phone_number TEXT,
    role TEXT DEFAULT 'admin', -- admin, user, viewer
    is_verified BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies (id)
);
```

#### 3. user_sessions
```sql
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

#### 4. user_preferences
```sql
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preference_key TEXT NOT NULL,
    preference_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, preference_key)
);
```

#### 5. audit_log
```sql
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company_id INTEGER,
    action TEXT NOT NULL, -- login, logout, profile_update, etc.
    details TEXT, -- JSON string with additional details
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (company_id) REFERENCES companies (id)
);
```

## Setup Instructions

### For Development (Local):
1. Install SQLite on your system
2. Create database file: `dataPrice.db`
3. Run the SQL scripts above to create tables
4. Use a tool like DB Browser for SQLite for easy management

### For Production:
1. **Shared Hosting**: Most shared hosts support SQLite
2. **VPS/Cloud**: Install SQLite and create database
3. **Managed Services**: Consider services like:
   - Railway.app (with PostgreSQL upgrade path)
   - PlanetScale (MySQL-compatible)
   - Supabase (PostgreSQL with real-time features)

## Backend Implementation Needed

You'll need to create server-side scripts (PHP, Node.js, Python, etc.) to:

### 1. Authentication API (`/api/auth/`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/reset-password` - Password reset

### 2. User Management API (`/api/user/`)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Delete user account
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences

### 3. Company Management API (`/api/company/`)
- `GET /api/company/info` - Get company information
- `PUT /api/company/info` - Update company information
- `GET /api/company/users` - Get company team members

## Security Considerations

### Password Security:
- Use bcrypt or Argon2 for password hashing
- Minimum 8 characters with complexity requirements
- Implement password reset functionality

### Session Security:
- Generate secure session tokens
- Set appropriate session expiration
- Implement logout on all devices feature

### Data Protection:
- Validate all input data
- Use prepared statements for SQL queries
- Implement rate limiting for API endpoints
- Use HTTPS in production

## Recommended Tech Stack

### Backend Options:
1. **Node.js + Express** - Great for JavaScript developers
2. **PHP + Laravel/CodeIgniter** - Widely supported, easy deployment
3. **Python + Flask/FastAPI** - Clean, powerful, great for data projects

### Frontend Integration:
- Update existing JavaScript to call backend APIs
- Implement proper error handling
- Add loading states and user feedback

## Sample Environment Variables
```env
DATABASE_PATH=./database/dataPrice.db
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=your-email-server.com
SMTP_USER=noreply@dataprice.com
SMTP_PASS=your-email-password
APP_URL=https://yourwebsite.com
```

## Next Steps
1. Choose your backend technology
2. Set up the database with the provided schema
3. Implement the authentication APIs
4. Update frontend JavaScript to integrate with backend
5. Test thoroughly before deployment
6. Consider database backups and monitoring

For immediate testing, you can continue using sessionStorage as implemented, but for production, you'll need a proper backend with database integration.