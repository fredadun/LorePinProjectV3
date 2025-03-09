# LorePin Landing Page & Auth Flow: Click-by-Click Documentation

**Detailing every interactive element, user flow, and technical action for the landing page and login/signup process.**

---

## **1. Landing Page: Core Sections & Interactions**

### **1.1 Hero Section**

| Element | Action | User Flow | Technical Details |
|---------|--------|-----------|--------------------|
| **“Join Free” Button** | Click | Redirects to `/signup` page. | - Firebase Analytics event: `signup_initiated`<br>- Smooth page transition (CSS fade-in). |
| **“Watch Demo” Link** | Click | Opens a modal with embedded video (YouTube/Vimeo). | - Video ID: `lorepin_demo_2023`<br>- Tracked via `video_start` event (GA4). |
| **Social Proof Logos** | Hover | Subtle grayscale-to-color transition. | - CSS `filter: grayscale(100%) → grayscale(0)`<br>- No tracking. |

---

### **1.2 Navigation Bar**

| Element | Action | User Flow | Technical Details |
|---------|--------|-----------|--------------------|
| **Logo** | Click | Redirects to `/` (refresh landing page). | - Prevents re-fetching static assets _(cache-control headers)._ |
| **“Login” Link** | Click | Opens login modal over current page. | - Modal component: `LoginModal.vue`<br>- Firebase Auth session check. |
| **“Sign Up” Link** | Click | Redirects to `/signup`. | Same as “Join Free” button. |
| **“London Challenges”** | Click | Redirects to `/challenges?location=london`. | - Server-side filter _(Firestore query: `where("location", "==", "London")`)_. |
| **“About” Link** | Click | Redirects to `/about`. | Static page (pre-rendered). |
| **“FAQ” Link** | Click | Redirects to `/faq`. | Static page with accordion components. |

---

### **1.3 Value Proposition Section**

| Element | Action | User Flow | Technical Details |
|---------|--------|-----------|--------------------|
| **“Learn More” Button** | Click | Smooth scrolls to “How It Works” section. | - CSS `scroll-behavior: smooth`<br>- Anchor link: `#how-it-works`. |
| **Feature Cards** | Hover | Card lifts _(CSS `transform: translateY(-5px)`) + shadow appears_. | - CSS `transition: all 0.3s ease-in-out`.<br>- No tracking. |

---

### **1.4 Challenge Preview Section**

| Element | Action | User Flow | Technical Details |
|---------|--------|-----------|--------------------|
| **Challenge Card** | Click | Opens modal with challenge details _(rules, prize, deadline)_. | - Fetches data from Firestore `/challenges/{id}`.<br>- Modal: `ChallengeModal.vue`. |
| **“Join Challenge”** | Click | - If logged in: Redirects to challenge submission flow.<br>- If not: Opens login. | - Auth check via `useAuthStore` _(Pinia)._ <br>- Event: `challenge_attempted`. |

---

### **1.5 CTA Section**

| Element | Action | User Flow | Technical Details |
|---------|--------|-----------|--------------------|
| **“Get Started” Button** | Click | Redirects to `/signup`. | Same as “Join Free” button. |

---

### **1.6 Footer**

| Element | Action | User Flow | Technical Details |
|---------|--------|-----------|--------------------|
| **“Privacy Policy”** | Click | Opens `/privacy` in new tab. | - External link: `rel="noopener noreferrer"`.<br>- PDF hosted on S3. |
| **Social Media Icons** | Click | Opens platform profile _(e.g., Instagram)_ in new tab. | - Tracked via `social_click` event _(platform name as parameter)_. |

---

## **2. Login/Signup Modals**

Triggered from **“Login”** or **“Sign Up”** links.

### **2.1 Login Modal**

| Element | Action | User Flow | Technical Details |
|---------|--------|-----------|--------------------|
| **Email Input** | Typing | Real-time validation _(regex check for `*@*.*`)_. | - Debounced `300ms`.<br>- Error: `“Please enter a valid email.”` |
| **Password Input** | Typing | Strength meter _(optional)_. | - Uses `zxcvbn` library for password strength. |
| **“Login” Button** | Click | Authenticates via Firebase Auth.<br>Success: Redirects to `/dashboard`. | - Error handling: `auth/invalid-credentials`, `auth/user-not-found`. |
| **“Forgot Password?”** | Click | Opens password reset modal. | - Sends Firebase reset email.<br>- Tracked as `password_reset_initiated`. |
| **“Sign Up Here” Link** | Click | Closes login modal → opens signup modal. | - Modal transition: CSS `slide-left`. |

---

### **2.2 Signup Modal**

| Element | Action | User Flow | Technical Details |
|---------|--------|-----------|--------------------|
| **“Sign Up with Google”** | Click | Firebase OAuth popup. | - Scope: `profile email`.<br>- Event: `oauth_signup_success`. |
| **“Sign Up with Instagram”** | Click | Firebase OAuth popup _(requires IG API setup)_. | - Requires Instagram App ID.<br>- Permissions: `user_profile`, `user_media`. |
| **“X” Button** | Click | Closes modal. | - Resets form fields.<br>- No tracking. |

---

## **3. Technical Considerations**

### **Auth Flow**

#### **Endpoints:**
```http
POST /api/auth/login   # Firebase SDK signInWithEmailAndPassword
POST /api/auth/signup  # Firebase SDK createUserWithEmailAndPassword
```

#### **Error Handling:**
- Global Vue error boundary catches auth failures.

#### **Analytics Tracking:**
- Google Analytics 4 events for all CTAs _(e.g., `join_free_click`, `demo_video_start`)_.
- Custom parameters: `user_status` _(guest/logged-in)_, `source` _(landing_page)_.

#### **Security:**
- All modals use **CSRF tokens**.
- **Rate limiting** on login attempts _(5 attempts/min via Firebase)_.

---

## **4. Visual & Interaction Specs**

### **Hover Effects:**
- **Buttons:** Background color shift _(e.g., `#6B46C1` → `#7E57C2`) + slight scale-up _(CSS: `transform: scale(1.02)`)_.

### **Modal Transitions:**
- **Fade-in overlay** _(CSS `@keyframes fadeIn`)_.
- **Slide-up animation** for modal content.

---

This documentation ensures developers implement every interaction with precision, aligning with LorePin’s brand and technical requirements. **Let’s start coding!** 🚀
