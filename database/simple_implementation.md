# Simple Database Implementation Guide

## 🎯 Quick Implementation Options

### Option 1: SQLite (Recommended for Start)
```python
# Simple Python backend with Flask + SQLite
import sqlite3
from flask import Flask, request, jsonify
import hashlib
from datetime import datetime

app = Flask(__name__)

# Create database
def init_db():
    conn = sqlite3.connect('dataprice.db')
    cursor = conn.cursor()
    
    # Companies table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            industry TEXT NOT NULL,
            company_size TEXT NOT NULL,
            company_address TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active'
        )
    ''')
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id INTEGER NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            job_title TEXT NOT NULL,
            phone_number TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Registration endpoint
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    try:
        conn = sqlite3.connect('dataprice.db')
        cursor = conn.cursor()
        
        # Insert company
        cursor.execute('''
            INSERT INTO companies (company_name, industry, company_size, company_address)
            VALUES (?, ?, ?, ?)
        ''', (data['companyName'], data['industry'], data['companySize'], data['companyAddress']))
        
        company_id = cursor.lastrowid
        
        # Hash password
        password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
        
        # Insert user
        cursor.execute('''
            INSERT INTO users (company_id, first_name, last_name, email, password_hash, job_title, phone_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (company_id, data['firstName'], data['lastName'], data['companyEmail'], 
              password_hash, data['jobTitle'], data['phoneNumber']))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Registration successful'})
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
```

### Option 2: Use a Service (Even Simpler)

#### Supabase (PostgreSQL-based, free tier)
```javascript
// In your register.html, replace the setTimeout with:
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your-project-url'
const supabaseKey = 'your-anon-key'
const supabase = createClient(supabaseUrl, supabaseKey)

// Registration function
async function registerCompany(data) {
    // Insert company
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{
            company_name: data.companyName,
            industry: data.industry,
            company_size: data.companySize,
            company_address: data.companyAddress
        }])
        .select()
    
    if (companyError) throw companyError
    
    // Insert user
    const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{
            company_id: company[0].id,
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.companyEmail,
            job_title: data.jobTitle,
            phone_number: data.phoneNumber
        }])
    
    if (userError) throw userError
    
    return { success: true }
}
```

## 🚀 Immediate Next Steps

1. **Choose Option 2 (Supabase)** - Fastest to implement
2. **Create Supabase project** (free)
3. **Set up tables** using their dashboard
4. **Update your register.html** to actually save data
5. **Test registration** and see data in Supabase dashboard

## 📊 Database Recommendation Summary

**For Now:** Supabase (PostgreSQL-based service)
- ✅ Free tier: 50MB database, 50MB file storage
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Easy dashboard to view data
- ✅ No server management

**Later:** Self-hosted PostgreSQL
- When you outgrow free tier
- More control and features
- Better for advanced analytics

## 💡 Your Current Registration Status

❌ **No data storage** - Form validation works but data disappears
✅ **UI/UX ready** - Professional registration form
✅ **Validation ready** - All form validation working
🔄 **Next:** Connect to actual database (30 minutes with Supabase)

Would you like me to help implement the Supabase connection?