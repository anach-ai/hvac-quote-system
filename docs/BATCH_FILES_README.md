# HVAC Quote System - Batch Files Guide

This directory contains Windows batch files for easy server management of the HVAC & Appliance Repair Quote System.

## 🚀 Available Batch Files

### 1. **server-manager.bat** ⭐ **RECOMMENDED**
**Comprehensive server management with menu interface**
- **Usage**: Double-click or run from command line
- **Features**: Menu-driven interface for all server operations
- **Best for**: Daily use, server management

### 2. **stop-server.bat**
**Server shutdown**
- **Usage**: `stop-server.bat`
- **Features**: Graceful shutdown, port verification
- **Best for**: Stopping servers, clearing ports

## 🎯 Quick Start

### **Option 1: Use Server Manager (Recommended)**
```cmd
server-manager.bat
```
Then select option 1 to start the production server.

### **Option 2: Direct Commands**
```cmd
# Stop server
stop-server.bat
```

## 🔧 Features

### **All Batch Files Include:**
- ✅ **Node.js Detection**: Automatic check for Node.js installation
- ✅ **Directory Validation**: Ensures you're in the correct directory
- ✅ **Dependency Management**: Automatic npm install if needed
- ✅ **Port Conflict Resolution**: Automatically stops conflicting processes
- ✅ **Error Handling**: Clear error messages and graceful failures
- ✅ **Status Feedback**: Visual feedback for all operations

### **Production Server Features:**
- 🔒 Security headers enabled
- 🚀 Performance optimization
- 📊 Rate limiting active
- 🗜️ Compression enabled

### **Development Server Features:**
- 🔄 Auto-restart on file changes
- 🐛 Debug logging enabled
- 📝 Hot reloading
- 🔍 Detailed error messages

## 📋 Prerequisites

### **Required Software:**
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)

### **Installation:**
1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Install with default settings
3. Restart your command prompt/terminal

## 🚨 Troubleshooting

### **Common Issues:**

#### **"Node.js is not installed"**
- Install Node.js from [https://nodejs.org/](https://nodejs.org/)
- Restart command prompt after installation

#### **"Port 3031 is already in use"**
- Run `stop-server.bat` to clear the port
- Or manually kill processes: `netstat -ano | findstr :3031`

#### **"package.json not found"**
- Ensure you're running from the `getquote` directory
- Check that all project files are present

#### **"Failed to install dependencies"**
- Check internet connection
- Try running `npm install` manually
- Clear npm cache: `npm cache clean --force`

### **Manual Commands:**
```cmd
# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies manually
npm install

# Check port usage
netstat -ano | findstr :3031

# Kill process by PID
taskkill /F /PID <PID_NUMBER>
```

## 🔄 Server Manager Menu Options

### **1. Start Production Server**
- Starts server in production mode
- Optimized for performance and security

### **2. Start Development Server**
- Starts server in development mode
- Includes auto-restart and debug features

### **3. Stop Server**
- Gracefully stops all server processes
- Clears port 3031

### **4. Check Server Status**
- Shows if server is running
- Displays active connections
- Lists Node.js processes

### **5. Install/Update Dependencies**
- Runs `npm install`
- Updates all packages

### **6. Open in Browser**
- Opens `http://localhost:3031` in default browser
- Quick access to the application

### **7. Exit**
- Closes the server manager

## 📁 File Structure

```
getquote/
├── docs/                    # 📚 Documentation folder
├── server-manager.bat      # Main management interface
├── stop-server.bat        # Server shutdown
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
└── assets/                # Static files (CSS, JS, images)
```

## 📚 Documentation

All documentation is now organized in the `docs/` folder:
- **[docs/README.md](README.md)** - Main project guide
- **[docs/BATCH_FILES_README.md](BATCH_FILES_README.md)** - This file
- **[docs/SECURITY.md](SECURITY.md)** - Security details
- **[docs/INDEX.md](INDEX.md)** - Documentation index

## 💡 Tips

### **For Daily Development:**
1. Use `server-manager.bat` for easy access to all functions
2. Use `start-dev.bat` for development with auto-restart
3. Use `stop-server.bat` when switching between modes

### **For Production:**
1. Use `start-server.bat` for production deployment
2. Ensure all dependencies are installed
3. Check server status regularly

### **For Troubleshooting:**
1. Use `server-manager.bat` → Option 4 to check status
2. Use `stop-server.bat` to clear any stuck processes
3. Check the console output for error messages

## 🔗 Related Files

- **`server.js`**: Main Express.js server
- **`security-config.js`**: Security configuration
- **`package.json`**: Dependencies and scripts
- **`assets/`**: Static files and frontend code

---

**Need Help?** Check the console output for detailed error messages and status information.
