# SYSTEM INSTALLATION & USER GUIDE REPORT
## PROJECT: FANDOMVERSE — YOUR FANDOM UNIVERSE (TECHWIZ)

---

## 📌 GENERAL PROJECT INFORMATION

| Item | Details |
| :--- | :--- |
| **Project Name** | **FandomVerse — Your Fandom Universe** |
| **Competition / Program** | **TechWiz — Web Innovation Unleashed** (Publisher: © Aptech Limited) |
| **System Architecture** | Single Page Application (SPA) — No-Backend Architecture |
| **Core Technology Stack**| React 18, Vite 5, Bootstrap 5.3, Bootstrap Icons, i18next |
| **Git Repository Link** | **[https://github.com/Phuongle2312/FandomVerse-Techwiz.git](https://github.com/Phuongle2312/FandomVerse-Techwiz.git)** |
| **Official Branch** | `main` (Fully synchronized with all commits from branch `luyenhao`) |

---

## 💻 SYSTEM PREREQUISITES

Before proceeding with the installation, ensure that your system meets the following environment requirements:

1. **Node.js**: Version **`v18.0.0`** or higher (Recommended: **`v20.x LTS`** for optimal performance).
   - Check version: `node -v`
2. **NPM**: Version **`v9.0.0`** or higher (Bundled with Node.js).
   - Check version: `npm -v`
3. **Git**: Version **`v2.30.0`** or higher.
   - Check version: `git --version`
4. **Web Browser**: Latest version of Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave (supporting ES6+, WebGL, Canvas 2D, and LocalStorage).

---

## ⚙️ STEP-BY-STEP INSTALLATION & EXECUTION GUIDE

### Step 1: Clone Source Code from GitHub

Open your command-line interface (**Terminal / Command Prompt / PowerShell**) and execute:

```bash
git clone https://github.com/Phuongle2312/FandomVerse-Techwiz.git
```

Navigate into the cloned project directory:

```bash
cd FandomVerse-Techwiz
```

Verify that you are on the `main` branch:

```bash
git branch
# Expected output: * main
```

---

### Step 2: Install All Dependencies & Libraries

Install all package dependencies declared in `package.json`:

```bash
npm install
```

> **Note**: This command automatically downloads all required modules into the `node_modules/` folder. The installation process typically takes between 30 seconds and 2 minutes depending on your internet connection.

---

### Step 3: Start the Development Server

Once dependency installation is complete, start the local development server:

```bash
npm run dev
```

Upon successful startup, the terminal will display the local access URL:
```text
  VITE v5.4.6  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

👉 Open your web browser and navigate to: **`http://localhost:5173`**

---

### Step 4: Production Build & Preview

- **Compile and package optimized bundle for Production**:
  ```bash
  npm run build
  ```
  *All minified HTML, CSS, JavaScript, and optimized assets will be generated in the `/dist` directory.*

- **Preview the production build locally**:
  ```bash
  npm run preview
  ```

- **(Optional) Run automated image optimization script**:
  ```bash
  npm run optimize:images
  ```

---

## 📦 CORE LIBRARIES & DEPENDENCY BREAKDOWN

### 1. Production Dependencies (`dependencies`)
| Library Name | Version | Role & Purpose in Project |
| :--- | :--- | :--- |
| **`react`** | `^18.3.1` | Core JavaScript library for building component-driven modern user interfaces. |
| **`react-dom`** | `^18.3.1` | Provides DOM-specific methods for rendering React components in the browser. |
| **`react-router-dom`** | `^6.26.2` | Single Page Application routing utilizing `HashRouter` (`/#/...`), preventing 404 errors on page reloads across all static hosting environments. |
| **`bootstrap`** | `^5.3.3` | Responsive grid layout system, Modals, Offcanvas, buttons, and utility CSS classes. |
| **`bootstrap-icons`** | `^1.11.3` | Comprehensive vector icon set for action buttons, status indicators, and category tabs. |
| **`i18next`** | `^26.4.2` | Internationalization framework providing multilingual support. |
| **`react-i18next`** | `^17.0.15` | React bindings for i18next enabling seamless real-time switching between **Vietnamese 🇻🇳**, **English 🇬🇧**, and **Hindi 🇮🇳**. |

### 2. Development Dependencies (`devDependencies`)
| Library Name | Version | Purpose & Function |
| :--- | :--- | :--- |
| **`vite`** | `^5.4.6` | Next-generation frontend tooling and ultra-fast development server with Hot Module Replacement (HMR). |
| **`@vitejs/plugin-react`**| `^4.3.1` | Official Vite plugin providing Fast Refresh and JSX transformation for React. |
| **`sharp`** | `^0.35.4` | High-performance image processing library for converting assets to modern WebP format. |

---

## 🔑 DEFAULT DEMO ACCOUNTS & CREDENTIALS

The application includes two pre-configured accounts for testing and jury evaluation:

### 1. Administrator Account (Admin Portal)
- **Portal URL:** `http://localhost:5173/#/admin/login` (Or click *Admin* in the navigation bar)
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- **Full Name:** Trần Quản Trị (Administrator)
- **Permissions:** Full access to the Admin CMS dashboard: Add, Edit, Delete fandom content, characters, events, trailers, merchandise products, user management, and system reset.
- **Convenience Feature:** Includes a **"One-Click Auto-Fill"** button on the login screen for instant demonstration.

### 2. Standard Fan User Account (Demo User)
- **Login URL:** `http://localhost:5173/#/login`
- **Email:** `demo@fandomverse.io`
- **Password:** `demo1234`
- **Full Name:** Fan Demo
- **Permissions:** Experience all end-user features: Bookmark articles (`localStorage`), Add items to Cart, Complete Checkout, View Order History (`localStorage`), take Session Notes (`sessionStorage`), and edit Profile information.

---

## 📖 SYSTEM FEATURE & USER MANUAL

### I. END-USER INTERFACE & EXPERIENCE

#### 1. Home Page (`/#/`)
- **Cinema Hero Section:** Visual storytelling banner showcasing trending releases and highlights.
- **7 Fandom Hubs:** Quick navigation into the 7 core fandom sectors (Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga).
- **Live Clock & Simulated Visitor Counter:** Real-time clock display and active visitor simulation counter.
- **Featured Highlights:** Spotlight on top characters, upcoming events, and best-selling merchandise.

#### 2. The 7 Fandom Universe Hubs (`/#/category/:categoryId`)
- Each category features dedicated theming and **interactive Canvas background effects**:
  - 🌸 **Anime:** Falling cherry blossom petals (Sakura Petals).
  - ⚡ **Gaming:** Floating Hextech crystals and magical energy particles.
  - 🐉 **TV Shows:** Dragon fire embers in the style of House of the Dragon.
  - ✨ **K-Pop:** Stage spotlight beams, fireworks, and glowing lightsticks.
  - 🎬 **Movies:** Vintage film projector light cones and cinematic dust grains.
  - 🕸️ **Comics:** Spider-web particle connections and radioactive superhero rays.
  - 💥 **Manga:** Dynamic speedlines and action impact lines.
- **Performance Optimization Switch:** Users can toggle the effect on/off at the top right of each hub. The canvas engine automatically pauses rendering when switching tabs or scrolling past the viewport to conserve CPU/GPU resources.

#### 3. Content Details & Character Profiles (`/#/content/:id`)
- Read in-depth analytical articles and lore.
- **Interactive Lightbox Image Gallery:** Click any image to view in high-resolution full-screen mode.
- **Related Characters & Events:** Review power stats, voice actors, birthdays, and scheduled event venues.
- **Bookmark System:** Click the star/heart icon to save articles for offline reading (saved to `localStorage`).

#### 4. Multimedia Trailers Hub (`/#/trailers`)
- Watch official high-definition YouTube trailers without third-party redirection.
- Filter trailers by fandom category (Anime, Gaming, Movies, K-Pop, etc.).
- View release dates, runtimes, and storyline synopses.

#### 5. Merchandise Store & Virtual Cart (`/#/merchandise`)
- Explore authentic fan merchandise: T-shirts, Figurines, Lightsticks, Posters, and Accessories.
- **Smart Filtering:** Filter by category, price ranges, discounted deals, or top customer ratings.
- **Slide-out Cart Drawer:**
  - Add items to the cart with instant Toast notifications.
  - Adjust quantities (+/-) or remove items dynamically.
  - Automatic calculation of subtotal, shipping fees, and coupon deductions.

#### 6. Order Placement & Checkout (`/#/checkout`)
- Enter customer shipping details: Full Name, Phone Number, Delivery Address, Delivery Notes.
- Select payment methods: Cash on Delivery (COD), Bank Transfer, or Credit/Debit Card.
- Enter discount coupon codes (e.g., `FANDOM10` for 10% off, `FREESHIP` for free shipping).
- Review order confirmation and immediately view records in the **Orders History** page (`/#/orders-history`).

#### 7. Global Search (`/#/search?q=...`)
- Instant keyword search accessible from the top Navbar across all data types.
- Categorized result tabs: Articles, Characters, Events, Merchandise, and Trailers.

#### 8. Rule-Based AI Chatbot Assistant (Bottom-Right Widget)
- 24/7 automated FAQ responses for common questions.
- Deep-linking suggestions: Click recommendations to navigate directly to Anime Hub, Merchandise Store, or Help Guides.

#### 9. Multilingual Translation (i18n)
- Language selector located in the top navigation bar.
- Switch instantly between **Vietnamese 🇻🇳**, **English 🇬🇧**, and **Hindi 🇮🇳** without page reloading.

---

### II. ADMINISTRATOR MANAGEMENT SYSTEM (ADMIN CMS)

After logging in at `/#/admin/login`, administrators gain access to full management capabilities:

1. **Overview Dashboard (`/#/admin`):**
   - Real-time statistics tracking total Counts of Contents, Characters, Events, Trailers, Products, Orders, and Users.
   - Activity logs and engagement metrics.
2. **Fandom Content Management (`/#/admin/contents`):**
   - View, search, and filter all published articles.
   - Create new articles with title, category, summary, cover image, and markdown body.
   - Edit existing articles and delete with confirmation modals.
3. **Character Profile Management (`/#/admin/characters`):**
   - Manage character profiles, avatars, role descriptions, power stats, and iconic quotes.
4. **Events Calendar Management (`/#/admin/events`):**
   - Manage conventions, concerts, eSports tournaments, start/end dates, locations, and live status (Upcoming, Ongoing, Finished).
5. **Trailer Video Management (`/#/admin/trailers`):**
   - Add/edit YouTube video IDs, titles, categories, and release dates.
6. **Merchandise Management (`/#/admin/merchandise`):**
   - Add new items, update prices, discounts, stock quantities, and availability statuses.
7. **User Management (`/#/admin/users`):**
   - View registered user accounts and inspect assigned roles (Admin vs. User).
8. **System Settings & Data Recovery (`/#/admin/settings`):**
   - **"Reset to Default Data" Button:** Reverts the entire database to the original evaluation baseline with a single click.
   - Export and import database backup packages in JSON format.

---

## 📁 PROJECT DIRECTORY STRUCTURE

```text
FandomVerse-Techwiz/
├── public/                     # Public static assets (Logos, Favicons, Videos, Posters)
│   ├── assets/                 # Merchandise images, characters, events, background videos
│   └── favicon.svg             # Application favicon
├── src/                        # Core application source code
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Navbar, Footer, Breadcrumb, Toast, ScrollToTop
│   │   └── interactive/        # ChatbotWidget, CartDrawer, 7 Canvas Particle Effects
│   ├── context/                # Global State Providers (Auth, Cart, Bookmark, Theme, Language)
│   ├── data/                   # 6 Normalized JSON Data Files (Contents, Characters, Events, etc.)
│   ├── hooks/                  # Custom React Hooks (useDebounce, useVideoVisibilityAutoplay)
│   ├── i18n/                   # Multilingual translation resources (vi, en, hi)
│   ├── pages/                  # End-user pages (Home, Category, ContentDetail, Cart, Checkout, etc.)
│   │   └── admin/              # Complete Administrator CMS Portal
│   ├── services/               # StorageService, DataService wrappers
│   ├── styles/                 # CSS stylesheets (global.css, admin.css, effects.css)
│   ├── App.jsx                 # Central Application Router (HashRouter)
│   └── main.jsx                # Application bootstrap entry point
├── index.html                  # Single Page Application HTML root
├── package.json                # Project dependencies and script declarations
├── vite.config.js              # Vite build tool configuration
└── README.md                   # Project overview documentation
```

---

## 🛠️ TROUBLESHOOTING & FREQUENTLY ASKED QUESTIONS

| Issue | Potential Cause | Resolution |
| :--- | :--- | :--- |
| **`Port 5173 is in use`** | Another terminal or application is occupying port 5173. | Vite will automatically suggest using port `5174` (open `http://localhost:5174`), or terminate previous processes via Task Manager. |
| **`npm install` fails or hangs** | Network connectivity issue or corrupted npm cache. | Run `npm cache clean --force` and retry running `npm install`. |
| **Changes not reflecting in browser** | Stale browser cache or local storage state. | Press `Ctrl + F5` (`Cmd + Shift + R`) for a hard reload, or visit `/#/admin/settings` and click "Reset to Default". |
| **YouTube trailer does not play** | Restricted network or publisher privacy restrictions on YouTube. | Verify internet access or select an alternative trailer within the category. |
| **Visual lag on lower-end devices** | Canvas particle animations running at high refresh rates. | Click the **Turn Off Effect** toggle at the top of the category hub; note that the system also pauses automatically when leaving the tab or scrolling past the hero. |

---

> **This user guide report is verified 100% against the official `main` branch of the FandomVerse repository.**
