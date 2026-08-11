# VIEWING GUIDE
## How to Open and Use the Fence Estimator

This guide is for **non-technical users** who just want to see and use the application.

---

## OPTION A: OPEN THE STANDALONE ESTIMATOR (No Setup Required)

The simplest way to see the estimator right now — no server needed:

1. Go to your GitHub repository:  
   `https://github.com/Auction2026/fence-estimator`

2. Click on `index.html` in the file list

3. Click the **"Raw"** button  

4. Right-click the page → **"Save As"** → save to your Desktop

5. Double-click the saved `index.html` file

6. It opens in your browser - fully functional estimate form!

---

## OPTION B: VIEW ON GITHUB DIRECTLY (Read Only)

To just read the code and documentation:

1. Go to: `https://github.com/Auction2026/fence-estimator`

2. Click any file to read it

3. The **docs/** folder has all guides and diagrams

4. The **frontend/** folder has the web interface code

---

## OPTION C: RUN THE FULL APP (Requires Node.js & MongoDB)

See `PART_4_IMPLEMENTATION_MENU.md` for complete setup steps.

**Quick version:**
```bash
# Install Node.js from nodejs.org first, then:
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm start
# Then open frontend/index.html in browser
```

---

## WHAT YOU'LL SEE WHEN RUNNING

When you open the app, you see:

### Login Screen
- Enter your email and password
- Click "Login" to access the app
- First time: Click "Register" to create an account

### Main Application: 17 Tabs
After logging in, you see the main window with 17 tabs along the top:

```
[Project Info] [Site Survey] [Fence Specs] [Materials] [Labor] ...
```

**How to use:**
1. **Tab 1 - Project Info**: Fill in customer name, address, phone
2. **Tab 3 - Fence Specs**: Enter fence type, height, footage
3. **Tab 4 - Materials**: Click "Calculate" to auto-fill the materials list
4. **Tab 5 - Labor**: Enter crew hours and rate
5. **Tab 8 - Estimate Summary**: See the complete estimate total
6. **Tab 9 - Contract**: Generate a printable contract

### Navigation Buttons
- **[Previous Tab]** and **[Next Tab]** buttons at bottom of each tab
- Or click tab names directly at the top

---

## THINGS YOU CAN DO

✅ Create a customer project  
✅ Enter fence specifications  
✅ Get automatic materials list with quantities  
✅ Calculate total estimate cost  
✅ Generate a professional estimate PDF  
✅ Create a contract from the estimate  
✅ Track change orders  
✅ Take completion sign-off  
✅ Add notes and photos  
✅ View reports  
✅ Manage product inventory/prices  

---

## SHARING WITH YOUR PROGRAMMER

Your programmer needs the entire repository from GitHub:
```
https://github.com/Auction2026/fence-estimator
```

They should read these files first:
1. `PART_4_IMPLEMENTATION_MENU.md` - How to set it up
2. `docs/README.md` - What everything is
3. `docs/WIRE_GRIDS/SYSTEM_ARCHITECTURE.md` - How it works

---

## VIEWING DIAGRAMS AND DOCUMENTATION

All documentation is in the `docs/` folder.

To view diagrams (they use ASCII art):
1. Open any `.md` file in the `docs/WIRE_GRIDS/` folder
2. On GitHub, they display nicely formatted automatically
3. Or open in any text editor (Notepad, TextEdit)

---

*Viewing Guide - Fence Depot Fence Estimator v1.0*
