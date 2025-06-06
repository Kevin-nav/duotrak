Refined DuoTrak: Ultra-Detailed UI/UX Design & Frontend Blueprint (MVP)
Document Version: 1.3 (AI Frontend Focus - Revised Sections with Next.js, Tailwind CSS, Shadcn UI, and Framer Motion integration)
Date: June 4, 2025
Project: DuoTrak - AI-Assisted Accountability Partner Web Application
________________________________________
Important Note for AI Code Generation:
This document serves as the primary blueprint for generating the DuoTrak web application's frontend. The core technologies are Next.js (React) for the framework, Tailwind CSS for styling, Shadcn UI as a foundation for customizable components, and Framer Motion for animations and transitions. All generated code must adhere strictly to these technology choices and the detailed specifications within this document.
The focus is exclusively on the frontend. Backend logic, complex database interactions, or server-side operations are outside the scope of this document. Mock data structures and stubbed API functions should be used for any backend dependencies. The goal is to translate the UI/UX design into functional, high-quality frontend components and pages.
________________________________________
Table of Contents:
1.	Core Design Philosophy & Principles
2.	Target Audience & User Needs
3.	Brand Identity & Color Palette
4.	Typography System
5.	Layout & Responsive Grid System
6.	Iconography
7.	Component Library (Key UI Elements - Design Intent)
8.	Motion & Animation Guidelines
9.	Navigation Architecture (Mobile, Tablet, Desktop)
10.	Key Screen Flows & Detailed UI/UX Specifications
o	10.1. User Onboarding (Signup, Login, Partnership, Initial Profile)
o	10.2. Dashboard
o	10.3. System Check-in / Interaction View (including Verification)
o	10.4. Partner View / Direct Messaging
o	10.5. Progress/Stats View
o	10.6. Goal & System Management View
o	10.7. Notification Area
11.	Error Handling & Empty States UX
12.	Accessibility Considerations
13.	UI-Related Performance Optimizations
14.	Frontend Architecture Notes (Next.js Context)
________________________________________
1. Core Design Philosophy & Principles
•	Purpose: DuoTrak is envisioned as a responsive web application. Its primary function is to assist users in achieving their goals through a dedicated two-person accountability partnership. This process is augmented by AI-driven planning and progress tracking features. This document will guide the AI in generating the Next.js frontend. Styling will be implemented using Tailwind CSS. Shadcn UI components will serve as foundational elements, which must be customized to these specifications. Framer Motion will be employed to create engaging animations and transitions.
•	Experience Goals: The user experience should embody the following qualities:
o	Calm & Focused: The user interface must promote concentration and minimize cognitive overload. This will be achieved through clean, uncluttered layouts, ample use of whitespace, and a predominantly muted primary color palette, with strategic use of accents.
o	Motivating & Supportive: The design should actively encourage users by providing clear visibility into their progress and offering positive reinforcement. This includes visual cues, dynamic progress indicators, and subtle, celebratory microinteractions, which will be implemented using Framer Motion.
o	Intuitive & Effortless: All interactions, particularly routine tasks like daily check-ins, must be designed to be quick, straightforward, and frictionless. This requires clear visual affordances for interactive elements, logical user flows, and adherence to established web usability conventions.
o	Trustworthy & Secure: The client-side experience should feel responsive and reliable. User inputs must be handled clearly, with immediate feedback, fostering a perception of security (note: actual data security is a backend responsibility).
o	Understated Elegance: The application should possess a clean, polished, and modern aesthetic that is inviting across all screen sizes. This will be realized through meticulous typographic choices, consistent application of spacing principles, subtle yet meaningful animations, and high-quality component implementations. The overarching aesthetic should align with principles like "Bold simplicity," "Breathable whitespace," and "Motion choreography implementing physics-based transitions."
•	Design Principles (for Frontend Implementation): These principles are fundamental to the development of the DuoTrak frontend:
o	Clarity First: Every UI element, piece of text, and user flow must be unambiguous and easy to understand.
o	Consistency: UI patterns, component behaviors, and visual styling must be uniformly applied across the entire application. This will be enforced through the Tailwind CSS configuration and the consistent customization of Shadcn UI components.
o	Feedback: All user actions (such as clicks, form submissions, loading indications, and error states) must trigger immediate and clear visual or interactive feedback. Framer Motion will be instrumental in creating these responsive state transitions and feedback animations.
o	Efficiency: Frontend components and user flows should be designed to minimize user effort for common and repetitive tasks.
o	Adaptive Design: Responsive layouts are crucial. Tailwind CSS's responsive prefix system will be used to ensure optimal viewing and interaction experiences on desktop, tablet, and mobile devices.
o	Accessibility: The frontend code must adhere to Web Content Accessibility Guidelines (WCAG). This includes using semantic HTML, providing necessary ARIA attributes, ensuring keyboard navigability for all interactive elements, and maintaining sufficient color contrast. The use of Shadcn UI components, which are built on the accessible Radix UI primitives, will provide a strong foundation for accessibility.
•	Aesthetic Integration Note: The design should embody principles such as "Bold simplicity with intuitive navigation," "Breathable whitespace complemented by strategic color accents," "Strategic negative space for cognitive breathing room," "Systematic color theory with purposeful accent placement," "Typography hierarchy for information architecture," "Visual density optimization," "Motion choreography with physics-based transitions," "Accessibility-driven contrast ratios," "Responsive feedback via state transitions," and "Content-first layouts." These will guide the application of Tailwind CSS and Framer Motion.
•	Core Guideline for AI: These philosophies and principles are the qualitative benchmarks for the frontend code. They should inform decisions regarding component structure, styling choices with Tailwind CSS, interaction design, and the implementation of animations using Framer Motion.
________________________________________
2. Target Audience & User Needs
•	Primary Audience: The application is designed for individuals who are tech-native and motivated to achieve personal or professional goals. This includes entrepreneurs, intrapreneurs, and anyone seeking a structured approach to goal achievement with the support of an accountability partner. Users will access DuoTrak through web browsers on a variety of devices (desktop, tablet, mobile).
•	User Needs Solved (by the Frontend Experience): The frontend must directly address the following user needs:
o	Provide a clear, visually appealing, and encouraging interface that helps users overcome procrastination.
o	Offer intuitive forms, flows, and interfaces for translating abstract goals into concrete, actionable systems within the application.
o	Present user progress and their partner's progress in a way that is visible, easily digestible, and motivating.
o	Design an interface that makes daily reflection and system check-ins simple, quick, and non-burdensome.
•	Core Guideline for AI: The description of the target audience and their needs should inform the overall design and usability requirements of the frontend. However, do not create user-specific logic paths or features based solely on these descriptions unless explicitly instructed to do so in the detailed screen specifications later in this document.
________________________________________
3. Brand Identity & Color Palette
•	Brand Personality (to be reflected in UI): The user interface should convey a personality that is: Supportive, Intelligent, Calm, Reliable, Focused, and Modern. This will be achieved through the color choices, typography, spacing, and the overall interaction design.
•	Primary Theme: The dominant visual theme is Beige, creating a calm and focused environment.
•	Color Palette (Definitive for Frontend Styling with Tailwind CSS):
The following color palette is to be strictly adhered to. These colors MUST be implemented as CSS custom properties (variables) in a global stylesheet (e.g., styles/globals.css). Furthermore, these custom properties MUST be integrated into the tailwind.config.js file by extending Tailwind's default color palette. This allows for consistent usage via Tailwind's utility classes (e.g., bg-primary-beige, text-primary-accent).
o	Primary Beige (App Background & Surfaces):
	CSS Variable: --color-primary-beige: #F5F5DC;
	Tailwind Utility Name: primary-beige
	Frontend Use: Apply as the main body background for the application or as the background for primary page containers.
o	Primary Accent (Brand Color, CTAs, Emphasis):
	CSS Variable: --color-primary-accent: #8B4513; (SaddleBrown)
	Tailwind Utility Name: primary-accent
	Frontend Use: Use for primary button backgrounds, active navigation links/icons, borders of focused input fields, and key action icons.
o	Card & Modal Background:
	CSS Variable: --color-card-modal-background: #FFFFFF; (Pure White)
	Tailwind Utility Name: card-modal-background
	Frontend Use: Apply as the background for all card-like elements (as defined in the Component Library), modal dialogs, and input fields.
o	Secondary Beige Light (Hover States, Subtle Dividers):
	CSS Variable: --color-secondary-beige-light: #FAF0E6; (Linen)
	Tailwind Utility Name: secondary-beige-light
	Frontend Use: Use as the background color for hover states on interactive elements that have a beige base. Also, use for subtle horizontal rules (<hr />) or border colors for dividers between sections where a soft separation is needed.
o	Secondary Accent Darker (Secondary Buttons, Info):
	CSS Variable: --color-secondary-accent-darker: #A0522D; (Sienna)
	Tailwind Utility Name: secondary-accent-darker
	Frontend Use: Use for secondary button backgrounds, borders for secondary buttons, and as a color for informational icons or iconography that needs to be distinct but not primary.
o	Success / Completion Green:
	CSS Variable: --color-success-green: #38761D;
	Tailwind Utility Name: success-green
	Frontend Use: Use as the text color or background color for success messages (e.g., toasts, inline notifications). Also, use for icons indicating completion (e.g., checkmarks).
o	Notification / Alert Orange/Amber:
	CSS Variable: --color-notification-alert-orange-amber: #E69138;
	Tailwind Utility Name: notification-orange (or notification-amber)
	Frontend Use: Use as the background color or border color for non-critical alert banners. Also, use as the color for notification badges or relevant icons that signify a warning or non-critical alert.
o	Error / Warning Red:
	CSS Variable: --color-error-red: #CC0000;
	Tailwind Utility Name: error-red
	Frontend Use: Use as the text color for error messages. Use as the border color for input fields that are in an error state. Also, use as the color for error icons.
o	Verification Pending Blue/Purple:
	CSS Variable: --color-verification-pending-blue-purple: #674EA7;
	Tailwind Utility Name: verification-blue (or verification-purple)
	Frontend Use: Use as the color for tags, icons, or text elements that indicate a "pending verification" status. This color should draw attention to items requiring action or review.
o	Primary Text Dark:
	CSS Variable: --color-primary-text-dark: #4A4A4A;
	Tailwind Utility Name: primary-text-dark
	Frontend Use: Default text color for all body copy, headings, and labels when on light backgrounds (such as Primary Beige or Card Background).
o	Secondary Text Medium:
	CSS Variable: --color-secondary-text-medium: #757575;
	Tailwind Utility Name: secondary-text-medium
	Frontend Use: Use for placeholder text within input fields, less important labels, captions, and text content that is disabled.
o	Disabled Text / Borders Light:
	CSS Variable: --color-disabled-text-border-light: #BDBDBD;
	Tailwind Utility Name: disabled-text-border (can be used for both text and border, e.g., text-disabled-text-border, border-disabled-text-border)
	Frontend Use: Use as the text color for disabled buttons or inputs. Also, use as the default border color for subtle UI elements that do not require strong emphasis.
o	Iconography Color Application (reiteration for clarity):
	Active and interactive icons should use Tailwind utilities like text-primary-accent or text-primary-text-dark.
	Inactive or purely decorative icons should use text-secondary-text-medium.
•	Core Guideline for AI (Color Implementation): The defined CSS custom properties MUST be added to the tailwind.config.js file, extending the theme.colors object. For example:
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-beige': 'var(--color-primary-beige)',
        'primary-accent': 'var(--color-primary-accent)',
        // ... other colors
      },
    },
  },
  // ...
};
All components throughout the application must then reference these colors using Tailwind's utility classes (e.g., bg-primary-beige, text-primary-accent, border-error-red). This ensures global consistency and easy theming.
________________________________________
4. Typography System
•	Primary Font: Inter (Sans-Serif)
o	Frontend Use (Next.js & Tailwind CSS):
1.	The Inter font MUST be loaded using Next.js's built-in font optimization system (next/font/google). This ensures efficient loading, provides font-display: swap behavior by default (preventing Flash of Invisible Text - FOIT), and generates a CSS variable for the font family.
// Example in e.g., app/layout.jsx or a shared layout component
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable name
  weights: [400, 500, 600, 700] // Specify needed weights
});
2.	The generated CSS variable (e.g., var(--font-inter)) MUST be applied to the root layout element of the application (e.g., the <body> tag or a main wrapper <div>).
3.	This font variable MUST then be integrated into the tailwind.config.js file to set Inter as the default sans-serif font.
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Sets Inter as default
      },
    },
  },
  // ...
};
o	Available Weights to be Imported and Used:
	Regular (400)
	Medium (500)
	SemiBold (600)
	Bold (700)
•	Text Styles (Implementation with Tailwind CSS Utility Classes):
The following text styles define the typographic hierarchy. They should primarily be achieved by combining Tailwind CSS's utility classes (e.g., text-xl, font-bold, tracking-tight, leading-relaxed). For frequently used combinations that are not directly covered by a single Tailwind class, custom utility classes can be created using @apply in the styles/globals.css file, or these styles can be encapsulated within base component styles when customizing Shadcn UI components. Responsive variations are achieved using Tailwind's screen prefix utilities (e.g., md:text-lg).
o	.text-h1 (Primary Page Titles, Major Headers):
	Desktop: Approximately 28px. Tailwind: text-3xl (30px) or text-[28px].
	Tablet: Approximately 24px. Tailwind: text-2xl (24px).
	Mobile: Approximately 22px. Tailwind: text-xl (20px) or text-[22px].
	Common Tailwind classes: font-bold text-primary-text-dark tracking-tighter (Tailwind's tracking-tighter is -0.05em, adjust if -0.02em is strictly needed with arbitrary value).
o	.text-h2 (Section Headers, Card Titles):
	Desktop: Approximately 22px. Tailwind: text-xl (20px) or text-[22px].
	Tablet: Approximately 20px. Tailwind: text-lg (18px) or text-xl (20px).
	Mobile: Approximately 18px. Tailwind: text-lg (18px).
	Common Tailwind classes: font-semibold text-primary-text-dark tracking-tight (Tailwind's tracking-tight is -0.025em, adjust if -0.015em is strictly needed).
o	.text-h3 (Subsection Headers, Important Text):
	Desktop: Approximately 18px. Tailwind: text-lg (18px).
	Tablet: Approximately 17px. Tailwind: text-base (16px) or text-lg (18px).
	Mobile: Approximately 16px. Tailwind: text-base (16px).
	Common Tailwind classes: font-semibold text-primary-text-dark.
o	.text-body-large (Primary Reading Text):
	Desktop/Tablet: Approximately 16px. Tailwind: text-base (16px).
	Mobile: Approximately 15px. Tailwind: text-sm (14px) or text-base (16px).
	Common Tailwind classes: font-normal text-primary-text-dark leading-relaxed (Tailwind leading-relaxed is 1.625, close to 1.6).
o	.text-body-standard (Standard UI Text):
	Desktop/Tablet: Approximately 14px. Tailwind: text-sm (14px).
	Mobile: Approximately 13px. Tailwind: text-xs (12px) or text-sm (14px).
	Common Tailwind classes: font-normal text-primary-text-dark leading-normal (Tailwind leading-normal is 1.5).
o	.text-body-small (Secondary Information, Captions):
	Desktop/Tablet: Approximately 12px. Tailwind: text-xs (12px).
	Mobile: Approximately 11px. Tailwind: text-[11px].
	Common Tailwind classes: font-normal text-secondary-text-medium leading-snug (Tailwind leading-snug is 1.375, close to 1.4).
o	.text-button (Button Text):
	Desktop/Tablet: Approximately 15px. Tailwind: text-sm (14px) or text-base (16px).
	Mobile: Approximately 14px. Tailwind: text-sm (14px).
	Common Tailwind classes: font-medium. The color will depend on the button type and state, as defined in the Component Library section.
•	Responsive Adjustments: Use Tailwind's responsive prefixes (e.g., sm:text-base, md:text-lg, lg:text-xl) to adjust font sizes for the different breakpoints defined in Section 5 (Layout & Responsive Grid System).
•	Core Guideline for AI (Typography Implementation): Implement these typographic styles primarily using combinations of Tailwind CSS utility classes. Font sizes should be responsive using Tailwind's breakpoint prefixes. Avoid hardcoding pixel values for font sizes directly in component styles; rely on the configured Tailwind theme and its text utilities. Ensure next/font is used for loading Inter.
________________________________________
5. Layout & Responsive Grid System
•	Approach: The application will employ a responsive design methodology for all components and page layouts. This will be achieved using Next.js for the overall page and layout structure, and Tailwind CSS for implementing responsive styling, flexbox, and grid utilities.
•	Breakpoints (Definitive for Tailwind CSS Configuration):
The following breakpoints define the screen size thresholds for responsive design adjustments. These MUST be configured in the tailwind.config.js file under the theme.screens key. While Tailwind CSS is mobile-first, these definitions will allow for targeted styles at specific viewport widths.
o	mobile (and smaller): Styles applied by default (mobile-first). Corresponds to DuoTrak's max-width: 767px.
o	tablet: 768px. (Tailwind equivalent: md). Styles prefixed with md: will apply from 768px upwards. This covers DuoTrak's min-width: 768px and max-width: 1023px range for tablet-specific overrides.
o	desktop: 1024px. (Tailwind equivalent: lg). Styles prefixed with lg: will apply from 1024px upwards. This covers DuoTrak's min-width: 1024px.
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px', // Default Tailwind sm, can be used if needed
      'md': '768px', // Corresponds to DuoTrak 'tablet'
      'lg': '1024px', // Corresponds to DuoTrak 'desktop'
      'xl': '1280px', // Default Tailwind xl, for max content width
      '2xl': '1536px', // Default Tailwind 2xl
    },
    // ... other theme extensions
  },
  // ...
};
Frontend Implementation Note: When designing, consider mobile views first. Then, use Tailwind's md: and lg: prefixes to adapt the layout for tablet and desktop screens respectively.
•	Grid System Implementation:
Page sections and component layouts will be primarily constructed using Tailwind CSS's Flexbox utilities (e.g., flex, flex-col, items-center, justify-between, gap-4) and CSS Grid utilities (e.g., grid, grid-cols-2, lg:grid-cols-3, gap-6). There is no mandated specific column count (e.g., 12-column grid); the layout should be determined by what is most appropriate for the content and user experience on each screen and at each breakpoint.
•	Max Content Width (Desktop):
For desktop views, main content containers (excluding full-width headers or footers if any) should have a maximum width to ensure readability on very wide screens.
o	Tailwind Implementation: Use max-w-screen-xl (which defaults to 1280px) or a custom max-width class configured in tailwind.config.js if a different value is needed.
o	Centering: Apply mx-auto to center the container.
o	Padding: Apply horizontal padding using the defined spacing variables, e.g., px-lg (which would map to px-6 if space-lg is 24px and 1rem is 16px with Tailwind's default 1unit = 0.25rem). Example: className="max-w-screen-xl mx-auto px-6 lg:px-8" (adjust padding as needed per design).
o	The application's primary background color (Primary Beige) will fill the entire viewport beyond this max content width.
•	Spacing System (Implementation with Tailwind CSS Custom Properties):
A consistent spacing scale is crucial for visual rhythm and harmony. These spacing values MUST be defined in the tailwind.config.js file under theme.extend.spacing. This allows their use through Tailwind's margin (m-*, mx-*, mt-*), padding (p-*, px-*, pt-*), and gap (gap-*, gap-x-*, gap-y-*) utility classes.
o	xxs: 4px (Tailwind utility: 1 if base unit is 4px, or map to space-xxs)
o	xs: 8px (Tailwind utility: 2 or space-xs)
o	sm: 12px (Tailwind utility: 3 or space-sm)
o	md: 16px (Standard) (Tailwind utility: 4 or space-md)
o	lg: 24px (Tailwind utility: 6 or space-lg)
o	xl: 32px (Tailwind utility: 8 or space-xl)
o	xxl: 48px (Tailwind utility: 12 or space-xxl)
o	xxxl: 64px (Tailwind utility: 16 or space-xxxl)
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        'xxs': '0.25rem', // 4px
        'xs': '0.5rem',   // 8px
        'sm': '0.75rem',  // 12px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        'xxl': '3rem',    // 48px
        'xxxl': '4rem',   // 64px
      },
      // ...
    },
  },
  // ...
};
Frontend Implementation Note: Apply these spacing variables consistently for all margins, paddings, and gaps between elements using Tailwind utilities like p-md, mt-lg, gap-sm.
•	Core Guideline for AI (Layout Implementation): All layouts must be responsive, adapting to the defined breakpoints (mobile, tablet, desktop). Use Tailwind CSS utility classes for flexbox, grid, maximum width, and spacing. Ensure the spacing system defined in tailwind.config.js is used for all dimensional properties (margins, paddings, gaps).
________________________________________
6. Iconography
•	Library: Lucide React is the designated icon library. Individual icons should be imported as needed to optimize the application's bundle size.
o	Example Import: import { Home, User, Bell } from 'lucide-react';
•	Style: The default stroke width and visual style of Lucide React icons should be maintained unless a specific design requirement explicitly calls for an override (which should be rare).
•	Color Application (using Tailwind CSS):
Icon colors will be applied using Tailwind CSS's text color utility classes.
o	Active/Interactive Icons: Use text-primary-accent (e.g., <Home className="text-primary-accent" />) or text-primary-text-dark, depending on the context and desired emphasis.
o	Inactive/Decorative Icons: Use text-secondary-text-medium.
o	Error/Warning Icons: Use text-error-red for error-related icons, or text-notification-orange for warning icons, etc., corresponding to the functional colors.
•	Sizing & Touch Targets (using Tailwind CSS):
o	Default Icon Visual Size: Icons should generally be sized using Tailwind's width and height utilities. Common sizes will be:
	w-5 h-5 (for 20px by 20px icons)
	w-6 h-6 (for 24px by 24px icons)
o	Interactive Icon Touch Targets: When an icon is used as an interactive element (e.g., within an icon button), its clickable area (including any padding on its wrapper) MUST be at least 44px by 44px (w-11 h-11 in Tailwind) on touch-enabled devices to ensure usability.
	Frontend Implementation: If an icon itself is visually smaller (e.g., 24px), its button wrapper should have sufficient padding (e.g., p-2 around a w-6 h-6 icon results in a 40px target, p-2.5 would give 44px) to meet this requirement.
•	Core Guideline for AI (Icon Implementation): Import specific icons by name from lucide-react. Apply sizing using Tailwind's w-* and h-* utilities. Apply colors using Tailwind's text-* utilities based on the icon's state and purpose. For interactive icons, ensure the parent button or clickable wrapper provides an adequate touch target size. Do not invent new icons or use raster images for icons where a Lucide icon is suitable.
________________________________________
7. Component Library (Key UI Elements - Design Intent for Frontend Implementation)
General Implementation Notes for AI:
•	Component Location: All components defined in this section should be created as distinct React functional components and reside within the components/ directory, organized into subdirectories like Common/ (for widely reusable elements like Button), UI/ (for general UI elements like Card), Forms/, Navigation/, Overlays/, etc. For example: components/Common/Button.jsx, components/UI/Card.jsx.
•	Shadcn UI as a Foundation: For many of the components listed, Shadcn UI (which uses Radix UI primitives and Tailwind CSS) will serve as the foundational starting point. The AI should:
1.	Identify the closest Shadcn UI equivalent (e.g., Button, Card, Input, Dialog, Tabs from shadcn/ui).
2.	Assume the developer will install these components into the project (e.g., via the Shadcn CLI: npx shadcn@latest add button).
3.	The generated React component code will then wrap or directly customize the imported Shadcn UI component.
•	Tailwind CSS for Styling: All styling, including overriding or extending Shadcn UI's default Tailwind-based styles, MUST be done using Tailwind CSS utility classes, adhering to the color palette, typography, and spacing systems defined in Sections 3, 4, and 5.
•	Framer Motion for Animations: Interactive feedback, state transitions, and other specified animations MUST be implemented using Framer Motion.
•	Props and States: All components must implement the specified props and visual states.
•	Accessibility: Leverage the accessibility features built into Radix UI (via Shadcn UI) and ensure all custom implementations follow ARIA best practices.
________________________________________
A. Buttons (components/Common/Button.jsx)
•	Shadcn UI Base Component: Button from shadcn/ui.
o	Developer Note: Install via npx shadcn@latest add button.
•	DuoTrak Props (to be supported by the customized Shadcn Button):
o	variant: Enum ('primary', 'secondary', 'text', 'icon'). This will map to or extend Shadcn's variant and visual props.
o	size: Enum ('sm', 'md', 'lg'). This will map to or extend Shadcn's size prop.
o	disabled: boolean.
o	isLoading: boolean.
o	onClick: function.
o	children: ReactNode (for text or icon content).
o	iconLeft?: ReactNode (optional icon to display to the left of text).
o	iconRight?: ReactNode (optional icon to display to the right of text).
o	asChild?: boolean (prop from Shadcn Button to compose with other elements, e.g., Next.js <Link>).
o	className?: string (for additional Tailwind classes).
•	Styling and Behavior (Tailwind CSS customization of Shadcn Button variants & sizes):
o	General Styling:
	Border Radius: Apply rounded-md (Tailwind's rounded-md is 6px, var(--space-xs) is 8px. If 8px is strict, use rounded-[8px]). The default Shadcn button might have a different radius; this needs to be overridden.
	Font: Use .text-button typography style (e.g., text-sm font-medium or text-base font-medium depending on size prop).
	Transition: Apply a smooth transition for background color, border color, and opacity changes using Tailwind's transition utilities (e.g., transition-colors duration-150 ease-in-out). Framer Motion will handle transform-based animations.
	Layout with Icons: If iconLeft or iconRight is provided, use flex items-center justify-center gap-xs (e.g., gap-2).
o	variant="primary":
	Base: bg-primary-accent text-card-modal-background.
	Hover: hover:bg-primary-accent/90 (slightly desaturate or darken).
	Focus-Visible: focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-beige.
	Disabled: disabled:bg-disabled-text-border disabled:text-secondary-text-medium disabled:opacity-70 disabled:cursor-not-allowed.
	isLoading State:
	Display a Lucide React Loader2 icon (e.g., <Loader2 className="h-4 w-4 animate-spin" /> or size adjusted by button size prop) with text-card-modal-background.
	The button's text/children should be hidden or replaced by the spinner. The button should maintain its width.
	The button should be effectively disabled.
o	variant="secondary":
	Base: bg-transparent border-2 border-primary-accent text-primary-accent.
	Hover: hover:bg-secondary-beige-light.
	Focus-Visible: focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-beige.
	Disabled: disabled:border-disabled-text-border disabled:text-disabled-text-border disabled:opacity-70 disabled:cursor-not-allowed.
	isLoading State: Spinner color text-primary-accent. Text/children hidden.
o	variant="text":
	Base: bg-transparent text-primary-accent. No border.
	Hover: hover:bg-secondary-beige-light.
	Focus-Visible: focus-visible:ring-1 focus-visible:ring-primary-accent focus-visible:ring-offset-1 focus-visible:ring-offset-primary-beige.
	Disabled: disabled:text-disabled-text-border disabled:opacity-70 disabled:cursor-not-allowed.
	isLoading State: Spinner color text-primary-accent. Text/children hidden.
o	variant="icon":
	Base: bg-transparent. Icon color typically text-primary-text-dark or text-primary-accent.
	Hover: hover:bg-secondary-beige-light rounded-full (or rounded-md depending on desired shape).
	Focus-Visible: focus-visible:ring-1 focus-visible:ring-primary-accent.
	Disabled: disabled:text-disabled-text-border disabled:opacity-70 disabled:cursor-not-allowed.
	Touch Target: Ensure adequate padding (e.g., p-2) to make the clickable area at least 44x44px.
	isLoading State: Spinner replaces the icon.
o	size Prop Styling:
	sm: Smaller padding (e.g., px-sm py-xs -> px-3 py-1.5 or px-2 py-1), smaller font size (e.g., text-xs). Icon sizes within button also smaller (e.g., h-3.5 w-3.5).
	md (Default): Standard padding (e.g., px-md py-sm -> px-4 py-2), standard font size (e.g., text-sm). Icon sizes e.g., h-4 w-4.
	lg: Larger padding (e.g., px-lg py-md -> px-6 py-3), larger font size (e.g., text-base). Icon sizes e.g., h-5 w-5.
•	Animation (Framer Motion):
o	Press Feedback (all variants): Apply whileTap={{ scale: 0.98 }} using a motion.button wrapper or by passing motion props if Shadcn's Button is built with motion.
	Implementation Note: If Shadcn's Button is not a motion component by default, you might need to wrap it: <motion.div whileTap={{scale: 0.98}}><ShadcnButton ... /></motion.div> or use motion(ShadcnButton). The asChild prop on Shadcn Button might be useful here if composing with a motion element.
o	Hover Feedback (optional, if more than color change is desired): whileHover={{ scale: 1.03 }} for a subtle grow effect.
•	Core Guideline for AI (Button): Generate a Button.jsx component that uses the Shadcn UI Button as its base. Implement all specified variant and size props by applying the detailed Tailwind CSS classes. Ensure isLoading and disabled states are visually distinct and functional. Integrate Framer Motion for tap animations.
________________________________________
B. Cards (components/UI/Card.jsx)
•	Shadcn UI Base Component: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter from shadcn/ui.
o	Developer Note: Install via npx shadcn@latest add card.
•	DuoTrak Props (for a composite DuoTrakCard component or direct use of Shadcn Card parts):
o	children: ReactNode.
o	className?: string (for additional Tailwind classes on the main card wrapper).
o	paddingSize?: Enum ('md', 'lg') - to control the internal padding of CardContent. Default to 'md'.
o	Optional props for title, description, footerContent if creating a composite card.
•	Styling (Tailwind CSS customization of Shadcn Card components):
o	Card (Main Wrapper):
	Background: bg-card-modal-background (which is #FFFFFF).
	Border Radius: rounded-xl (Tailwind's rounded-xl is 12px, matching var(--space-sm)). Shadcn default might be different, ensure this is applied.
	Shadow: shadow-duotrak-card. This will be a custom shadow. Define in tailwind.config.js:
// tailwind.config.js
// ...
        extend: {
          boxShadow: {
            'duotrak-card': '0 2px 8px rgba(139, 69, 19, 0.1)',
          }
        }
// ...
o	CardHeader:
	Padding: Typically p-md (p-4) or p-lg (p-6).
o	CardTitle:
	Typography: Use .text-h2 styles (e.g., text-xl font-semibold text-primary-text-dark).
o	CardDescription:
	Typography: Use .text-body-standard styles (e.g., text-sm text-secondary-text-medium).
o	CardContent:
	Padding: Controlled by paddingSize prop.
	'md': p-md (e.g., p-4).
	'lg': p-lg (e.g., p-6).
o	CardFooter:
	Padding: Typically p-md (p-4) or p-lg (p-6). Often used with flex justify-end gap-sm.
•	Animation (Framer Motion - optional for general cards, more relevant for lists of cards):
o	If cards appear in a list that can be dynamically updated, individual cards can use layout prop from Framer Motion for smooth reordering, and AnimatePresence for enter/exit animations (e.g., fade in, slide in).
o	initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}.
•	Core Guideline for AI (Card): Generate components that utilize the Shadcn UI Card and its parts. Apply the specified Tailwind CSS classes for background, border-radius, and the custom shadow-duotrak-card. Ensure padding and typography within the card parts match the DuoTrak system.
________________________________________
C. Input Fields (components/Forms/Input.jsx)
•	Shadcn UI Base Component: Input from shadcn/ui.
o	Developer Note: Install via npx shadcn@latest add input. Also, install npx shadcn@latest add label for use with inputs.
•	DuoTrak Props (to be supported by the customized Shadcn Input):
o	id: string (for label association).
o	label?: string (Text for an associated <Label> component).
o	type: string (e.g., 'text', 'email', 'password', 'number').
o	placeholder?: string.
o	value: string or number.
o	onChange: function.
o	error?: string or boolean (If string, it's the error message. If boolean, indicates an error state without a specific message from this prop).
o	disabled?: boolean.
o	iconLeft?: ReactNode (Optional icon to display inside, to the left of the input area).
o	iconRight?: ReactNode (Optional icon to display inside, to the right of the input area, e.g., for password visibility toggle).
o	className?: string (for additional Tailwind classes on the wrapper or input itself).
o	name?: string (HTML name attribute).
•	Structure:
o	A wrapping div for the label, input, and error message.
o	A <Label htmlFor={id}>{label}</Label> component from Shadcn UI, styled with .text-body-standard text-primary-text-dark mb-xs (e.g., mb-1 or mb-2).
o	A relative positioned div if iconLeft or iconRight are used, to absolutely position icons within the input padding area.
o	The Shadcn Input component.
o	An optional error message p tag below the input if error prop is provided, styled with .text-body-small text-error-red mt-xs (e.g., mt-1 or mt-2).
•	Styling and Behavior (Tailwind CSS customization of Shadcn Input):
o	Base Input Styling:
	Background: bg-card-modal-background (i.e., #FFFFFF).
	Border: border border-disabled-text-border-light.
	Border Radius: rounded-md (Tailwind's rounded-md is 6px. If 8px from var(--space-xs) is strict, use rounded-[8px]). Shadcn default might need override.
	Padding: px-sm py-sm (e.g., px-3 py-2.5 or h-10 for a common height). If icons are present, padding on the icon side needs to be increased to accommodate the icon (e.g., pl-10 if iconLeft is present).
	Text Color: text-primary-text-dark.
	Placeholder Text Color: placeholder:text-secondary-text-medium.
	Font: .text-body-standard.
	Transition: transition-colors duration-150 ease-in-out for border color changes.
o	States:
	Focus-Visible: focus-visible:border-primary-accent focus-visible:ring-2 focus-visible:ring-primary-accent/30. (The original spec's box-shadow 0 0 0 2px rgba(139, 69, 19, 0.2) can be approximated with Tailwind's ring utilities).
	Error State (when error prop is true or a string):
	Border: border-error-red.
	Ring (optional, for more emphasis): focus-visible:ring-error-red/30.
	If error is a string, display it below the input.
	Disabled State: disabled:bg-secondary-beige-light/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:border-disabled-text-border-light.
o	Icons (iconLeft, iconRight):
	Positioned absolutely inside the input's padding area.
	Example for iconLeft: <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">{iconLeft}</div>. Input text would need pl-10 or similar.
	Example for iconRight: <div className="absolute right-0 inset-y-0 pr-3 flex items-center">{iconRight}</div>. Input text would need pr-10 or similar if icon is not a button. If it's a button (like password toggle), it might not need text padding adjustment.
	Icon Color: Typically text-secondary-text-medium unless interactive.
•	Animation (Framer Motion):
o	Input Error Shake (on form submission if field has error):
	The wrapping div of an input field can be animated.
	Apply animate={{ x: [0, -6, 6, -4, 4, 0] }} transition={{ duration: 0.4, ease: "easeInOut" }} when an error is triggered for this specific field. This should be controlled by the form's state.
•	Core Guideline for AI (Input Field): Generate an Input.jsx component that uses Shadcn UI Input and Label. Implement the label, icon positioning, error message display, and all specified styling states using Tailwind CSS. Integrate Framer Motion for the error shake animation, triggered by form logic.
________________________________________
D. Text Areas (components/Forms/TextArea.jsx)
•	Shadcn UI Base Component: Textarea from shadcn/ui.
o	Developer Note: Install via npx shadcn@latest add textarea.
•	DuoTrak Props (similar to Input):
o	id: string.
o	label?: string.
o	placeholder?: string.
o	value: string.
o	onChange: function.
o	error?: string or boolean.
o	disabled?: boolean.
o	rows?: number (e.g., 3 or 4 for default height).
o	className?: string.
o	name?: string.
•	Structure: Similar to Input Field (wrapper for label, textarea, error message).
•	Styling and Behavior (Tailwind CSS customization of Shadcn Textarea):
o	Base Textarea Styling:
	Follows the same styling principles as Input Fields for background, border, border-radius, padding (px-sm py-sm), text color, placeholder color, font, and transitions.
	Default height can be controlled by rows prop or Tailwind's height utilities (e.g., min-h-[80px]).
o	States (Focus-Visible, Error, Disabled):
	Identical styling and behavior to Input Fields.
o	Error Message Display: Identical to Input Fields.
•	Animation (Framer Motion):
o	Textarea Error Shake: Identical shake animation logic as Input Fields.
•	Core Guideline for AI (Text Area): Generate a TextArea.jsx component using Shadcn UI Textarea and Label. Implement styling and states consistent with the Input.jsx component using Tailwind CSS. Integrate Framer Motion for error shake.
________________________________________
E. Modals/Dialogs (components/Overlays/Modal.jsx)
•	Shadcn UI Base Component: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose from shadcn/ui.
o	Developer Note: Install via npx shadcn@latest add dialog.
•	DuoTrak Props (for a composite DuoTrakModal component):
o	isOpen: boolean (to control visibility programmatically).
o	onOpenChange: function(open: boolean) (callback for when Shadcn Dialog wants to change its open state).
o	triggerElement?: ReactNode (Optional element that, when clicked, opens the modal - uses DialogTrigger).
o	title?: string.
o	description?: string (Optional sub-header or descriptive text).
o	children: ReactNode (Main content of the modal).
o	footerContent?: ReactNode (Content for the modal footer, typically action buttons).
o	hideCloseButton?: boolean (To optionally hide the default 'X' close button).
o	size?: Enum ('sm', 'md', 'lg', 'xl') to control max-w-* of the modal content. Default 'md'.
•	Styling and Behavior (Tailwind CSS customization of Shadcn Dialog components):
o	Dialog (Root): Manages the open/close state.
o	DialogOverlay (Implicit in Shadcn):
	Styling: bg-black/50 fixed inset-0 z-40.
	Animation (Framer Motion): Fade in/out.
	initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}.
o	DialogContent:
	Positioning: fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50.
	Styling: Styled like a Card (see Section 7B): bg-card-modal-background rounded-xl shadow-duotrak-card.
	Width: Controlled by size prop (e.g., sm:max-w-sm, md:max-w-md, lg:max-w-lg, xl:max-w-xl). Default max-w-md.
	Padding: Internal padding for content area, e.g., p-lg (p-6).
	Animation (Framer Motion): Entrance/exit animation for the content panel itself.
	initial={{ opacity: 0, scale: 0.95, y: "-48%" }}
	animate={{ opacity: 1, scale: 1, y: "-50%" }}
	exit={{ opacity: 0, scale: 0.95, y: "-48%" }}
	transition={{ duration: 0.2, ease: "easeOut" }}.
o	DialogHeader:
	Styling: flex flex-col space-y-xs pt-lg px-lg (e.g., space-y-1.5 pt-6 px-6).
o	DialogTitle:
	Typography: .text-h2 (e.g., text-xl font-semibold text-primary-text-dark).
o	DialogDescription:
	Typography: .text-body-standard text-secondary-text-medium mt-xs.
o	Main Content Area (children):
	Typically rendered directly within DialogContent or a specific div inside it. px-lg pb-lg (e.g., px-6 pb-6) if header/footer have their own padding.
	If content is scrollable, this area should have overflow-y-auto max-h-[70vh] or similar.
o	DialogFooter:
	Styling: flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-sm pt-md pb-lg px-lg (e.g., pt-4 pb-6 px-6).
o	DialogClose (Default 'X' button):
	Positioned top-right. Shadcn handles this. Ensure its styling is subtle and uses a Lucide X icon.
	Can be hidden via hideCloseButton prop.
•	Interaction:
o	Close on "X" icon button (default behavior of Shadcn DialogClose).
o	Close on Escape key press (default behavior of Shadcn Dialog).
o	Close on overlay click (default behavior of Shadcn Dialog).
•	Core Guideline for AI (Modal/Dialog): Generate a Modal.jsx (or Dialog.jsx) component that robustly wraps and configures the Shadcn UI Dialog components. Implement the specified props for controlling content, appearance, and behavior. Apply Tailwind CSS for all styling, ensuring it matches the DuoTrak card aesthetic. Integrate Framer Motion for smooth overlay and content panel animations.
________________________________________
F. Tabs (components/Navigation/Tabs.jsx and components/Navigation/TabItem.jsx)
•	Shadcn UI Base Component: Tabs, TabsList, TabsTrigger, TabsContent from shadcn/ui.
o	Developer Note: Install via npx shadcn@latest add tabs.
•	DuoTrak Props:
o	For Tabs.jsx (wrapper component):
	defaultValue?: string (The id of the tab to be active by default).
	value?: string (Controlled active tab id).
	onValueChange?: function(value: string) (Callback when active tab changes).
	children: ReactNode (Typically TabList and a series of TabContent components).
	className?: string (For the root Tabs element).
	orientation?: 'horizontal' (default) or 'vertical'.
o	For TabList.jsx (if we create a distinct wrapper, or directly style Shadcn's TabsList):
	children: ReactNode (A series of TabItem components).
	className?: string.
o	For TabItem.jsx (maps to Shadcn's TabsTrigger):
	value: string (Unique identifier for this tab, corresponds to a TabsContent value).
	label: string or ReactNode (The visible label of the tab).
	disabled?: boolean.
	className?: string.
o	For TabContent.jsx (maps to Shadcn's TabsContent):
	value: string (Unique identifier, must match a TabItem value).
	children: ReactNode (The content to display when this tab is active).
	className?: string.
•	Styling and Behavior (Tailwind CSS customization of Shadcn Tabs components):
o	TabsList (Container for Tab Triggers):
	Base: inline-flex items-center justify-center rounded-md bg-secondary-beige-light p-1 (Shadcn default often has a background; we might want it transparent with just a bottom border on the list or individual items).
	DuoTrak Style (Alternative): flex border-b border-disabled-text-border-light space-x-md (for a more common tab list appearance without a background on the list itself).
	Decision Point: The original spec (page 6) implies a bottom border on the active tab, not necessarily the list. Let's go with a transparent TabsList background and focus styling on TabsTrigger.
	TabsList Styling (DuoTrak preferred): flex space-x-md (or space-x-lg for more separation). No explicit background or border on the list itself.
o	TabsTrigger (Individual Tab Item):
	Base: inline-flex items-center justify-center whitespace-nowrap rounded-sm px-md py-sm text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50. (This is a typical Shadcn base).
	DuoTrak Typography: Use .text-button (e.g., text-sm font-medium or text-base font-medium).
	DuoTrak Padding: px-sm py-xs (e.g., px-3 py-1.5) or px-md py-sm (px-4 py-2).
	DuoTrak Inactive State: text-secondary-text-medium hover:text-primary-text-dark. No background or border.
	DuoTrak Active State (when data-state="active"):
	text-primary-accent font-semibold.
	border-b-2 border-primary-accent.
	No background change for the active tab trigger itself, just text and border.
	DuoTrak Disabled State: text-disabled-text-border opacity-70 cursor-not-allowed.
o	TabsContent (Content Panel for an Active Tab):
	Base: mt-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2. (Shadcn default).
	DuoTrak Styling: Typically pt-md (e.g., pt-4) to provide space below the tab list. Content styling is up to the children.
•	Animation (Framer Motion for Tab Content Transition):
o	When the active tab changes, the content within TabsContent can animate in.
o	Wrap the children of each TabsContent with motion.div.
o	Use AnimatePresence around the conditionally rendered TabsContent if only one is shown at a time, or apply animations directly if Shadcn's TabsContent handles visibility.
o	Example motion.div props for content:
	initial={{ opacity: 0, y: 10 }}
	animate={{ opacity: 1, y: 0 }}
	exit={{ opacity: 0, y: -10 }} (if using AnimatePresence)
	transition={{ duration: 0.2, ease: "easeInOut" }}.
•	Core Guideline for AI (Tabs):
o	Generate Tabs.jsx, TabList.jsx (if needed as a styled wrapper), TabItem.jsx (as TabsTrigger), and TabContent.jsx components that utilize the corresponding Shadcn UI Tabs primitives.
o	Apply Tailwind CSS to TabsTrigger to achieve the specified active (text color, bottom border) and inactive states.
o	Ensure TabsList is styled to provide appropriate spacing between tab items.
o	Implement Framer Motion animations for the transition of TabsContent when the active tab changes.
________________________________________
(AI: Other components like ProfilePictureAvatar (Shadcn UI Avatar can be a base), ProgressIndicators/Charts (using a chosen library like Recharts or Chart.js, with stubs for data, wrapped in a DuoTrak component), MessageBubbles, NotificationBadge should be created as needed by screen designs, following the global styles. These will be detailed in Section 10 when they appear in specific screen flows. The general principles of using Shadcn as a base (if applicable), styling with Tailwind, and animating with Framer Motion will apply.)
________________________________________
8. Motion & Animation Guidelines
•	Implementation Philosophy:
Framer Motion is the primary library for implementing UI polish, complex animations, interactive feedback, and physics-based transitions. The goal is to create a fluid, responsive, and "FAANG-level" user experience. CSS transitions may be used for very simple, non-state-dependent hover effects (like color changes), but Framer Motion should be favored for anything involving component state, layout changes, or sequenced animations. The aesthetic guideline "Motion choreography implementing physics-based transitions for spatial continuity" should be a key inspiration.
•	Core Framer Motion Concepts to Utilize:
o	motion components (e.g., motion.div, motion.button).
o	initial, animate, exit props for declarative animations.
o	variants for defining reusable animation states.
o	transition prop for customizing duration, ease, type (tween, spring), delay, etc.
	ease: easeIn, easeOut, easeInOut, or custom cubic-bezier arrays [0.4, 0, 0.2, 1].
	type: "spring": For physics-based motion (use stiffness, damping, mass).
o	whileHover, whileTap, whileFocus for interaction-based animations.
o	AnimatePresence for animating components when they are added to or removed from the React tree.
o	layout prop for animating layout changes (e.g., list reordering, size changes).
•	Specific Animation Guidelines:
o	Transitions (General State Changes, Entrances, Exits):
	Animated Properties: Primarily animate opacity, transform (scale, x, y, rotate), backgroundColor, borderColor. Avoid animating layout properties like width, height, margin, padding directly if layout prop can achieve a smoother result.
	Default Durations:
	Page/View transitions: transition={{ duration: 0.25 }} to transition={{ duration: 0.35 }}.
	Component state changes (e.g., button loading, input error): transition={{ duration: 0.15 }} to transition={{ duration: 0.2 }}.
	Default Easing: ease: "easeInOut". For more dynamic feel, explore type: "spring", stiffness: 250, damping: 25. The cubic-bezier (0.4, 0, 0.2, 1) can be used as ease: [0.4, 0, 0.2, 1].
o	Loading States:
	Shimmer/Skeleton (components/Feedback/SkeletonLoader.jsx):
	Base: Use Shadcn UI Skeleton component.
	Styling: Customize with Tailwind: bg-secondary-beige-light as the base.
	Shimmer Animation: Implement a subtle, looping gradient animation. This can be a CSS animation applied via Tailwind's arbitrary animation utilities or a custom class.
/* In globals.css for the shimmer effect */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer-gradient {
  background-image: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.2) 80%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
Then apply .shimmer-gradient to the Skeleton component if it's a plain div, or to an overlay on top of the bg-secondary-beige-light.
	Props: className to pass Tailwind width, height, and rounded-* utilities.
	Spinner:
	Use Lucide React's Loader2 icon.
	Apply Tailwind's animate-spin utility.
	Color: text-primary-accent. Size: w-5 h-5 or as appropriate for context.
o	Feedback Animations (User Interactions):
	Button Press: As defined in Buttons section, use whileTap={{ scale: 0.98 }}.
	Checkmark Animation (on task completion, success states):
	Use an SVG checkmark icon (e.g., from Lucide React).
	Animate its appearance using Framer Motion:
	Path drawing: initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "circOut" }}.
	Or a simple scale/fade: initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}.
	Input Error Shake (on form validation failure):
	Apply to the input field's wrapper motion.div.
	animate={{ x: [0, -6, 6, -4, 4, 0] }} transition={{ duration: 0.4, ease: [0.36, 0.07, 0.19, 0.97] }} (using the specified cubic-bezier).
o	Layout Animations (Dynamic Lists, Content Resizing):
	When items are added, removed, or reordered in a list (e.g., notifications, dashboard cards):
	Wrap the list container with AnimatePresence.
	Make each list item a motion.div (or other motion element) and include the layout prop.
	Define initial, animate, and exit variants for item entrance/exit (e.g., fade, slide from side).
	Example item variants: initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}.
o	Page Transitions (Global Navigation):
	To be implemented in pages/_app.jsx (or the root layout component if using Next.js App Router).
	Wrap the <Component {...pageProps} /> with AnimatePresence and a motion.div.
	Define page transition variants:
const pageTransitionVariants = {
  initial: { opacity: 0, x: "-20px" }, // Slide in from left and fade
  animate: { opacity: 1, x: "0px" },
  exit: { opacity: 0, x: "20px" },    // Slide out to right and fade
};
	Apply to the motion.div:
<motion.div key={router.route} initial="initial" animate="animate" exit="exit" variants={pageTransitionVariants} transition={{ duration: 0.25, ease: "easeInOut" }}>
<Component {...pageProps} />
</motion.div>
•	Accessibility Considerations for Motion:
o	All animations should respect the prefers-reduced-motion media query. Framer Motion can handle this automatically for many cases, but be mindful.
o	Ensure animations do not cause content to flash excessively or trap focus.
•	Core Guideline for AI (Motion & Animation): Implement all significant UI animations and transitions using Framer Motion. Define reusable animation variants where appropriate. Animations should be purposeful, enhancing user feedback and perceived performance, rather than being purely decorative. Ensure animations are smooth and respect accessibility preferences.
________________________________________
9. Navigation Architecture (Detailed Frontend Implementation Guide)
General Implementation Notes for AI:
•	Framework: All navigation will be implemented using Next.js file-system routing and its <Link> component for client-side transitions.
•	Layouts: Separate layout components will be created for mobile/tablet and desktop views, switched by a responsive hook.
•	Styling: All navigation elements will be styled using Tailwind CSS, adhering to the defined color palette and typography.
•	Interactivity & Animation: Interactive states (hover, active, focus) will be clearly defined. Page transitions will use Framer Motion as specified in Section 8. Icons will be from Lucide React.
________________________________________
9.1. Global Responsive Layout Switcher
•	File: hooks/useResponsiveBreakpoints.js (or similar, e.g., hooks/useViewport.js).
•	Logic:
o	This custom React hook will use window.matchMedia to determine the current viewport size against the defined breakpoints (from Section 5, configured in Tailwind).
o	It should listen to window resize events to update its state.
o	Breakpoints to check against (from tailwind.config.js screens):
	isMobile: window.matchMedia("(max-width: 767px)") (or if using Tailwind's md as the tablet breakpoint, then !isTablet && !isDesktop).
	isTablet: window.matchMedia("(min-width: 768px) and (max-width: 1023px)").
	isDesktop: window.matchMedia("(min-width: 1024px)").
•	Returns: An object like { isMobile: boolean, isTablet: boolean, isDesktop: boolean }.
•	File: pages/_app.jsx (or the root layout if using Next.js App Router).
•	Logic for _app.jsx:
1.	Import useResponsiveBreakpoints.
2.	Call the hook to get the current viewport state.
3.	Conditionally render either MobileTabLayout.jsx or DesktopTopNavLayout.jsx as the primary layout wrapper for all pages.
4.	Wrap the page Component with AnimatePresence and motion.div for page transitions as defined in Section 8 (Motion & Animation Guidelines - Page Transitions).
// Example pseudo-structure for pages/_app.jsx
import MobileTabLayout from '../components/Layout/MobileTabLayout';
import DesktopTopNavLayout from '../components/Layout/DesktopTopNavLayout';
import useResponsiveBreakpoints from '../hooks/useResponsiveBreakpoints';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
// Import global styles, Tailwind base, font configuration from next/font

function MyApp({ Component, pageProps }) {
  const { isMobile, isTablet } = useResponsiveBreakpoints();
  const router = useRouter();

  const LayoutComponent = (isMobile || isTablet) ? MobileTabLayout : DesktopTopNavLayout;

  const pageTransitionVariants = { /* ... as defined in Section 8 ... */ };

  return (
    <LayoutComponent>
      <AnimatePresence mode="wait"> {/* 'mode="wait"' ensures exit animation completes before enter */}
        <motion.div
          key={router.route} // Key is important for AnimatePresence to detect page changes
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransitionVariants}
          transition={{ duration: 0.25, ease: "easeInOut" }} // Or as defined in Section 8
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </LayoutComponent>
  );
}
export default MyApp;
•	Core Guideline for AI (Layout Switcher): Implement the useResponsiveBreakpoints hook. In _app.jsx, use this hook to conditionally render the correct main layout component (MobileTabLayout or DesktopTopNavLayout) and implement the Framer Motion page transition wrapper.
________________________________________
9.2. Mobile/Tablet Layout (components/Layout/MobileTabLayout.jsx)
•	Structure:
o	A main flex container using Tailwind CSS: flex flex-col min-h-screen bg-primary-beige.
o	Content Area (children prop):
	Takes up most of the space: flex-grow overflow-y-auto.
	This is where the actual page content (passed as children) will be rendered.
	Default padding for content within pages: p-md (e.g., p-4) or p-lg (p-6).
o	Bottom Tab Bar: Fixed at the bottom, rendered by BottomTabBar.jsx.
•	Bottom Tab Bar Component (components/Navigation/BottomTabBar.jsx):
o	Shadcn UI Base (Conceptual): While Shadcn doesn't have a direct "BottomTabBar", the individual items will be like styled buttons or links.
o	Styling (Tailwind CSS):
	Positioning: fixed bottom-0 left-0 right-0 z-30.
	Height: h-16 (64px, using var(--space-xxxl)) or h-[60px] as per spec. Adjust for touch targets and aesthetics.
	Background: bg-card-modal-background (White).
	Shadow: shadow-[0_-2px_5px_rgba(0,0,0,0.05)] (subtle top shadow).
	Layout: flex justify-around items-center px-xs (e.g., px-2).
o	Tab Item Component (components/Navigation/BottomTabItem.jsx):
	Structure: A Next.js <Link href={href} passHref legacyBehavior> component wrapping an <a> tag (or directly if not using legacyBehavior). The <a> tag itself will be a flex container.
	<a className="flex flex-col items-center justify-center gap-xxs p-xs rounded-md">...</a> (e.g., gap-1 p-2).
	Props:
	href: string (URL for the link).
	icon: ReactNode (Lucide icon component).
	label: string.
	isActive: boolean.
	unreadCount?: number (for Notification Badge on Activity Tab).
	Icon Styling: Lucide React icon. Size e.g., w-6 h-6 (text-2xl if using font size for icons).
	Label Styling: Text using .text-body-small (e.g., text-xs or text-[11px]) and font-medium.
	Active State (isActive prop is true):
	Icon Color: text-primary-accent.
	Label Color: text-primary-accent.
	Inactive State:
	Icon Color: text-secondary-text-medium.
	Label Color: text-secondary-text-medium.
	Hover/Focus State (Subtle):
	hover:bg-secondary-beige-light focus-visible:bg-secondary-beige-light.
	focus-visible:ring-1 focus-visible:ring-primary-accent.
	Notification Badge (for Activity Tab, if unreadCount > 0):
	A small dot positioned at the top-right of the icon.
	Styling: absolute top-0 right-0 block h-2 w-2 transform translate-x-1/2 -translate-y-1/2 rounded-full.
	Color: bg-error-red or bg-notification-orange.
o	Tab Bar Content (to be rendered within BottomTabBar.jsx):
	Render four BottomTabItem components:
1.	Dashboard: Icon: Home (Lucide), Label: "Home", href: /dashboard.
2.	Partner: Icon: Users (Lucide), Label: "Partner", href: /partner.
3.	Progress: Icon: BarChart3 (Lucide), Label: "Progress", href: /progress.
4.	Activity: Icon: Bell (Lucide), Label: "Activity", href: /activity, with unreadCount prop.
	Active State Logic: Use useRouter() from next/router. Compare router.pathname with each BottomTabItem's href to determine its isActive state. For /dashboard, also consider / as active.
•	Core Guideline for AI (Mobile/Tablet Layout): Implement MobileTabLayout.jsx, BottomTabBar.jsx, and BottomTabItem.jsx. Ensure BottomTabItem uses Next.js <Link>. Style all elements with Tailwind CSS, including active/inactive states and the notification badge. Implement active state logic using useRouter.
________________________________________
9.3. Desktop Layout (components/Layout/DesktopTopNavLayout.jsx)
•	Structure:
o	A main flex container: flex flex-col min-h-screen bg-primary-beige.
o	Top Navigation Bar: Fixed or sticky at the top, rendered by TopNavBar.jsx.
o	Content Area (children prop):
	Takes up the remaining space: flex-grow overflow-y-auto.
	If Top Nav Bar is fixed: pt-16 (or pt-[var(--top-nav-bar-height)] if height is dynamic).
	Default padding for content within pages: p-lg (e.g., p-6) or p-xl (p-8).
•	Top Navigation Bar Component (components/Navigation/TopNavBar.jsx):
o	Styling (Tailwind CSS):
	Positioning: fixed top-0 left-0 right-0 z-30 (or sticky top-0 z-30).
	Height: h-16 (64px, using var(--space-xxxl)).
	Background: bg-card-modal-background (White).
	Shadow: shadow-md (e.g., 0 2px 5px rgba(0,0,0,0.05)).
	Layout: flex items-center justify-between px-lg (e.g., px-6).
o	Left Section (Logo):
	DuoTrak Logo: An SVG component or an <img> tag (using Next.js <Image>).
	Wrapped in a Next.js <Link href="/dashboard">.
	Styling: e.g., h-8 w-auto.
o	Center/Left Section (Main Links):
	Layout: flex items-center gap-lg (e.g., gap-6).
	Text Link Item Component (components/Navigation/TopNavLink.jsx):
	Structure: Next.js <Link href={href} passHref legacyBehavior> wrapping an <a> tag.
	<a className="py-sm text-sm font-medium relative">...</a> (e.g., py-2).
	Props: href: string, label: string, isActive: boolean.
	Styling (based on .text-button): text-sm font-medium (or text-base).
	Active State (isActive prop is true):
	Text Color: text-primary-accent.
	Bottom Border: A pseudo-element (::after) or an actual border div absolutely positioned. content-[''] absolute bottom-0 left-0 right-0 h-0.5 bg-primary-accent.
	Font Weight: font-semibold (or font-bold if more emphasis needed).
	Inactive State:
	Text Color: text-primary-text-dark.
	Hover State: hover:text-primary-accent.
	Focus-Visible State: focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-accent rounded-sm.
	Render TopNavLink components:
1.	"Dashboard" (href: /dashboard)
2.	"Partner" (href: /partner)
3.	"Progress" (href: /progress)
4.	"Goals" (href: /goals)
	Active State Logic: Use useRouter() from next/router. Compare router.pathname with each TopNavLink's href.
o	Right Section (Icons & Profile):
	Layout: flex items-center gap-md (e.g., gap-4).
	Notification Bell (components/Navigation/NotificationBell.jsx):
	Uses the Button component: <Button variant="icon" size="md" ...>.
	Icon: Lucide Bell size w-6 h-6 (text-2xl). Color: text-primary-text-dark (or var(--iconography-color)).
	Badge: Small red/amber dot (bg-error-red or bg-notification-orange) if unreadCount > 0, positioned top-right of the bell icon. (Similar to BottomTabItem badge).
	Interaction: onClick opens/closes NotificationDropdownPanel.jsx.
	User Profile Avatar/Menu (components/Navigation/UserProfileMenu.jsx):
	Avatar: Use Shadcn UI Avatar and AvatarImage/AvatarFallback.
	Size: w-8 h-8 or w-10 h-10 (32px or 40px). rounded-full.
	cursor-pointer.
	AvatarImage src from user data, AvatarFallback with user initials.
	Interaction: onClick opens/closes ProfileDropdownMenu.jsx.
o	Dropdown Panels (Positioned below their triggers):
	NotificationDropdownPanel.jsx (components/Overlays/NotificationDropdownPanel.jsx):
	Shadcn UI Base: Popover, PopoverTrigger, PopoverContent from shadcn/ui.
	Developer Note: Install via npx shadcn@latest add popover.
	Trigger is the NotificationBell button.
	PopoverContent Styling: Styled like a Card (bg-white, shadow, rounded-lg). w-[360px] p-0. Max height with overflow scroll (e.g., max-h-[400px] overflow-y-auto).
	Contains the Notification List (detailed in Section 10.7).
	ProfileDropdownMenu.jsx (components/Overlays/ProfileDropdownMenu.jsx):
	Shadcn UI Base: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator from shadcn/ui.
	Developer Note: Install via npx shadcn@latest add dropdown-menu.
	Trigger is the UserProfileAvatar.
	DropdownMenuContent Styling: Styled like a Card. w-56 (or as needed).
	DropdownMenuItems (each a Next.js <Link> if navigating, or a button if an action):
1.	"My Profile" (href: /profile)
2.	"Account Settings" (href: /settings)
3.	"Logout" (triggers logout function).
	Style DropdownMenuItem for hover, focus states.
•	Core Guideline for AI (Desktop Layout): Implement DesktopTopNavLayout.jsx, TopNavBar.jsx, TopNavLink.jsx, NotificationBell.jsx, and UserProfileMenu.jsx. Use Shadcn UI Popover for notifications and DropdownMenu for the profile menu, styling their content areas like Cards. Ensure Next.js <Link> is used for navigation links and active states are correctly implemented.
________________________________________
9.4. Contextual Navigation (Within Pages)
•	Screen Headers (components/UI/ScreenHeader.jsx):
o	Used for pages not directly part of the main tab/top nav (e.g., a specific goal's system list, an edit form, or a sub-page like "Activity Details").
o	Structure: A div container.
o	Props:
	title: string.
	showBackButton?: boolean (default true).
	onBackClick?: function (custom back action; if not provided and showBackButton is true, use router.back()).
	actionSlot?: ReactNode (for right-side action buttons/icons).
o	Styling (Tailwind CSS):
	Layout: flex items-center justify-between h-14 (56px) px-md (e.g., px-4).
	Background: bg-card-modal-background or bg-transparent if page background is primary-beige.
	Border: Optional border-b border-disabled-text-border-light.
o	Elements:
	Left (Back Button):
	If showBackButton is true: Render a Button component (variant="icon") with a Lucide ArrowLeft icon.
	onClick uses onBackClick prop or router.back().
	Center (Title):
	Render title prop using .text-h2 style (e.g., text-lg font-semibold text-primary-text-dark). flex-grow text-center if back button is present and no action slot, or ml-md if back button is present.
	Right (Action Slot):
	Render actionSlot if provided (e.g., a Button with variant="icon" and a Plus or Settings Lucide icon).
•	Tabs within Pages (e.g., Partner View, Goal Detail View):
o	Use the Tabs.jsx component (defined in Section 7F) for secondary navigation within a page.
o	Styling should be consistent with the main Tabs component.
•	Core Guideline for AI (Contextual Navigation): Create the ScreenHeader.jsx component with the specified props and responsive styling. Ensure it integrates with next/router for back functionality. The main navigation components (BottomTabBar, TopNavBar) will manage titles for primary navigation routes; ScreenHeader is for sub-pages or contextual headers.
________________________________________
10. Key Screen Flows & Detailed UI/UX Specifications
General Implementation Notes for AI (Screens):
•	Page Files: Each distinct screen or view will typically correspond to a file in the pages/ directory in Next.js (e.g., pages/signup.jsx, pages/dashboard.jsx). Dynamic routes will use bracket notation (e.g., pages/goals/[goalId].jsx).
•	Layout Integration: All page components will be wrapped by the appropriate layout (MobileTabLayout or DesktopTopNavLayout) via _app.jsx.
•	Component Reusability: Utilize components from the Component Library (Section 7) wherever possible.
•	State Management: Use useState and useEffect for local component state and data fetching from stubbed API functions. Global state (like auth status) will come from AuthContext.
•	Responsiveness: All screens must be responsive, adapting their layout and component presentation based on the active viewport (mobile, tablet, desktop) using Tailwind CSS.
•	Animations: Apply Framer Motion for page transitions (handled globally in _app.jsx) and for specific microinteractions or state changes within screens as detailed.
________________________________________
10.1. User Onboarding (Signup, Login, Partnership, Initial Profile)
General Onboarding Layout Note: These screens (Signup, Login, Forgot Password, etc.) will generally use a simple, centered layout on the bg-primary-beige app background. The main content (form, messages) will be contained within a Card-like element.
•	10.1.1. Signup Screen (pages/signup.jsx)
o	Purpose: Allow new users to create an account.
o	Layout:
	Container: A motion.div (for Framer Motion entrance animation) centered on the page.
	Tailwind: min-h-screen flex flex-col items-center justify-center bg-primary-beige p-md.
	Content Card: A Card component (from Section 7B).
	Tailwind: w-full max-w-md (e.g., 448px, approximating 480px spec).
	CardHeader, CardContent, CardFooter will be used.
	Framer Motion entrance for the card: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} (delay after page transition).
o	UI Components & Interactions (within the Card):
	CardHeader:
	Optional: Small DuoTrak SVG logo centered above the header text.
	CardTitle with .text-h1 style: "Create Your DuoTrak Account". Tailwind: text-center.
	CardContent:
	A form element with onSubmit={handleSignupSubmit}.
	Username Input:
	Input.jsx component (from Section 7C).
	Props: id="username", label="Username", placeholder="Choose a unique username", type="text", value={formData.username}, onChange={handleChange}, error={errors.username}.
	Client-side validation: required, min length (e.g., 3 chars), alphanumeric.
	Error examples: "Username is required", "Username too short", "Username already taken" (this last one would come from a backend stub).
	Email Input:
	Input.jsx component.
	Props: id="email", label="Email Address", placeholder="you@example.com", type="email", value={formData.email}, onChange={handleChange}, error={errors.email}.
	Client-side validation: required, valid email format.
	Error examples: "Email is required", "Invalid email format", "Email already registered" (backend stub).
	Password Input:
	Input.jsx component.
	Props: id="password", label="Password", placeholder="Create a strong password", type={showPassword ? 'text' : 'password'}, value={formData.password}, onChange={handleChange}, error={errors.password}.
	iconRight: A Button (variant="icon") with Lucide Eye / EyeOff icon to toggle password visibility.
	Client-side validation: required, min length (e.g., 8 chars).
	Error examples: "Password is required", "Password must be at least 8 characters."
	Confirm Password Input:
	Input.jsx component.
	Props: id="confirmPassword", label="Confirm Password", placeholder="Re-enter your password", type={showConfirmPassword ? 'text' : 'password'}, value={formData.confirmPassword}, onChange={handleChange}, error={errors.confirmPassword}.
	iconRight: Similar visibility toggle.
	Client-side validation: required, must match password field.
	Error example: "Passwords do not match."
	Timezone Select:
	Use Shadcn UI Select, SelectTrigger, SelectValue, SelectContent, SelectItem components.
	Developer Note: Install via npx shadcn@latest add select.
	Wrap with a <Label>: "Your Primary Timezone".
	SelectTrigger styled like an Input.jsx.
	options={ianaTimezoneList} (mock this list for now, e.g., ['America/New_York', 'Europe/London', 'Asia/Tokyo']).
	value={formData.timezone}, onValueChange={(value) => handleTimezoneChange(value)}, error={errors.timezone}.
	Required. Error: "Please select your timezone."
	Profile Picture Upload (Optional):
	components/Forms/ImageUpload.jsx (custom component to build).
	Label: "Profile Picture (Optional)".
	UI: A circular area (e.g., w-24 h-24 rounded-full bg-secondary-beige-light flex items-center justify-center cursor-pointer) with a Lucide Camera icon. On click, triggers a hidden <input type="file" accept="image/*" />.
	Preview: If an image is selected, display it within the circular area. Show an option/icon (e.g., Lucide X or Trash2) to remove/change the image.
	State: profileImageFile, profileImagePreviewUrl.
	Short Bio Text Area (Optional):
	TextArea.jsx component (from Section 7D).
	Props: id="bio", label="Short Bio (Optional)", placeholder="Tell your partner a bit about yourself (max 200 characters)", value={formData.bio}, onChange={handleChange}, maxLength={200}, rows={3}.
	Terms & Conditions Checkbox:
	Use Shadcn UI Checkbox and Label components.
	Developer Note: Install via npx shadcn@latest add checkbox.
	Structure: <div className="flex items-center space-x-sm"> <Checkbox id="terms" checked={formData.agreedToTerms} onCheckedChange={handleCheckboxChange} /> <Label htmlFor="terms" className="text-sm">I agree to the <NextLink href="/terms" className="text-primary-accent hover:underline">Terms & Conditions</NextLink> and <NextLink href="/privacy" className="text-primary-accent hover:underline">Privacy Policy</NextLink>.</Label> </div>.
	error={errors.agreedToTerms} displayed below.
	Required. Error: "You must agree to the terms."
	CardFooter:
	Signup Button:
	Button.jsx component (from Section 7A).
	Props: type="submit", variant="primary", className="w-full", isLoading={isSubmitting}, disabled={!isFormValid || isSubmitting}.
	Text: "Create Account". Loading text: "Creating Account..." (achieved by isLoading prop hiding children and showing spinner).
	Footer Link:
	p tag with .text-body-standard text-center mt-md.
	Text: "Already have an account? <NextLink href='/login' className='font-medium text-primary-accent hover:underline'>Log In</NextLink>"
o	Client-Side State (useState):
	formData object (for all form fields).
	errors object (for validation errors).
	isSubmitting (boolean).
	showPassword, showConfirmPassword (booleans for visibility toggles).
o	API Stub (services/authService.js - signupUser(data)):
	Simulate API call, image upload.
	Return { success: true, user: {...}, message: "..." } or { success: false, errors: { field: "message" } }.
o	Interaction:
	On successful stubbed signup: Show a success message/toast (using Sonner) (e.g., "Account created! Please check your email to verify.") and redirect to /login or a "check your email" page.
	Handle errors by updating the errors state and displaying messages inline.
	Use Framer Motion for subtle entrance animations on the card and shake animations on input errors.
•	Core Guideline for AI (Signup Screen): Implement pages/signup.jsx using the centered Card layout. Utilize the specified DuoTrak/Shadcn components for all form elements. Implement client-side validation, state management for the form, and interaction with the authService.signupUser stub. Apply Framer Motion for entrance and error animations.
________________________________________
10.1.2. Login Screen (pages/login.jsx)
•	Purpose: Allow existing users to log into their accounts.
•	Layout:
o	Identical to Signup Screen: Centered motion.div container on bg-primary-beige, with a Card component for the form content.
o	Framer Motion entrance animation for the card as per Signup Screen.
•	UI Components & Interactions (within the Card):
o	CardHeader:
	CardTitle with .text-h1 style: "Welcome Back!". Tailwind: text-center.
o	CardContent:
	A form element with onSubmit={handleLoginSubmit}.
	Email Input:
	Input.jsx component (from Section 7C).
	Props: id="email", label="Email Address", placeholder="you@example.com", type="email", value={formData.email}, onChange={handleChange}, error={errors.email}.
	Password Input:
	Input.jsx component.
	Props: id="password", label="Password", placeholder="Enter your password", type={showPassword ? 'text' : 'password'}, value={formData.password}, onChange={handleChange}, error={errors.password}.
	iconRight: A Button (variant="icon") with Lucide Eye / EyeOff icon to toggle password visibility.
	"Forgot Password?" Link:
	A Next.js <Link href='/forgot-password'> component.
	Styled with Tailwind: block text-sm text-primary-accent hover:underline text-right mb-md mt-xs (e.g., mb-4 mt-1).
	Text: "Forgot Password?"
o	CardFooter:
	Login Button:
	Button.jsx component (from Section 7A).
	Props: type="submit", variant="primary", className="w-full", isLoading={isSubmitting}, disabled={!isFormValid || isSubmitting}.
	Text: "Log In". Loading text: "Logging In..."
	Footer Link (Signup):
	p tag with .text-body-standard text-center mt-md.
	Text: "New to DuoTrak? <NextLink href='/signup' className='font-medium text-primary-accent hover:underline'>Create an Account</NextLink>"
•	Client-Side State (useState):
o	formData object (email, password).
o	errors object.
o	isSubmitting (boolean).
o	showPassword (boolean).
•	API Stub (services/authService.js - loginUser(email, password)):
o	Simulate API call.
o	Return { success: true, session: {...} } (mock session object) or { success: false, error: "Invalid email or password." }.
•	Interaction:
o	On successful stubbed login: Store session (e.g., in AuthContext), redirect to /dashboard.
o	Display error message (e.g., below the form or as a toast using Sonner) on failure.
o	Framer Motion for input error shakes if applicable.
•	Core Guideline for AI (Login Screen): Implement pages/login.jsx with a similar structure to Signup. Use DuoTrak/Shadcn components for inputs and buttons. Handle form state, submission, and interaction with the authService.loginUser stub.
________________________________________
10.1.3. Forgot Password Screen (pages/forgot-password.jsx)
•	Purpose: Allow users to request a password reset link.
•	Layout:
o	Identical to Signup/Login Screen: Centered motion.div container, Card component.
o	Framer Motion entrance animation for the card.
•	UI Components & Interactions (within the Card):
o	CardHeader:
	CardTitle with .text-h1 style: "Reset Password". Tailwind: text-center.
	CardDescription with .text-body-standard text-center mt-sm: "Enter your email address below, and we'll send you a link to reset your password."
o	CardContent:
	A form element with onSubmit={handleForgotPasswordSubmit}.
	Email Input:
	Input.jsx component.
	Props: id="email", label="Email Address", placeholder="you@example.com", type="email", value={formData.email}, onChange={handleChange}, error={errors.email}.
o	CardFooter:
	Send Reset Link Button:
	Button.jsx component.
	Props: type="submit", variant="primary", className="w-full", isLoading={isSubmitting}, disabled={isSubmitting || emailSent}.
	Text: emailSent ? "Link Sent!" : "Send Reset Link". Loading text: "Sending..."
	Success Message (Conditional, if emailSent is true):
	A p tag with .text-body-standard text-center mt-md text-success-green.
	Text: "If an account exists for {formData.email}, a password reset link has been sent. Please check your inbox (and spam folder)."
	Footer Link (Back to Login):
	p tag with .text-body-standard text-center mt-md.
	Text: "<NextLink href='/login' className='font-medium text-primary-accent hover:underline'>Back to Login</NextLink>"
•	Client-Side State (useState):
o	formData object (email).
o	errors object.
o	isSubmitting (boolean).
o	emailSent (boolean, to change button text and show success message).
•	API Stub (services/authService.js - sendPasswordResetEmail(email)):
o	Simulate API call. Always return { success: true } (to not reveal if an email exists).
•	Interaction:
o	On submit, call API stub.
o	On success, set emailSent to true, disable button, show success message.
o	Handle input validation errors.
•	Core Guideline for AI (Forgot Password Screen): Implement pages/forgot-password.jsx. Use DuoTrak/Shadcn components. Manage form state including emailSent status for UI changes.
________________________________________
10.1.4. Reset Password Screen (pages/reset-password.jsx)
•	Purpose: Allow users to set a new password using a token from email.
•	Access: Typically accessed via a link like /reset-password?token=TOKEN_FROM_EMAIL.
o	The page should use useRouter() from next/router to extract the token from the query parameters on mount.
•	Layout:
o	Centered motion.div container, Card component.
o	Framer Motion entrance animation.
•	UI Components & Interactions (within the Card):
o	Conditional Rendering based on token validity (checked via API stub on mount):
	Loading State (while verifying token): Display a Lucide Loader2 spinner.
	Invalid/Expired Token State:
	CardHeader: CardTitle "Invalid Link".
	CardContent: p tag with .text-body-standard: "This password reset link is invalid or has expired. Please <NextLink href='/forgot-password' className='text-primary-accent hover:underline'>request a new one</NextLink>."
	Valid Token State (Show Form):
	CardHeader: CardTitle with .text-h1: "Create New Password".
	CardContent:
	A form with onSubmit={handleResetPasswordSubmit}.
	New Password Input:
	Input.jsx component. Props similar to Signup password, including validation and visibility toggle.
	Confirm New Password Input:
	Input.jsx component. Props similar to Signup confirm password.
	CardFooter:
	Set New Password Button:
	Button.jsx. Props: type="submit", variant="primary", className="w-full", isLoading={isSubmitting}. Text: "Update Password". Loading: "Updating..."
	Optional "Back to Login" link if form submission fails irrecoverably.
•	Client-Side State (useState):
o	token: (from URL).
o	tokenState: ('verifying', 'valid', 'invalid').
o	formData (newPassword, confirmNewPassword).
o	errors object.
o	isSubmitting (boolean).
o	passwordResetSuccess (boolean).
•	API Stubs (services/authService.js):
o	verifyPasswordResetToken(token): Called on page load. Returns { success: true } or { success: false, error: "Invalid or expired token." }.
o	setNewPasswordWithToken(token, newPassword): Returns { success: true, message: "Password updated successfully!" } or { success: false, error: "Failed to update password." }.
•	Interaction:
o	On mount, call verifyPasswordResetToken. Update tokenState.
o	If token is valid, allow form submission.
o	On successful password update: Show success message/toast (using Sonner), redirect to /login.
o	Handle errors from API stubs and display them.
•	Core Guideline for AI (Reset Password Screen): Implement pages/reset-password.jsx. Handle token extraction and verification. Conditionally render UI based on token state. Use DuoTrak/Shadcn components for the form.
________________________________________
10.1.5. Partnership Invitation Acceptance Flow (pages/partner-invite/accept.jsx)
•	Purpose: Allow a user to accept or decline a partnership invitation.
•	Access: Via a link with a token, e.g., /partner-invite/accept?invite_token=INVITE_TOKEN.
o	Use useRouter() to get invite_token.
•	Layout:
o	Centered content on bg-primary-beige. A Card component for details.
o	Framer Motion entrance animation.
•	UI States & Components (within the Card):
o	Initial Loading State (while verifying invite_token):
	CardContent: "Verifying invitation..." with a Lucide Loader2 spinner.
o	Token Invalid/Expired/Used State:
	CardHeader: CardTitle with .text-h1: "Invitation Problem".
	CardContent: p with .text-body-standard: "This invitation link is invalid, has expired, or has already been used. <NextLink href='/dashboard' className='text-primary-accent hover:underline'>Go to Dashboard</NextLink>."
o	Token Valid & User Needs to Log In/Sign Up State:
	CardHeader: CardTitle with .text-h1: "[InviterUsername] has invited you!".
	CardContent:
	p with .text-body-standard: "[InviterUsername] has invited you to be their accountability partner on DuoTrak! Please log in or sign up to accept."
	Render a compact Login form snippet OR Signup form snippet (or links to full /login and /signup pages). For MVP, links are simpler:
	Button.jsx variant="primary" className="w-full" asChild><NextLink href={`/login?redirect=/partner-invite/accept?invite_token=${inviteToken}`}>Log In to Accept</NextLink></Button>
	Button.jsx variant="secondary" className="w-full mt-sm" asChild><NextLink href={`/signup?redirect=/partner-invite/accept?invite_token=${inviteToken}`}>Sign Up to Accept</NextLink></Button>
o	Token Valid & User Logged In State:
	CardHeader: CardTitle with .text-h1: "Partnership Invitation".
	CardContent:
	Layout: flex flex-col items-center gap-md.
	Inviter's Profile Picture (if available from getInviteDetails stub):
	Shadcn UI Avatar (w-20 h-20 or w-24 h-24). AvatarImage src={inviteDetails.inviter.profileImageUrl}. AvatarFallback with inviter's initials.
	p with .text-lg font-medium text-center: "{inviteDetails.inviter.username} wants to be your accountability partner on DuoTrak!"
	div with flex gap-md mt-lg:
	Accept Invitation Button: Button.jsx variant="primary" isLoading={isAccepting} onClick={handleAccept}. Text: "Accept Invitation".
	Decline Invitation Button (Optional): Button.jsx variant="text" isLoading={isDeclining} onClick={handleDecline}. Text: "Decline".
•	Client-Side State (useState):
o	inviteToken: (from URL).
o	inviteDetails: (from API, includes inviter.username, inviter.profileImageUrl).
o	isLoading: (for initial token verification).
o	isAccepting, isDeclining: (for button actions).
o	error: (string for error messages).
o	currentUser: (from AuthContext to know if user is logged in).
•	API Stubs (services/partnershipService.js):
o	getInviteDetails(inviteToken): Returns { success: true, inviter: { username: 'PartnerAlice', profileImageUrl: '...' } } or { success: false, error: "Invalid token." }.
o	acceptPartnershipInvite(inviteToken, currentUser): Returns { success: true, partnership: {...} } or { success: false, error: "Failed to accept." }.
•	Interaction:
o	On mount, call getInviteDetails.
o	If currentUser is null and token valid, show login/signup prompts.
o	If currentUser exists and token valid, show accept/decline options.
o	On accept: call acceptPartnershipInvite. Update AuthContext or global state with partnership info. Show success toast (Sonner). Redirect to /dashboard.
o	On decline: (Optional) call a declinePartnershipInvite stub. Redirect or show message.
o	Handle API errors and display them.
•	Core Guideline for AI (Partnership Invite Accept): Implement pages/partner-invite/accept.jsx. Handle token extraction and validation. Conditionally render UI based on token validity and user authentication status. Use DuoTrak/Shadcn components. Interact with partnershipService stubs.
________________________________________
10.1.6. Partnership Setup Screen (pages/partnership/setup.jsx)
•	Purpose: Shown if a user is logged in but does not yet have a partner (authContext.user.partnershipId is null). Allows them to invite a partner. The "Enter Invite Code" flow is considered secondary/optional for MVP.
•	Layout:
o	Centered motion.div container, Card component.
o	Framer Motion entrance animation.
•	UI Components & Interactions (within the Card):
o	CardHeader:
	CardTitle with .text-h1: "Find Your Accountability Partner".
o	CardContent:
	Section 1: Invite a Partner
	h2 with .text-h2 (or h3 with .text-h3): "Invite Your Partner".
	p with .text-body-standard mb-md: "Enter your partner's email address. We'll send them an invitation to join you on DuoTrak."
	A form with onSubmit={handleInviteSubmit}:
	Partner's Email Input: Input.jsx. Props: id="partnerEmail", label="Partner's Email", type="email", value={inviteEmail}, onChange={setInviteEmail}, error={inviteError}.
	Send Invite Button: Button.jsx variant="primary" className="w-full mt-sm" isLoading={isInviting}. Text: inviteSent ? "Invite Sent!" : "Send Invite".
	Success message if inviteSent: p className="text-success-green mt-sm text-center": "Invitation sent to {inviteEmail}!"
•	Client-Side State (useState):
o	inviteEmail, setInviteEmail.
o	isInviting, inviteSent, inviteError.
o	currentUser (from AuthContext).
•	API Stubs (services/partnershipService.js):
o	sendPartnershipInviteEmail(partnerEmail, currentUser): Returns { success: true, message: "Invitation sent!" } or { success: false, error: "..." }.
•	Interaction:
o	On successful invite send: Update UI (set inviteSent to true), potentially update AuthContext/global state if backend confirms immediate linking (though unlikely for invite flow). Show success toast (Sonner). For MVP, user stays on this page but sees "Invite Sent!". Redirect to dashboard might happen after partner accepts.
o	Display success/error messages inline or via toasts.
•	Core Guideline for AI (Partnership Setup): Implement pages/partnership/setup.jsx. Provide UI for inviting a partner by email as the primary flow. Interact with partnershipService stubs.
________________________________________
10.2. Dashboard Screen (pages/dashboard.jsx or pages/index.jsx if it's the root after login)
•	Purpose: The user's primary hub for daily/weekly activity. It displays systems due for check-in, allows quick access to these check-ins, shows verification alerts from their partner, and provides a prompt for daily reflection.
•	Access: This is the default screen after a user logs in, provided they have a partner and have completed any initial setup. It's also accessible via a "Dashboard" or "Home" navigation item in the BottomTabBar and TopNavBar.
•	Client-Side State (useState, useEffect):
o	isLoadingDashboardData: boolean (true while fetching initial data).
o	dashboardData: object | null. Structure:
{
  username: string;
  currentDateString: string; // Formatted date, e.g., "Tuesday, June 4, 2025"
  verificationAlerts: {
    count: number;
    partnerName: string;
  } | null;
  systemsForToday: Array<{ // SystemCardData type
    systemId: string;
    description: string;
    scheduledTime?: string; // e.g., "07:00 AM"
    status: 'todo' | 'completed' | 'skipped' | 'pendingPartnerVerification' | 'awaitingUserVerification' | 'queriedByPartner';
    metricType: 'binary' | 'counter' | 'duration' | 'pages';
    lastValue?: string | number; // Value logged if status is completed/skipped
    goalTitle?: string;
    partnerCheckinId?: string; // If this system's check-in is by partner and needs verification
  }>;
  dailyReflection: {
    status: 'pending' | 'completed';
    text?: string; // If completed
  };
}
o	errorLoadingDashboard: string | null (To store error messages if data fetching fails).
•	API Stub (services/dashboardService.js - fetchDashboardData(userId)):
o	Simulates fetching all necessary data for the dashboard.
o	Returns { success: true, data: dashboardData } or { success: false, error: "Failed to load dashboard data." }.
o	The mock data should include various scenarios for systemsForToday and verificationAlerts.
•	Initial Data Fetch:
o	In a useEffect hook that runs on component mount, call the fetchDashboardData stub.
o	Set isLoadingDashboardData to true before the call and false after.
o	Populate dashboardData on success or errorLoadingDashboard on failure.
•	Layout & Responsiveness:
o	The page uses the appropriate responsive layout (MobileTabLayout or DesktopTopNavLayout) provided by _app.jsx.
o	Content Area Padding: Mobile/Tablet: p-md. Desktop: p-lg or p-xl.
o	Mobile: Single column, vertical flow.
o	Tablet: Wider single column.
o	Desktop: Potential two-column layout: Main Content (lg:w-2/3), Sidebar (lg:w-1/3). For MVP, a responsive single column is also acceptable.
•	UI Components & Interactions:
o	Loading State UI (if isLoadingDashboardData):
	Display 2-3 SkeletonLoader.jsx (Shadcn Skeleton based) mimicking SystemCard.jsx.
	Display one SkeletonLoader.jsx mimicking DailyReflectionCard.jsx.
	Framer Motion: Skeletons can fade in.
o	Error State UI (if errorLoadingDashboard):
	Render ErrorDisplay.jsx component (from Section 11.2.D) with appropriate icon, title, message (errorLoadingDashboard), and retry function.
	Framer Motion: Error message can fade/scale in.
o	1. Header Area (Top of content area / Top of Main Column on Desktop):
	Welcome Message & Date: div with mb-lg.
	Welcome: h1 or h2 with .text-h1 or .text-h2: "Hello, {dashboardData.username}!".
	Date: p with .text-body-standard text-secondary-text-medium: "{dashboardData.currentDateString}".
o	2. Verification Queue Alert (Conditional - components/Dashboard/VerificationAlert.jsx):
	Render Condition: If dashboardData.verificationAlerts && dashboardData.verificationAlerts.count > 0.
	Styling: Distinct Card.jsx or banner: bg-verification-blue text-card-modal-background p-md rounded-lg mb-lg flex items-center justify-between.
	Content: Left (Lucide BellRing icon, text: "You have {count} tasks from {partnerName} to verify."). Right (Button.jsx variant="secondary" styled for banner, text: "Go to Verifications", onClick navigates to /activity?filter=verifications).
	Framer Motion: Slide/fade in.
o	3. "Systems for Today/This Week" Section:
	Header: h3 with .text-h3: "Today's Focus". mb-md.
	Systems List Container:
	Empty State (if no systems): Render EmptyState.jsx (icon: ClipboardList, message: "All clear for now!", subtext: "No systems scheduled...", ctaButton to /goals).
	Else: div with flex flex-col gap-md. Map dashboardData.systemsForToday to SystemCard.jsx.
	System Card Component (components/Dashboard/SystemCard.jsx):
	Base: Card.jsx. Props: systemData.
	Content: Top Row (Left: Description, Goal; Right: StatusTag.jsx), Middle Row (Scheduled Time/Logged Value), Bottom Row (Action Button).
	StatusTag.jsx: Small tag styled based on systemData.status (todo: bg-secondary-beige-light; completed: bg-success-green; etc.).
	Action Buttons: "Log Progress" (navigates to /checkin/[systemId]), "Verify Task" (navigates to /verify/[systemId]...), "View Entry" (navigates to /checkin/[systemId]?view=true).
	Framer Motion: layout prop for list items.
o	4. Daily Reflection Section (components/Dashboard/DailyReflectionCard.jsx):
	Base: Card.jsx. Styling: mt-xl. Desktop: in sidebar.
	Content: Centered text, optional icon (Lucide BookOpen).
	If pending: h4 "How was your day, {username}?", p "Take a moment...", Button to /reflect/today.
	If completed: h4 "Today's Reflection Logged!", p "Great job...", Button to /reflect/today?view=true.
	Framer Motion: Card entrance animation.
o	5. Access to Goal/System Management & Profile/Settings (Mobile/Tablet Contextual):
	Render Condition: On Mobile/Tablet, if MobileTabLayout lacks persistent header for these.
	Location: Top of Dashboard content, before "Welcome".
	Layout: flex justify-end items-center gap-sm mb-md.
	Icons: Button variant="icon" for Goals (Lucide ListChecks to /goals), Button variant="icon" for Profile (Lucide UserCircle to /profile).
•	Core Guideline for AI (Dashboard): Implement pages/dashboard.jsx. Populate all data from dashboardData state. Use defined components. Handle loading, error, and empty states for systems list. Ensure navigation from action buttons is correct.
________________________________________
10.3. System Check-in / Interaction View
(Page files: pages/checkin/[systemId].jsx and pages/verify/[systemId].jsx)
•	AI Implementation Note: This view serves multiple purposes and its mode will be determined by the route and query parameters.
o	/checkin/[systemId]: User is logging their own check-in for systemId.
	?view=true: User is viewing their own previously logged check-in (read-only).
o	/verify/[systemId]?partnerCheckinId=[partnerCheckinIdValue]: User is viewing/verifying a partner's check-in for systemId. The partnerCheckinIdValue refers to the specific check-in record made by the partner.
•	Purpose:
o	For Task Owner (/checkin/[systemId]): To log status (completed, skipped), metric value (if applicable), notes, and optionally a photo for a specific system.
o	For Task Owner (/checkin/[systemId]?view=true): To view their own past check-in details.
o	For Partner (/verify/[systemId]): To review the task owner's submitted check-in details and either verify its completion or query it (ask for more information/clarification).
•	Access:
o	Owner (Logging/Viewing Own):
	From Dashboard's "Log Progress" button on a SystemCard.jsx.
	From Dashboard's "View Entry" button on a SystemCard.jsx.
o	Verifier (Verifying Partner's):
	From Dashboard's "Verify Task" button on a SystemCard.jsx (if the system is awaiting their verification).
	From Notification/Activity links related to a partner's submission requiring verification.
•	Client-Side State (useState, useEffect):
o	mode: string - Set based on route and query params. Values: 'logOwn', 'viewOwn', 'verifyPartner', 'viewPartnerCompleted' (if partner already verified/queried this specific check-in).
o	systemId: string (from route).
o	partnerCheckinId?: string (from query params, if in verify mode).
o	isLoading: boolean (for initial data fetch).
o	systemDetails: object | null. Structure:
{
  systemId: string;
  description: string;
  linkedGoalTitle?: string;
  metricType: 'binary' | 'counter' | 'duration' | 'pages';
  targetValue?: string | number; // e.g., target pages, target minutes
  verificationRequired: boolean;
  lastCheckin?: { // Populated for 'viewOwn' mode if data exists
    status: 'completed' | 'skipped';
    metricValue?: string | number;
    notes?: string;
    photoUrl?: string;
    submittedAt: string; // ISO string
  };
}
o	checkinFormData (if mode === 'logOwn'): object. Structure:
{
  status: 'completed' | 'skipped' | ''; // '' is initial
  metricValue: string; // Kept as string for input, convert to number on submit
  notes: string;
  photoFile?: File;
  photoPreviewUrl?: string;
}
o	partnerCheckinDetails (if mode === 'verifyPartner' or 'viewPartnerCompleted'): object | null. Structure:
{
  partnerName?: string; // Name of the partner who made the check-in
  submittedAt: string; // ISO string timestamp
  statusLogged: 'completed' | 'skipped'; // Status logged by partner
  metricValueLogged?: string | number;
  notesLogged?: string;
  photoUrlLogged?: string;
  // Fields for verifier's action if mode is 'verifyPartner'
  verificationComment?: string;
}
o	error: string | null (for API errors or data fetching errors).
o	isSubmitting: boolean (for save/verify/query actions).
•	API Stubs (services/checkinService.js):
o	fetchSystemDetailsForCheckin(systemId): Returns system details including lastCheckin if relevant for viewOwn prefill.
o	fetchPartnerCheckinDetails(partnerCheckinId): Returns details of a partner's specific check-in, including partner's name.
o	submitCheckin(systemId, formData): Submits owner's check-in. Returns { success: true, newCheckinId: string, photoUrl?: string } or { success: false, error: "..." }.
o	submitVerification(partnerCheckinId, action: 'verify' | 'query', comments?: string): Submits partner's verification/query. Returns { success: true } or { success: false, error: "..." }.
•	Initial Data Fetch (useEffect based on mode, systemId, partnerCheckinId):
o	If mode === 'logOwn' or 'viewOwn': Call fetchSystemDetailsForCheckin(systemId). If 'viewOwn' and systemDetails.lastCheckin exists, this data is used for the read-only display.
o	If mode === 'verifyPartner' or 'viewPartnerCompleted': Call fetchSystemDetailsForCheckin(systemId) AND fetchPartnerCheckinDetails(partnerCheckinId).
o	Handle loading and error states.
•	Layout & Responsiveness:
o	Mobile (Full-screen page):
	Uses MobileTabLayout (so BottomTabBar is typically not visible or is overlaid).
	ScreenHeader.jsx at the top with dynamic title and Back button (onClick={router.back}).
	Content area scrolls vertically (Tailwind: overflow-y-auto).
	Action Buttons (Submit, Verify, etc.): Fixed at the bottom of the viewport.
	Tailwind for fixed bottom actions: fixed bottom-0 left-0 right-0 bg-card-modal-background p-md border-t border-disabled-text-border-light shadow-top-md z-20 flex gap-sm. (shadow-top-md would be a custom shadow for a subtle top shadow).
o	Tablet/Desktop (Modal overlay):
	Rendered within a Modal.jsx component (from Section 7E).
	Modal.jsx size prop can be 'md' (e.g., max-w-md) or 'lg' (e.g., max-w-lg).
	The modal will have its own header (with title and Close 'X' icon), scrollable body (DialogContent with max-h-[70vh] overflow-y-auto), and footer (DialogFooter) for action buttons.
o	Framer Motion:
	Modal entrance/exit animations as defined for Modal.jsx (Section 7E).
	If full-page on mobile, standard page transition from _app.jsx (Section 8).
•	UI Components & Interactions:
o	1. Modal/Page Header:
	Title (.text-h2 style): Dynamically set based on mode and fetched data:
	mode === 'logOwn' or 'viewOwn': "{systemDetails?.description || 'Log Check-in'}"
	mode === 'verifyPartner' or 'viewPartnerCompleted': "{partnerCheckinDetails?.partnerName}'s: {systemDetails?.description || 'Verify Check-in'}"
	Close/Back Button:
	Mobile (full-page): Lucide ArrowLeft in ScreenHeader.jsx.
	Tablet/Desktop (modal): Lucide X in Modal.jsx header.
o	2. System Context Display (Read-only, always visible at the top of form/view area):
	A div with Tailwind: p-sm bg-secondary-beige-light rounded-md mb-md text-sm.
	Content (check for systemDetails before accessing its properties):
	Line 1: <span className="font-medium text-secondary-text-medium">Goal:</span> <span className="text-primary-text-dark">{systemDetails?.linkedGoalTitle || 'N/A'}</span>
	Line 2: <span className="font-medium text-secondary-text-medium">Metric:</span> <span className="text-primary-text-dark">{systemDetails?.metricType} (Target: {systemDetails?.targetValue || 'N/A'})</span>
	Line 3: <span className="font-medium text-secondary-text-medium">Verification:</span> <span className="text-primary-text-dark">{systemDetails?.verificationRequired ? 'Required' : 'Not Required'}</span>
	Core Guideline for AI: Ensure this contextual information is clearly presented but visually distinct from interactive form elements. Use appropriate Tailwind classes for styling.
o	3. Check-in Form (Mode: 'logOwn')
	A form element (e.g., <form onSubmit={handleSubmitOwnCheckin} className="space-y-md">).
	Status Selection:
	Shadcn UI Base: ToggleGroup and ToggleGroupItem.
	Developer Note: Install npx shadcn@latest add toggle-group.
	Label: <Label className="mb-xs">Status</Label>
	<ToggleGroup type="single" value={checkinFormData.status} onValueChange={(value) => setCheckinFormData(prev => ({...prev, status: value}))} className="grid grid-cols-2 gap-sm">
	  <ToggleGroupItem value="completed" aria-label="Completed" className="data-[state=on]:bg-primary-accent data-[state=on]:text-card-modal-background hover:bg-primary-beige ui-state-off:bg-secondary-beige-light ui-state-off:text-primary-text-dark">Completed</ToggleGroupItem>
	  <ToggleGroupItem value="skipped" aria-label="Skipped" className="data-[state=on]:bg-primary-accent data-[state=on]:text-card-modal-background hover:bg-primary-beige ui-state-off:bg-secondary-beige-light ui-state-off:text-primary-text-dark">Skipped</ToggleGroupItem>
	</ToggleGroup>
	Metric Value Input (Conditional, Input.jsx from Section 7C):
	Render Condition: If checkinFormData.status === 'completed' AND systemDetails?.metricType is one of 'counter', 'duration', or 'pages'.
	Props: id="metricValue", type="number", label (dynamic: e.g., "Pages Completed", "Duration (minutes)"), value={checkinFormData.metricValue}, onChange={handleChange}, placeholder="Enter value".
	Client-side validation: Must be a positive number if status is 'completed'.
	Notes Input (TextArea.jsx from Section 7D):
	Props: id="notes", label="Notes (Optional)", placeholder="Any thoughts or details?", value={checkinFormData.notes}, onChange={handleChange}, rows={4}, maxLength={500}.
	Photo Upload (Optional, components/Forms/ImageUpload.jsx - as defined in Signup Screen Section 10.1.1):
	Label: "Add Photo (Optional)".
	Updates checkinFormData.photoFile and checkinFormData.photoPreviewUrl.
	Action Buttons (Modal Footer or fixed bottom on Mobile):
	Submit Button (Button.jsx from Section 7A):
	Text (dynamic): systemDetails?.verificationRequired ? "Submit for Verification" : "Save Progress".
	Props: type="submit", variant="primary", isLoading={isSubmitting}, className="w-full sm:w-auto".
	Cancel Button (Button.jsx):
	Text: "Cancel". Props: variant="outline", onClick={closeModalOrGoBack}, className="w-full sm:w-auto".
	Core Guideline for AI (Check-in Form): Build the form with conditional visibility for metric input. Handle client-side validation and state updates for checkinFormData. Submit button text is dynamic.
o	4. Submitted Details Display (Modes: 'viewOwn', 'verifyPartner', 'viewPartnerCompleted')
	A read-only display section. Tailwind: div className="space-y-md border-t border-disabled-text-border-light pt-md mt-md" (if form elements were above).
	Styling: Use .text-body-standard. Labels can be font-semibold or text-secondary-text-medium.
	Structure for each detail item: <div className="flex flex-col sm:flex-row sm:justify-between"><span className="font-medium text-secondary-text-medium">Label:</span><span className="text-primary-text-dark text-right sm:text-left">Value</span></div>
	Fields to Display (conditional on mode and data availability):
	Submitted By/On:
	  If 'verifyPartner' or 'viewPartnerCompleted': "Submitted by {partnerCheckinDetails?.partnerName} on {formatDate(partnerCheckinDetails?.submittedAt)} at {formatTime(partnerCheckinDetails?.submittedAt)}"
	  If 'viewOwn': "Logged on {formatDate(systemDetails?.lastCheckin?.submittedAt)} at {formatTime(systemDetails?.lastCheckin?.submittedAt)}"
	Status: "{statusToDisplay}" (from partnerCheckinDetails.statusLogged or systemDetails.lastCheckin.status).
	Metric Value: "{valueToDisplay}" (if applicable).
	Notes: "{notesToDisplay || 'No notes added'}".
	Photo: If photo URL exists (partnerCheckinDetails?.photoUrlLogged or systemDetails?.lastCheckin?.photoUrl):
	  Display using Next.js <Image />. Tailwind: max-w-full sm:max-w-xs rounded-md my-sm.
	Core Guideline for AI: Create a component or section for displaying these read-only check-in details. Populate from relevant state (partnerCheckinDetails or systemDetails.lastCheckin). Use date-fns or similar for formatting dates/times.
o	5. Verification Actions (Mode: 'verifyPartner')
	Displayed below the partner's submitted details. Tailwind: div className="mt-lg pt-lg border-t border-disabled-text-border-light".
	Optional: <Label htmlFor="verificationComment">Add a comment (optional):</Label> <TextArea.jsx id="verificationComment" value={partnerCheckinDetails.verificationComment} onChange={...} rows={2} placeholder="Optional feedback..." className="mb-md" />
	Verification Buttons Container (Tailwind: flex flex-col sm:flex-row gap-md):
	"Verify Completion" Button (Button.jsx):
	Text: "Verify & Approve".
	Props: variant="primary", className="bg-success-green hover:bg-success-green/90 flex-1", isLoading={isSubmitting && currentAction === 'verify'}, onClick={() => handleVerificationSubmit('verify')}.
	"Query/Needs More Info" Button (Button.jsx):
	Text: "Query / Needs More Info".
	Props: variant="outline", className="border-notification-orange text-notification-orange hover:bg-notification-orange/10 flex-1", isLoading={isSubmitting && currentAction === 'query'}, onClick={() => handleVerificationSubmit('query')}.
	Core Guideline for AI: These buttons are only visible in 'verifyPartner' mode. Clicking them calls the submitVerification API stub with the action and optional comments.
o	6. Loading State UI (Full view/modal - when isLoading is true for initial fetch):
	Centered Lucide Loader2 spinner (text-primary-accent w-10 h-10 animate-spin).
	OR, multiple SkeletonLoader.jsx components for different sections (System Context, Form Inputs / Submitted Details).
	Core Guideline for AI: Ensure a clear loading state covers the main content area while data is fetched.
o	7. Error State UI (Full view/modal - when error string is not null):
	Render ErrorDisplay.jsx component (from Section 11.2.D) with title "Could not load details," message from error state, and a retry function.
	Core Guideline for AI: Error display should be prominent if initial data load fails.
________________________________________
10.4. Partner View / Direct Messaging (pages/partner.jsx)
•	Purpose: Allows a user to see their accountability partner's current day's systems, their recent activity feed, and communicate with them via direct messages.
•	Access: From the "Partner" tab in the BottomTabBar (Mobile/Tablet) or TopNavBar (Desktop).
•	Client-Side State (useState, useEffect):
o	isLoading: boolean (for initial data fetch).
o	activeTab: string - Default 'partnerDay'. Values: 'partnerDay', 'partnerFeed', 'chat'.
o	partnerData: object | null. Structure:
{
  profile: {
    userId: string; // Partner's user ID
    username: string;
    profileImageUrl?: string;
    timezone: string; // Partner's timezone
    currentLocalTime: string; // Formatted string, e.g., "3:45 PM"
  };
  currentSystems: Array<{ // SystemCardDataForPartner - similar to SystemCardData
    systemId: string;
    description: string;
    status: 'todo' | 'completed' | 'skipped' | 'pendingPartnerVerification' | 'awaitingUserVerification' | 'queriedByPartner'; // Status from partner's perspective
    metricType: 'binary' | 'counter' | 'duration' | 'pages';
    goalTitle?: string;
    isAwaitingMyVerification?: boolean; // True if this system's check-in by partner needs current user's verification
    checkinIdToVerify?: string; // The ID of the partner's check-in that needs verification by current user
  }>;
  activityFeed: Array<{ // FeedItemData
    id: string; // ID of the check-in or reflection
    type: 'checkin' | 'reflection'; // Type of activity
    timestamp: string; // ISO string
    partnerUsername: string; // To display "PartnerName checked in..."
    content: { // Structure depends on type
      // For 'checkin'
      systemDescription?: string;
      statusLogged?: 'completed' | 'skipped';
      metricValueLogged?: string | number;
      notesLogged?: string;
      photoUrlLogged?: string;
      // For 'reflection'
      reflectionText?: string; // Or structured reflection if available
    };
    commentsCount: number; // For Post-MVP
    reactions: Array<{ emoji: string; count: number; byCurrentUser: boolean }>; // For Post-MVP
  }>;
  directMessages: Array<{ // MessageData
    id: string;
    senderId: string; // 'currentUser' or partner's userId
    text?: string;
    emojiOnly?: string; // If message is just an emoji
    timestamp: string; // ISO string
    reactions?: Array<{ emoji: string; count: number; byCurrentUser: boolean }>; // For Post-MVP
  }>;
}
o	newMessage: string (for chat input).
o	selectedEmojiForChat?: string (if an emoji picker is used for sending emoji-only messages).
o	isSendingMessage: boolean.
o	error: string | null (for API errors or data fetching errors).
•	API Stubs (services/partnerService.js):
o	fetchPartnerViewData(currentUserId, partnerIdFromContext): Fetches all data for the partner view.
o	sendDirectMessage(currentUserId, partnerId, messageText?, emoji?): Sends a message. Returns mock newly sent message.
o	addReactionToMessage(messageId, emoji, currentUserId): (Post-MVP) Adds/updates reaction to a message.
o	addReactionToFeedItem(feedItemId, emoji, currentUserId): (Post-MVP) Adds/updates reaction to a feed item.
•	Initial Data Fetch (useEffect):
o	Get current user's partner ID from AuthContext.
o	Call fetchPartnerViewData on mount. Handle loading and error states.
•	Layout & Responsiveness:
o	Uses the appropriate responsive layout (MobileTabLayout or DesktopTopNavLayout).
o	Content Area Padding: p-md (Mobile/Tablet), p-lg (Desktop).
o	Overall Structure: Partner View Header, then Tabs.jsx component, then TabContent.jsx for the active tab.
o	Mobile/Tablet: Full-page view.
o	Desktop MVP: Single main content area that switches with tabs.
•	UI Components & Interactions:
o	Loading State UI (if isLoading):
	Centered Lucide Loader2 spinner (w-10 h-10 text-primary-accent animate-spin).
	OR, shimmer placeholders (SkeletonLoader.jsx) for Header, Tabs, and typical Tab Content area.
o	Error State UI (if error):
	Render ErrorDisplay.jsx with title "Could not load Partner's information," message from error state, and retry function.
o	1. Partner View Header (Top of content area, below main app nav if any):
	Layout (Tailwind): flex flex-col sm:flex-row items-center gap-md pb-md border-b border-disabled-text-border-light mb-md.
	Partner Profile Picture (components/UI/ProfilePictureAvatar.jsx - Section 7, using Shadcn Avatar):
	Source: partnerData?.profile.profileImageUrl. Fallback to initials from partnerData?.profile.username.
	Size: w-12 h-12 md:w-16 md:h-16.
	Partner Info (div):
	Partner Username: h2 with .text-h2 (e.g., text-xl md:text-2xl font-semibold): "{partnerData?.profile.username}".
	Partner's Local Time: p with .text-body-small text-secondary-text-medium: "Local Time: {partnerData?.profile.currentLocalTime} ({partnerData?.profile.timezone})".
	(Desktop Only/Optional) CTA Button:
	<Button variant="outline" size="sm" onClick={() => router.push('/progress?compare=true')}>Compare Progress</Button>.
	Core Guideline for AI: Populate from partnerData. Time display is crucial context.
o	2. Tab Navigation (Tabs.jsx from Section 7F):
	<Tabs defaultValue="partnerDay" value={activeTab} onValueChange={setActiveTab} className="w-full">
	  <TabsList className="grid w-full grid-cols-3 mb-md"> {/* Or non-grid for auto-width */}
	    <TabItem value="partnerDay" label="Partner's Day" />
	    <TabItem value="partnerFeed" label="Activity Feed" />
	    <TabItem value="chat" label="Chat" />
	  </TabsList>
	  {/* TabContent sections below */}
	</Tabs>
	Core Guideline for AI: Implement tab switching logic to render content for the active tab.
o	3. Tab Content - "Partner's Day" (if activeTab === 'partnerDay'):
	<TabContent value="partnerDay">
	  Structure: Similar to user's Dashboard "Systems for Today", displaying partnerData?.currentSystems.
	  Use SystemCard.jsx (or a read-only variant PartnerSystemCard.jsx).
	  Each card shows partner's system and its status from their perspective.
	  Special Interaction: If a system card has isAwaitingMyVerification === true:
	    Card styling: border-2 border-verification-blue.
	    Action button: <Button variant="secondary" size="sm" className="border-verification-blue text-verification-blue hover:bg-verification-blue/10" onClick={() => router.push(`/verify/${systemData.systemId}?partnerCheckinId=${systemData.checkinIdToVerify}`)}>Verify Partner's Check-in</Button>.
	  Other system cards: For MVP, can be non-interactive beyond display. Post-MVP: click to view details.
	  Empty State: If partnerData?.currentSystems is empty or null:
	    <EmptyState.jsx message={`Looks like ${partnerData?.profile.username || 'your partner'} has nothing scheduled for their current day/week, or they haven't set up systems yet.`} />
	</TabContent>
	Core Guideline for AI: Re-use or adapt SystemCard.js. Implement verification CTA.
o	4. Tab Content - "Activity Feed" (if activeTab === 'partnerFeed'):
	<TabContent value="partnerFeed" className="space-y-md">
	  A scrollable list of FeedItemCard.jsx components, from partnerData?.activityFeed.
	  Feed Item Card Component (components/PartnerView/FeedItemCard.jsx):
	    Base: Card.jsx. Props: feedItemData.
	    Content: Displays partner's check-in/reflection details (systemDescription, statusLogged, metricValueLogged, notesLogged, photoUrlLogged, reflectionText). Timestamp: "Partner {action_verb} {relativeTime}".
	    Interaction Bar (Post-MVP for full reactions/comments): For MVP, can be omitted or show simple counts.
	  Empty State: If partnerData?.activityFeed is empty:
	    <EmptyState.jsx message={`${partnerData?.profile.username || 'Your partner'} hasn't logged any activity recently.`} />
	</TabContent>
	Core Guideline for AI: Implement FeedItemCard.jsx with mock display. Reaction/comment interactions are Post-MVP.
o	5. Tab Content - "Chat" (if activeTab === 'chat' - components/Chat/ChatInterface.jsx):
	<TabContent value="chat" className="flex flex-col h-[calc(100vh-var(--header-height)-var(--tabs-height)-var(--input-height))]"> {/* Adjust height calculation based on actual surrounding elements */}
	  Message Display Area (div with flex-grow overflow-y-auto p-md space-y-sm):
	    Scroll to bottom on new messages (useRef, useEffect).
	    Map partnerData?.directMessages to MessageBubble.jsx.
	  Message Bubble Component (components/Chat/MessageBubble.jsx):
	    Props: messageData, isOwnMessage (messageData.senderId === currentUser.id).
	    Styling: Own: self-end bg-secondary-accent-darker text-card-modal-background. Partner: self-start bg-secondary-beige-light text-primary-text-dark. Rounded corners as specified. EmojiOnly: larger text, minimal padding.
	    Content: messageData.text or messageData.emojiOnly. Timestamp below/beside.
	    Framer Motion: Entrance animation for new messages.
	  Message Input Area (div with flex items-center gap-xs p-sm border-t bg-card-modal-background):
	    Optional Emoji Picker Button (Button variant="icon" with Lucide Smile).
	    Text Input (Input.jsx variant for chat): placeholder="Type a message...", value={newMessage}, onChange, onKeyPress (Enter sends). className="flex-grow".
	    Send Button (Button.jsx variant="primary" or "icon" with Lucide Send): disabled if no message or sending. onClick={handleSendMessage}.
	  Empty State (if no messages): Centered text: "No messages yet. Say hello to {partnerData?.profile.username}!"
	</TabContent>
	Core Guideline for AI: Implement ChatInterface.jsx and MessageBubble.jsx. Handle message input and display. Stub sendDirectMessage.
•	Core Guideline for AI (Partner View): Implement the overall structure with tabbed navigation. Populate data from partnerData. Ensure correct interactions for verification and chat.
________________________________________
10.5. Progress/Stats View (pages/progress.jsx)
•	Purpose: Allows users to visually analyze their historical check-in data, identify trends, and optionally compare with their partner.
•	Access: From "Progress" tab in BottomTabBar/TopNavBar or CTAs.
•	Client-Side State (useState, useEffect):
o	isLoading: boolean.
o	selectedDateRange: object { preset: 'last7d' | ..., customStart?: string, customEnd?: string, label: string }. Default: 'last7d'.
o	compareWithPartner: boolean (default false).
o	selectedSystemForDetail: string | null.
o	progressData: object | null. Structure:
{
  personalStats: {
    overallConsistency?: number;
    consistencyOverTime?: Array<{ date: string; value: number }>; // {date: "YYYY-MM-DD", value: 0-100}
    streaks?: { currentOverall: number; longestOverall: number; mostConsistentDay: string };
    metricAccumulation?: Array<{ metricName: string; totalValue: number; unit: string }>;
    systemSpecific?: { [systemId: string]: { consistency: number, streak: number, totalValue: number } };
  };
  partnerStats?: { /* similar structure to personalStats */ } | null;
  userSystemsList?: Array<{ id: string; description: string }>; // For system filter
  partnerProfile?: { username: string }; // For labeling comparison data
}
o	error: string | null.
•	API Stubs (services/progressService.js):
o	fetchProgressData(userId, partnerId?, dateRange, compareEnabled, systemFilterId?): Returns progressData. Mock data needs to be comprehensive.
•	Initial Data Fetch & Refetch: Call fetchProgressData on mount and when filters change.
•	Layout & Responsiveness:
o	Uses appropriate responsive layout. Content Area Padding: p-md (Mobile/Tablet), p-lg (Desktop).
o	Overall Structure: View Header (Title, Filters), Main Content Area (Grid of Stat/Chart Cards).
o	Mobile: Single column, filters top, cards stacked. Charts simplified.
o	Tablet: Wider single column or 2-col grid for stats.
o	Desktop: 2 or 3-column grid for dashboard feel.
•	UI Components & Interactions:
o	Loading State UI (if isLoading): Multiple SkeletonLoader.jsx for chart/stat cards.
o	Error State UI (if error): ErrorDisplay.jsx "Could not load Progress Insights".
o	Empty State UI (if no data for filters): EmptyState.jsx "No check-in data found...".
o	1. View Header (Top of content area):
	Title: h1 with .text-h1: "Your Progress Insights".
	Controls Bar (Tailwind: flex flex-wrap items-center gap-md mb-lg):
	  Date Range Filter (Shadcn Select or ToggleGroup for presets: "Last 7 Days", "Last 30 Days", "This Month", "Last Month"). Updates selectedDateRange.
	  Partner Comparison Toggle (Shadcn Switch or Checkbox with Label: "Compare with {progressData?.partnerProfile?.username}"). Visible if partner exists. Updates compareWithPartner.
	  (Optional Post-MVP) System Select Dropdown (Shadcn Select, populated from progressData?.userSystemsList). Updates selectedSystemForDetail.
	Core Guideline for AI: Implement filter controls. Date Range Picker is a select/toggle group for MVP.
o	2. Main Content Area (Grid or Flex Column of Stat/Chart Cards - Tailwind: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md):
	Each section is a Card.jsx with CardHeader (CardTitle .text-h3).
	Section: Overall Consistency
	  CardTitle: "Overall Consistency"
	  Content (Personal): Large Stat Display <p><span className="text-5xl font-bold text-primary-accent">{progressData?.personalStats?.overallConsistency || 0}%</span><br/>Overall Consistency ({selectedDateRange.label})</p>.
	  Content (Comparison): Two such displays side-by-side/stacked, labeled "You" and Partner's Name.
	  Line Chart (components/Charts/LineChart.jsx - Wrapper for Recharts/Chart.js):
	    CardTitle (if separate): "Consistency Over Time"
	    Data: progressData.personalStats.consistencyOverTime (and partnerStats if comparing).
	    Axes: X=Time, Y=Consistency %. Lines: User (primary-accent), Partner (secondary-accent-darker). Legend. Tooltips. Responsive.
	Section: Activity Streaks & Patterns
	  CardTitle: "Activity Streaks"
	  Content (Personal, flex row/small grid): "Current Overall Streak: {val} days", "Longest Overall Streak: {val} days", "Most Consistent Day: {val}".
	  Content (Comparison): Side-by-side/stacked for user and partner.
	  (Optional) Calendar Heatmap (Post-MVP).
	Section: Metric Accumulation (for quantifiable systems)
	  CardTitle: "Total Metrics Logged ({selectedDateRange.label})"
	  Bar Chart (components/Charts/BarChart.jsx - Wrapper for Recharts/Chart.js):
	    Data: progressData.personalStats.metricAccumulation (and partnerStats).
	    Axes: X=Metric Name/System, Y=Total Value. Bars: User (primary-accent), Partner (secondary-accent-darker). Grouped for comparison.
•	Core Guideline for AI (Progress/Stats): Implement layout with filter controls. Stat displays should be clear. Chart components (LineChart.jsx, BarChart.jsx) will be wrappers around a chosen library (e.g., Recharts), accepting data and configuration props. Ensure responsiveness and handling of single vs. comparison views.
________________________________________
10.6. Goal & System Management View
(Page Structure using Next.js Dynamic Routing):
•	pages/goals/index.jsx: Lists all user goals. (Can act as the main view with a two-pane layout on desktop).
•	pages/goals/new.jsx: Form to create a new goal.
•	pages/goals/[goalId]/index.jsx: (Conceptually, its content is shown in the right pane of pages/goals/index.jsx on desktop when a goal is selected, or as a full page on mobile/tablet). Displays details of a specific goal and lists its systems.
•	pages/goals/[goalId]/edit.jsx: Form to edit a specific goal.
•	pages/goals/[goalId]/systems/new.jsx: Form to add a new system to a specific goal.
•	pages/goals/[goalId]/systems/[systemId]/edit.jsx: Form to edit a specific system.

•	Purpose: Allows users to define, view, edit, and delete their goals and the associated systems. Includes AI assistance for initial planning.
•	Access: "Goals" link in TopNavBar (Desktop), or CTA from Dashboard (Mobile/Tablet).
•	General Layout Considerations:
o	Mobile/Tablet: Each route is a full-screen view using MobileTabLayout and ScreenHeader.jsx.
o	Desktop (DesktopTopNavLayout):
	pages/goals/index.jsx: Implements a two-pane layout.
	  Left Pane (e.g., lg:w-1/3 border-r border-disabled-text-border-light overflow-y-auto max-h-[calc(100vh-var(--top-nav-height))]): Scrollable list of GoalCard.jsx. "Add New Goal" button at the top.
	  Right Pane (e.g., lg:w-2/3 overflow-y-auto max-h-[calc(100vh-var(--top-nav-height))] p-lg): Displays content based on selection or route:
	    If no goal selected: EmptyState.jsx "Select a goal..." or content of pages/goals/new.jsx if `router.asPath === '/goals/new'`.
	    If a goal is selected (`selectedGoalId` is set): Content of pages/goals/[goalId]/index.jsx.
	    If route is for editing/creating goals/systems (e.g., /goals/new, /goals/[id]/edit, /goals/[id]/systems/new, etc.): The respective form component is rendered here.
•	Client-Side State (Examples for pages/goals/index.jsx - the main orchestrator):
o	isLoadingGoals: boolean.
o	goalsList: Array<{ goalId: string; title: string; descriptionSnippet: string; systemCount: number; currentConsistencyPlaceholder?: number; }>
o	selectedGoalId: string | null. (Determines what's shown in the right pane on desktop).
o	goalDetails: object | null (Data for the selected goal, including its systems, for the right pane).
o	isLoadingGoalDetails: boolean.
o	error: string | null.
o	(States for forms like `isSubmittingGoal`, `isFetchingAISuggestions` would be managed within their respective form components or hoisted if forms are part of this main page).
•	API Stubs (services/goalService.js, services/systemService.js, services/aiPlannerService.js):
o	fetchGoals(userId): Returns list of goals.
o	fetchGoalDetails(goalId): Returns goal details + systems list.
o	createGoal(goalDataWithAIInput?): Returns new goal.
o	updateGoal(goalId, goalData): Returns updated goal.
o	deleteGoal(goalId): Returns success/failure.
o	createSystem(goalId, systemData): Returns new system.
o	updateSystem(systemId, systemData): Returns updated system.
o	deleteSystem(systemId): Returns success/failure.
o	getAIPlanSuggestions(userInputForAI): Returns { refined_goal_suggestions: Array, suggested_systems: Array }.
•	UI Components & Interactions:

o	1. Goal List View (pages/goals/index.jsx - Left Pane on Desktop, Full Page on Mobile initial view):
	Header:
	  Mobile/Tablet: ScreenHeader.jsx title="Your Goals", actionSlot={<Button variant="ghost" size="icon" onClick={() => router.push('/goals/new')}><Plus className="h-5 w-5"/></Button>}.
	  Desktop (Left Pane): div className="p-md border-b"><h1 className="text-xl font-semibold">Your Goals</h1></div>.
	"Add New Goal" Button (Button.jsx - Desktop Left Pane, below header):
	  variant="primary", onClick={() => router.push('/goals/new')}, iconLeft={<Plus className="h-4 w-4"/>}. Text: "Add New Goal". className="w-full my-sm".
	Goal Card List Area (Tailwind: space-y-sm p-md overflow-y-auto):
	  If isLoadingGoals: 2-3 SkeletonLoader.jsx mimicking GoalCard.jsx.
	  If goalsList empty: EmptyState.jsx (icon: Target, title: "No goals yet.", message: "What's your next big achievement?", ctaButton to /goals/new).
	  Map goalsList to GoalCard.jsx.
	Goal Card Component (components/Goals/GoalCard.jsx):
	  Base: Card.jsx. Props: goalData, isSelected (boolean).
	  Styling: Standard Card.jsx. If isSelected: ring-2 ring-primary-accent bg-secondary-beige-light. cursor-pointer.
	  Content: CardHeader with CardTitle (.text-lg font-medium): {goalData.title}. CardContent: p.text-xs.text-secondary-text-medium (descriptionSnippet), p.text-xs.mt-1 ("{systemCount} Systems | Cons: {consistency}%").
	  Desktop Hover Actions (appear on hover over card): div with Edit (Lucide Edit3) & Delete (Lucide Trash2, text-error-red) IconButtons. Delete requires confirmation (Modal.jsx).
	  Interaction: onClick={() => handleSelectGoal(goalData.goalId)} (updates selectedGoalId, pushes route on mobile/tablet to /goals/[goalId]).
	  Framer Motion: layout prop, AnimatePresence for list changes.

o	2. Goal Detail / System List View (Content for Right Pane on Desktop when goal selected, or full page at pages/goals/[goalId]/index.jsx on Mobile/Tablet):
	Data Fetch: fetchGoalDetails(selectedGoalId || router.query.goalId).
	Header:
	  Mobile/Tablet: ScreenHeader.jsx title={goalDetails?.title}, actionSlot with Edit IconButton.
	  Desktop (Right Pane): div className="flex justify-between items-center mb-md". h2.text-2xl.font-semibold: {goalDetails?.title}. Button variant="outline" size="sm" iconLeft={<Edit3/>} onClick to /goals/[id]/edit.
	Goal Description: p.text-body-standard.my-md: {goalDetails?.description}.
	"Associated Systems" Sub-header: h3.text-xl.font-semibold.mt-lg.mb-md.
	"Add System" Button (Button.jsx): variant="secondary", onClick to /goals/[id]/systems/new. Icon: Plus. Text: "Add System".
	System Card List Area (Tailwind: space-y-md):
	  If isLoadingGoalDetails: Skeletons for systems.
	  If goalDetails?.systems empty: EmptyState.jsx "No systems for this goal." CTA to add system.
	  Map goalDetails?.systems to SystemCardListItem.jsx.
	SystemCardListItem.jsx (components/Systems/SystemCardListItem.jsx - variant of Dashboard's SystemCard):
	  Displays: description, frequency, metricType, targetValue, verificationRequired. Edit/Delete IconButtons.
	  Edit navigates to /goals/[goalId]/systems/[systemId]/edit. Delete needs confirmation.

o	3. Add/Edit Goal Form (components/Goals/GoalForm.jsx - rendered in Right Pane or as full page for /new, /[id]/edit routes):
	Props: initialData? (for editing), onSubmitFunction, isSubmitting, isFetchingAISuggestions.
	Layout: Full page form or large modal. Header: "Create New Goal" or "Edit Goal: {initialData?.title}".
	AI Assistance Section (Prominent for new goals):
	  TextArea.jsx for "Main Goal Statement (for AI)".
	  TextArea.jsx for "Potential Obstacles (for AI)".
	  Input.jsx for "Time Commitment (for AI)".
	  Button.jsx "Get AI Suggestions" isLoading={isFetchingAISuggestions}.
	  Loading state for AI: "AI is crafting your plan..." + Spinner.
	  Display for AI Suggestions (if data exists):
	    Refined Goal Suggestion: Text, "Use this suggestion" button (pre-fills fields below).
	    Suggested Systems List: Each item with description, freq, metric. "Use & Edit" button (pre-fills system form or adds to temp list), "Dismiss" button.
	Manual Goal Fields:
	  Input.jsx label="Goal Title", required.
	  TextArea.jsx label="Goal Description (Optional)".
	Save/Update Button (Button.jsx variant="primary"): Text dynamic. isLoading={isSubmitting}.
	Core Guideline for AI (Goal Form): Implement GoalForm.jsx. AI suggestion UI is key: input context, trigger AI call (stubbed getAIPlanSuggestions), display structured response, allow selection/editing.

o	4. Add/Edit System Form (components/Systems/SystemForm.jsx - rendered in Right Pane or as full page):
	Props: initialData? (for editing), goalTitle (for header), onSubmitFunction, isSubmittingSystem.
	Header: "Add System to {goalTitle}" or "Edit System".
	Form Fields:
	  Input.jsx label="System Description", required.
	  Read-only display of Linked Goal.
	  Shadcn Select label="Frequency", options: "Daily", "Weekly", required.
	  Shadcn Select label="Metric Type", options: "Binary", "Counter", "Duration", "Pages", required.
	  Input.jsx label="Target Value" (Conditional, type="number") if Metric Type not "Binary".
	  Input.jsx label="Unit" (Conditional, if target value present).
	  Input.jsx label="Target Time (Optional, HH:MM AM/PM)" (simple text for MVP).
	  Shadcn Switch/Checkbox label="Partner Verification Required?".
	Save/Update System Button (Button.jsx variant="primary").
	Core Guideline for AI (System Form): Implement SystemForm.jsx. Conditional logic for Target Value.

•	Error/Loading States: Standardized (skeletons, spinners, Sonner toasts). Inline form validation.
•	Core Guideline for AI (Goal/System Management): Implement pages and shared forms. Use Next.js dynamic routing. CRUD ops interact with stubs. AI Planner integration in Goal Form is crucial.
________________________________________
10.7. Notification Area / Activity Screen
(Page file for Mobile/Tablet: pages/activity.jsx)
(Component for Desktop Dropdown: components/Navigation/NotificationDropdownPanel.jsx)
•	Purpose: Centralized, chronological feed of notifications (partner activities, system alerts (Post-MVP), verification requests, messages, reactions).
•	Access: "Activity" tab (Lucide Bell) in BottomTabBar (Mobile/Tablet). NotificationBell.jsx in TopNavBar (Desktop) opens NotificationDropdownPanel.jsx.
•	Client-Side State (for /activity page or NotificationDropdownPanel.jsx):
o	isLoadingNotifications: boolean.
o	notificationsList: Array<NotificationItemData>. Structure:
{ id: string; type: string; text: string; timestamp: string; read: boolean; linkTo?: string; actorName?: string; actorProfileImageUrl?: string; systemOrGoalName?: string; }
o	error: string | null.
o	pagination: { currentPage: 1, hasMore: true, itemsPerPage: 20 }.
•	API Stubs (services/notificationService.js):
o	fetchNotifications(userId, page, limit): Returns { notifications: Array, hasMore: boolean }. Mock diverse types.
o	markNotificationAsRead(notificationId): Returns { success: true }.
o	markAllNotificationsAsRead(userId): Returns { success: true, markedCount: number }.
•	Initial Data Fetch & Pagination: useEffect calls fetchNotifications. "Load More" button fetches next page.
•	Layout & Responsiveness:
o	/activity Page (Mobile/Tablet - MobileTabLayout):
	ScreenHeader.jsx: title="Activity & Notifications", showBackButton={false}. actionSlot: Button "Mark All As Read" (variant="text", size="sm", color="primary-accent", disabled if no unread).
	Content: Scrollable list of NotificationItem.jsx. "Load More" button.
o	NotificationDropdownPanel.jsx (Desktop - Shadcn PopoverContent):
	Styling: Card-like. w-[360px] or w-96, max-h-[400px] or max-h-96, overflow-y-auto, p-0, z-50.
	Header (div p-sm border-b flex justify-between items-center): h4.text-base.font-semibold "Notifications". Button "Mark All As Read" (variant="text", size="xs").
	Content: Scrollable list of NotificationItem.jsx.
	Footer (Optional, div p-sm border-t text-center): NextLink to /activity "View All Activity".
•	UI Components & Interactions:
o	"Mark All As Read" Button: Calls markAllNotificationsAsRead stub. Optimistically updates local list `read` status and unread count badge.
o	Notification List Container:
	If isLoadingNotifications (initial): 2-3 SkeletonLoader.jsx mimicking NotificationItem.
	If empty: EmptyState.jsx (icon: BellOff, message: "No new notifications.", subtext: "Recent activity...").
	Else: Map notificationsList to NotificationItem.jsx. Layout: flex flex-col.
o	Notification Item Component (components/Notifications/NotificationItem.jsx):
	Structure (motion.div with layout prop, Tailwind: flex items-start gap-sm p-sm cursor-pointer border-b last:border-b-0).
	Props: notificationData.
	Styling: transition-colors. Unread: bg-secondary-beige-light (optional left border: border-l-4 border-primary-accent). Hover: hover:bg-primary-beige.
	Left Column (Icon/Avatar): If actorProfileImageUrl: Shadcn Avatar (w-8 h-8 or w-10 h-10). Else: Lucide icon based on type (MessageSquare, UserCheck, Zap), color text-primary-accent.
	Center Column (Text Content - flex-grow):
	  Main Text (.text-body-standard, break-words): <strong>{actorName}</strong> {text}. If systemOrGoalName: "... on '<strong>{systemOrGoalName}</strong>'."
	  Timestamp (.text-body-small text-secondary-text-medium mt-0.5): Relative time (date-fns formatDistanceToNow).
	Right Column (Unread Dot - Optional): If !read: div w-2 h-2 bg-primary-accent rounded-full.
	Interaction (onClick):
	  If !read: Call markNotificationAsRead stub. Optimistically update local read state.
	  If linkTo: router.push(linkTo).
	  If in DropdownPanel, close dropdown.
	Framer Motion: layout prop, whileHover.
o	"Load More" Button (Button.jsx variant="ghost" className="w-full"):
	Render if !isLoadingNotifications && pagination.hasMore. Text: "Load More Notifications".
	onClick: Increments page, calls fetchNotifications, appends results.
o	Error State UI (fetchNotifications fails): Initial: ErrorDisplay.jsx. Load More: Sonner toast "Failed to load more."
•	Core Guideline for AI (Notifications): Implement /activity page and NotificationDropdownPanel.jsx. Create NotificationItem.jsx. Handle read states, navigation, "Mark All As Read", "Load More". Manage loading/empty/error states.
________________________________________
(Sections 11, 12, 13, 14 would follow here, as previously detailed in our generation of the full document. For brevity in this specific PRD generation step, I'm assuming their content is as we last refined it, focusing on the principles of Error Handling, Accessibility, Performance, and overall Frontend Architecture with Next.js, Tailwind, Shadcn, and Framer Motion.)

Example for Section 11.2.B (Toast/Snackbar) to reflect Sonner:
________________________________________
11.2. Types of Error Presentation & UI Implementation
...
•	B. Toast/Snackbar Notifications (Non-blocking feedback for success, info, warnings, non-critical errors)
o	Library: Sonner (by Emil Kowalski).
	Developer Note: Install via npx shadcn@latest add sonner. Add <Toaster /> component (from sonner) to the root layout (_app.jsx or main layout component).
o	Use Cases:
	Success messages: toast.success("Check-in saved!"), toast.success("Profile updated!").
	Non-critical errors or warnings: toast.error("Could not load partner's avatar..."), toast.warning("Action has minor side effect...").
	Informational messages: toast.info("You are now offline...").
o	UI Customization (Sonner's <Toaster /> props and toast() function options):
	Position: Typically top-right or bottom-center (configurable with Sonner <Toaster richColors position="top-right" />).
	Styling (Sonner provides good defaults, can be customized with CSS if needed, but rely on richColors prop for type-specific styling):
	  Use richColors prop on <Toaster /> for default success, error, warning, info styles.
	  If further customization is needed, Sonner allows custom styling via its `toastOptions` or global CSS overrides. Adhere to DuoTrak palette if customizing.
	Content: Short message. Optional action button or dismiss button within the toast via Sonner's API.
	Dismissal: Automatically dismiss after a time (Sonner default is 4s), or until manually dismissed.
o	Animation: Sonner handles its own entrance/exit animations smoothly.
o	Accessibility: Sonner is designed with accessibility in mind (ARIA attributes).
o	Implementation Detail: Use the toast() function (e.g., toast.success('Message')) imported from sonner from anywhere in the app.
...
________________________________________
Conclusion & Final AI Guidance (Reiteration from original document, adapted):
This document now provides an extremely detailed UI/UX blueprint specifically tailored for you, the AI, to generate the DuoTrak Next.js frontend using Tailwind CSS, customized Shadcn UI components, and Framer Motion. The "Core Guideline for AI" directives throughout this document are crucial: they define the boundaries of your task, focusing you on frontend generation and preventing attempts to implement backend logic or make assumptions beyond the design specification.
Key Takeaways for AI before starting code generation:
1.	Adhere to Globals: The Color Palette, Typography System, Spacing System, and Iconography (Sections 3-6) are global rules. All components must follow them strictly using the defined CSS variables (via Tailwind config) and font settings (next/font).
2.	Component-Based Architecture: Build small, reusable components first (Buttons, Inputs, Cards, etc., as per Section 7, using Shadcn as a base and customizing with Tailwind), then compose them into larger screen-specific components and pages (Section 10).
3.	State Management: Use AuthContext for global auth state. Use useState/useEffect for local component state and data fetching from stubbed service functions (Section 14.3).
4.	API Stubs: All backend interactions are to be implemented as JavaScript async functions in the services/ directory that return mock data and simulate success/error states (Section 14.4). Do not attempt to connect to a real backend.
5.	Responsiveness: Apply responsive design principles (Tailwind's responsive prefixes, Flexbox, Grid, Media Queries defined in Tailwind config) at all levels to ensure the app works seamlessly across mobile, tablet, and desktop breakpoints (Section 5).
6.	Optimistic UI: Implement optimistic UI updates for key user interactions to make the application feel "snappy" (Section 13.2.A).
7.	Animations: Use Framer Motion for all significant UI animations, transitions, and interactive feedback, aiming for a fluid and polished experience (Section 8).
8.	Error Handling & Empty States: Provide clear, user-friendly feedback for all error conditions and when no data is available, as specified for each screen/component (Section 11). Use Sonner for toasts.
9.	Accessibility: Build with accessibility in mind from the start (semantic HTML, keyboard navigation, focus states, ARIA basics, color contrast - Section 12).
11. Error Handling & Empty States UX (Global Principles & Application)
Core Guideline for AI (Error/Empty States): The following principles and components MUST be incorporated into the design and implementation of ALL screens and components generated for the DuoTrak frontend. They are not optional or secondary; they are fundamental to the user experience.
________________________________________
11.1. Philosophy for Error Handling & Empty States
•	Prevent Errors: Design intuitive interfaces with clear labels, contextual help (e.g., placeholders, helper text), and by disabling buttons or actions when they are not applicable or prerequisites are not met. This minimizes the chance of users encountering errors in the first place.
•	Inform Clearly: When errors do occur, communicate them in plain, user-friendly language. Explain what happened and, if possible, how to resolve it. Avoid technical jargon.
•	Maintain Context: Errors should not completely break the user's flow or cause them to lose their work if avoidable. For instance, form input should be preserved if a submission fails due to a specific field error.
•	Guide and Encourage (for Empty States): Empty states are opportunities, not dead ends. Use them to guide users towards valuable actions, educate them about features, and encourage engagement.
•	Consistent Presentation: Employ a consistent visual language (colors, typography, iconography from this design system) for errors and empty states across the application. This helps users quickly recognize and understand these states.
•	Graceful Degradation: If a non-critical part of the UI fails to load (e.g., an optional widget, an avatar image), the rest of the page or component should still function correctly.
________________________________________
11.2. Types of Error Presentation & UI Implementation
•	A. Inline Validation Errors (Forms)
o	Trigger: On blur from an input field, or on form submission attempt if fields are invalid.
o	UI Implementation:
	Message: Displayed directly below the problematic input field (e.g., Input.jsx, TextArea.jsx, Select.jsx).
	Styling: Use .text-body-small (e.g., Tailwind text-xs) and text-error-red. Add mt-xs (e.g., mt-1) for spacing.
	Icon (Optional): A small Lucide React AlertCircle icon (w-4 h-4 text-error-red) can be placed next to the error message or within the input field (if space allows and design dictates).
	Input Field Style: The border of the input field itself changes to border-error-red (as defined in Section 7C/7D for Input/TextArea components). Optionally, a subtle red inner shadow or background tint on the field itself can be added for more emphasis, but the border change is primary.
	Accessibility: Associate the error message with the input field using aria-describedby on the input, pointing to the ID of the error message paragraph. Set aria-invalid="true" on the input field when it's in an error state.
o	Interaction:
	Focus should be programmatically moved to the first invalid field on a form submission attempt.
	Microinteraction (Framer Motion): A gentle shake animation (as defined in Section 8 for Input Error Shake) can be applied to the input field if it contains an error upon form submission attempt.
o	Implementation Detail: The error message should be a prop passed to the input components (Input.jsx, TextArea.jsx, Select.jsx).
•	B. Toast/Snackbar Notifications (Non-blocking feedback for success, info, warnings, non-critical errors)
o	Shadcn UI Base Component: Toast and useToast hook from shadcn/ui.
	Developer Note: Install via npx shadcn-ui@latest add toast. Also, add Toaster component (from shadcn/ui) to the root layout (_app.jsx or main layout component).
o	Use Cases:
	Success messages: "Check-in saved!", "Profile updated!", "Invite sent!".
	Non-critical errors or warnings: "Could not load partner's avatar, using default.", "Failed to save minor setting, please try again."
	Informational messages: "You are now offline. Changes will sync later." (Post-MVP for offline mode), "Copied to clipboard!".
o	UI Customization (Tailwind CSS for Shadcn Toast variants):
	The Shadcn toast function allows specifying variants. We will define variants like success, error, warning, info.
	Position: Typically top-right or bottom-center of the viewport (configurable with Shadcn Toaster).
	Styling (per variant):
	Base Toast: Rounded corners (rounded-md), subtle shadow (shadow-lg), appropriate padding (p-md). Max width (e.g., max-w-sm).
	variant: "success": Background bg-success-green, text text-card-modal-background (White). Optional Lucide CheckCircle icon.
	variant: "error": Background bg-error-red, text text-card-modal-background. Optional Lucide XCircle icon.
	variant: "warning": Background bg-notification-orange, text text-card-modal-background (or text-primary-text-dark if contrast is better). Optional Lucide AlertTriangle icon.
	variant: "info": Background bg-secondary-accent-darker, text text-card-modal-background. Optional Lucide Info icon.
	Content: Icon (optional, relevant to type) + Short message. Optional "Dismiss" (Lucide X) button or action button within the toast.
	Dismissal: Automatically dismiss after a limited time (e.g., 3-5 seconds), or until manually dismissed by the user.
o	Animation (Framer Motion - Shadcn Toast often has built-in animations):
	Toasts should animate in and out smoothly (e.g., slide in from side/top/bottom and fade). Shadcn's Toast component usually handles this.
o	Accessibility: Shadcn Toast should handle role="alert" or role="status" appropriately so screen readers announce them.
o	Implementation Detail: Create a reusable Toast triggering mechanism (likely using the useToast hook from Shadcn) that can be called from anywhere in the app (e.g., after API stub calls).
•	C. Modal Dialogs for Critical Errors/Confirmations
o	Component: Modal.jsx (from Section 7E, based on Shadcn UI Dialog).
o	Use Cases:
	Confirming destructive actions: "Are you sure you want to delete this goal? This action cannot be undone."
	Displaying critical errors that block further interaction until acknowledged (rare, e.g., "Session expired, please log in again.").
o	UI Implementation:
	Use the standard Modal.jsx styling.
	Clear DialogTitle (e.g., "Action Required", "Error Occurred", "Confirm Deletion").
	Descriptive message in DialogDescription or modal body.
	Action buttons in DialogFooter:
	For confirmations: "Confirm Delete" (styled as Button variant="primary" className="bg-error-red hover:bg-error-red/90"), "Cancel" (Button variant="outline" or "secondary").
	For critical errors: "OK" or "Reload Page" (Button variant="primary").
o	Implementation Detail: Ensure button styling reflects the severity/nature of the action.
•	D. Full Page/Section Errors (Data Loading Failures)
o	Use Cases: When a primary data fetch for an entire screen or a significant section of a screen fails (e.g., Dashboard data, Partner data, Progress data, initial Notification list).
o	UI Implementation (components/Feedback/ErrorDisplay.jsx - a reusable component):
	This component should replace the content of the failed section/page.
	Layout (Tailwind): flex flex-col items-center justify-center text-center p-lg h-full min-h-[300px] gap-md.
	Icon: Large Lucide icon (e.g., WifiOff, ServerCrash, Frown, AlertTriangle). Size w-12 h-12 or w-16 h-16 (text-5xl or text-6xl). Color text-error-red or text-secondary-text-medium depending on severity.
	Title (.text-h2 style): "Oops! Something went wrong." or "Couldn't Load Data."
	Message (.text-body-standard): Plain language explanation (e.g., "We couldn't load your dashboard details. It might be a temporary issue with your connection or our servers.") Include the specific error message from the API stub/state if available and user-friendly.
	Action Button (Button.jsx): variant="primary", onClick={retryFunction} (prop to re-trigger the data fetch). Text: "Retry".
o	Animation (Framer Motion): The error display itself can fade/scale in: initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}.
o	Implementation Detail: Create a reusable ErrorDisplay.jsx component. Ensure it's used when API stubs return an error for primary data loads for screens/sections.
________________________________________
11.3. Empty States UX (Guiding and Informing)
•	Philosophy: Empty states are not errors but opportunities to guide, educate, and encourage users. Avoid dead ends.
•	Reusable Component (components/Feedback/EmptyState.jsx):
o	Props:
	icon?: ReactNode (A Lucide React icon).
	title: string.
	message: string (Explanatory and encouraging text).
	ctaButton?: ReactNode (Optional Button component for a primary action to resolve the empty state).
	className?: string.
o	Styling (Tailwind CSS):
	Layout: flex flex-col items-center justify-center text-center p-lg py-xl gap-md. (e.g., py-8 or py-12, gap-4).
	Icon: If provided, size e.g., w-12 h-12 or w-16 h-16. Color text-secondary-text-medium or text-primary-accent if related to a positive next step.
	Title: .text-h2 or .text-h3 style (e.g., text-xl font-semibold text-primary-text-dark). Clear and concise.
	Message: .text-body-standard text-secondary-text-medium.
	CTA Button: If provided, add mt-sm or mt-md for spacing.
o	Animation (Framer Motion): The empty state can fade/scale in: initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}.
•	Specific Empty States (as detailed in relevant screen sections - examples):
o	Dashboard (No systems for today - Section 10.2):
	Icon: Lucide ClipboardList. Title: "All clear for now!". Message: "No systems scheduled for today. Want to plan ahead?". CTA: <Button variant="primary" onClick={() => router.push('/goals')}>Manage Goals & Systems</Button>.
o	Goal List (No goals defined - Section 10.6):
	Icon: Lucide Target. Title: "No goals defined yet." Message: "What's your next big achievement?". CTA: <Button variant="primary" onClick={() => router.push('/goals/new')}>Add Your First Goal</Button>.
o	System List (No systems for a specific goal - Section 10.6):
	Icon: Lucide ListPlus. Title: "No Systems Here". Message: "No systems defined for this goal yet. Add actionable steps!". CTA: <Button variant="secondary" onClick={() => router.push(/goals/${goalId}/systems/new)}>Add System</Button>.
o	Partner View (Partner has no activity/systems - Section 10.4):
	Activity Feed Empty: Message: "[Partner's Name] hasn't logged any activity recently."
	Partner's Day Empty: Message: "Looks like [Partner's Name] has nothing scheduled..."
	Chat Empty: Message: "No messages yet. Say hello to [Partner's Name]!" (CTA could be pre-filling chat input or a "Wave" button).
o	Notification Area (No notifications - Section 10.7):
	Icon: Lucide BellOff. Message: "No new notifications." Subtext: "Recent activity from you and your partner will appear here."
o	Progress/Stats (No data for selected range - Section 10.5):
	Message: "No check-in data found for this period." Subtext: "Keep tracking your systems to see your progress here!" Optional simple line art of an empty chart.
•	Core Guideline for AI (Empty States): Implement the reusable EmptyState.jsx component. Use it consistently in all list/data display areas when the corresponding data array from an API stub is empty (and not in a loading or error state). Ensure the icon, title, message, and CTA are appropriate for the context as specified in each screen section.
12. Accessibility Considerations (WCAG AA Target - Frontend Implementation)
Core Guideline for AI (Accessibility): Accessibility is not an afterthought. It MUST be integrated into every component and page generated for the DuoTrak frontend from the very beginning. The target is to meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Use linting tools (e.g., ESLint with accessibility plugins like eslint-plugin-jsx-a11y) during development if possible within your generation process to catch common issues.
________________________________________
12.1. Semantic HTML
•	AI Implementation:
o	Use HTML5 elements according to their semantic meaning to provide inherent structure and meaning to assistive technologies.
o	Structure:
	<nav>: For main navigation blocks (e.g., TopNavBar.jsx, BottomTabBar.jsx).
	<main>: For the primary content of each page. There should be only one visible <main> element per page.
	<article>: For self-contained compositions like individual feed items or system cards if they make sense as standalone pieces of content.
	<aside>: For complementary content like a desktop sidebar if it's tangentially related to the main content.
	<section>: To group thematically related content within a page or article. Use with an appropriate heading.
	<header>: For introductory content of a page, section, or article (often containing headings, logos, navigation).
	<footer>: For footer content of a page, section, or article.
o	Interactive Elements:
	<button>: For elements that trigger an action within the current page (e.g., submit form, open modal, toggle state).
	<a>: For elements that navigate to a different URL (internal or external). Next.js <Link> component should wrap these for client-side routing.
o	Forms:
	<form>: To wrap form controls.
	<label>: Every form input (<input>, <textarea>, <select>) MUST have an associated <label>. Use the htmlFor attribute on the <label> linked to the id of the input. Shadcn UI components for forms typically handle this well.
	<fieldset> and <legend>: Use to group related form controls, especially radio buttons or checkboxes.
o	Headings:
	Use heading tags (<h1> through <h6>) to create a logical document outline.
	There should generally be one <h1> per page, representing the main title or purpose of the page.
	Do not skip heading levels (e.g., don't go from an <h2> to an <h4> without an <h3> in between in that section).
o	Avoid <div> or <span> for Interactive Elements: Do not use non-interactive elements like <div> or <span> with onClick handlers to simulate buttons or links. Use the correct semantic elements or apply appropriate ARIA roles if absolutely necessary (though semantic HTML is preferred).
________________________________________
12.2. Keyboard Navigation & Focus Management
•	AI Implementation:
o	Focusable Elements: All interactive elements (links, buttons, form fields, tabs, custom controls) MUST be focusable using the keyboard (typically via the Tab key for forward navigation and Shift+Tab for backward). Standard HTML interactive elements are focusable by default. Custom components built with divs (if any, though discouraged for interactivity) will need tabindex="0" to be included in the focus order.
o	Operable Elements: All interactive elements MUST be operable using the keyboard (typically Enter or Space key for activation of buttons, links, checkboxes, etc.).
o	Focus Indicators (Focus Visible):
	Ensure a clear and highly visible focus indicator is present for all focusable elements. This is critical for keyboard users.
	Tailwind CSS: Tailwind's default focus:ring utilities or focus-visible:ring utilities provide a good starting point. The DuoTrak primary accent color (primary-accent) should be used for the focus ring color to maintain brand consistency and ensure visibility against the beige theme.
	Example: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-beige (offset helps visibility against element background).
	Do NOT use outline: none; or ring-0 on focusable elements without providing an alternative, equally visible custom focus style.
o	Logical Focus Order: The order in which elements receive focus via keyboard navigation MUST be logical and intuitive, generally following the visual reading order of the page (left-to-right, top-to-bottom in LTR languages). This is usually achieved by having a sensible DOM order.
o	Modal/Dropdown Focus Trapping:
	When a modal dialog (Modal.jsx based on Shadcn Dialog) or a dropdown panel (NotificationDropdownPanel.jsx, ProfileDropdownMenu.jsx based on Shadcn Popover or DropdownMenu) is open, keyboard focus MUST be trapped within that modal/dropdown. Users should not be able to tab to elements outside the open modal/dropdown.
	When the modal/dropdown is closed, focus MUST return to the element that originally triggered its opening.
	Shadcn UI Primitives (Radix UI) typically handle focus trapping and return very well. Ensure this behavior is preserved during customization.
o	Skip Links (Post-MVP but good practice):
	For pages with extensive navigation before the main content (like the DesktopTopNavLayout), a "Skip to main content" link should be the first focusable element on the page. This link is typically visually hidden until it receives focus.
	Tailwind: sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-card-modal-background focus:text-primary-accent focus:rounded-md focus:shadow-lg.
________________________________________
12.3. ARIA (Accessible Rich Internet Applications)
•	AI Implementation: Use ARIA attributes to enhance the accessibility of custom components or when semantic HTML alone is insufficient to convey roles, states, and properties.
o	Roles: Add ARIA role attributes where semantic HTML doesn't fully describe the component's purpose.
	Example: role="tablist", role="tab", role="tabpanel" for custom tab components (Shadcn Tabs should handle this).
	role="dialog" for modals (Shadcn Dialog handles this).
	role="alert" for toast notifications that convey urgent information (Shadcn Toast can be configured for this).
	role="status" for toast notifications that provide non-urgent information.
	role="searchbox" for custom search inputs.
o	States & Properties: Use ARIA attributes to define the current states and properties of interactive components.
	aria-expanded: For accordions, dropdown buttons, navigation submenus (true when open, false when closed).
	aria-selected: For tabs in a tablist (true for the active tab, false for others).
	aria-invalid: For form fields with errors (true when invalid, false or absent otherwise).
	aria-describedby: To link form inputs to their error messages or descriptive text.
	aria-labelledby: To provide a label for an element when a visible <label> is not feasible or to associate complex elements.
	aria-label: To provide an accessible name for an element that has no visible text label (e.g., an icon-only button: <Button variant="icon" aria-label="Open Menu"><MenuIcon /></Button>).
	aria-hidden: To hide decorative elements or content that is off-screen from assistive technologies.
	aria-live ("polite" or "assertive"): For regions of a page that update dynamically (e.g., live chat messages, status updates, loading indicators, error messages appearing after an action). This tells screen readers to announce changes.
	polite: Announces changes when the user is idle.
	assertive: Announces changes immediately, interrupting the user (use sparingly for critical updates).
o	Shadcn UI Note: Radix UI primitives, which Shadcn UI uses, are designed with accessibility in mind and typically include appropriate ARIA attributes. Ensure these are not removed or overridden incorrectly during customization.
________________________________________
12.4. Color Contrast
•	AI Implementation:
o	Strictly adhere to the defined Color Palette (Section 3). The chosen text colors (primary-text-dark, secondary-text-medium) against the light backgrounds (primary-beige, card-modal-background) are intended to meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text - 18pt or 14pt bold).
o	Verification: During development, use a color contrast checker tool to verify that text and important UI elements (like icons that convey information, borders of input fields in focus/error states) meet these ratios against their respective backgrounds.
o	Primary Accent on White: The primary-accent color (#8B4513) on card-modal-background (#FFFFFF) for buttons needs to be checked. If it doesn't meet 4.5:1 for button text, the text color might need to be lighter, or the accent color slightly adjusted if brand guidelines permit. (A quick check shows #8B4513 on #FFFFFF has a ratio of 4.53:1, which passes for normal text. Good.)
o	Focus Indicators: Ensure focus indicators have sufficient contrast with their surroundings.
________________________________________
12.5. Alternative Text for Images
•	AI Implementation:
o	All <img> tags or Next.js <Image> components MUST have an alt attribute.
o	Decorative Images: If an image is purely decorative and provides no informational value, use an empty alt attribute: alt="".
o	Informative Images (e.g., user profile pictures, partner-uploaded photos in check-ins, icons conveying information not present in adjacent text):
	Provide descriptive alt text that conveys the content and purpose of the image.
	For user-uploaded content, if a caption or note is provided by the user, that can inform the alt text. If not, a generic description like "Photo uploaded by [User's Name] for [System Name] check-in" might be appropriate.
	Profile pictures: alt="[Username]'s profile picture".
	Icons that are the sole content of a button or link must have their purpose conveyed, often via aria-label on the button/link if the icon itself is decorative within that context, or descriptive alt if the icon is an <img>. Lucide React icons used as components usually don't need alt but their wrapping interactive element needs an accessible name.
________________________________________
12.6. Text Resizing & Zoom
•	AI Implementation:
o	Use relative units (rem, em) for font sizes, padding, and margins where possible, configured via Tailwind CSS's theme. This allows text and layouts to scale gracefully when users adjust their browser's zoom settings or default font size. Tailwind's default unit is rem, which is good.
o	Ensure layouts reflow gracefully and content remains readable without loss of information or functionality when text is zoomed up to 200%. Test this by zooming the browser. Avoid fixed heights on containers that hold text if it can lead to overflow and clipping.
________________________________________
12.7. Forms (Reiteration for Accessibility)
•	AI Implementation:
o	Every form input (Input.jsx, TextArea.jsx, Select.jsx, Checkbox.jsx, Switch.jsx based on Shadcn) MUST have an associated, visible <Label> component (using htmlFor linked to input id).
o	Group related form elements using <fieldset> and <legend> where appropriate (e.g., a group of radio buttons for status selection if not using ToggleGroup).
o	Clearly indicate required fields (e.g., with an asterisk and visually hidden text for screen readers, or simply by clear labeling if all fields in a section are required).
o	Ensure validation error messages are programmatically associated with their respective inputs using aria-describedby and that inputs are marked with aria-invalid="true".
13. UI-Related Performance Optimizations (Global Principles & Application)
Core Guideline for AI (Performance): Performance is a feature. The generated frontend code should be optimized for fast load times, smooth interactions, and efficient rendering. The chosen stack (Next.js, Tailwind CSS, Framer Motion) provides many tools for this, which must be utilized correctly.
________________________________________
13.1. Philosophy for Performance
•	Perceived Performance is Key: The application should feel fast and responsive to user interactions, even if some backend operations take time. Optimistic UI updates and smooth animations contribute significantly to this.
•	Minimize Load Times: Optimize initial page load and subsequent asset loading (images, fonts, scripts).
•	Efficient Rendering: Prevent unnecessary re-renders in React components to keep the UI snappy.
•	Resource Management: Be mindful of image sizes, font loading strategies, and the bundle size of JavaScript.
________________________________________
13.2. Techniques for Frontend Implementation
•	A. Optimistic UI Updates (CRITICAL for "Snappy" Feel):
o	Concept: When a user performs an action that requires a backend call (e.g., saving a check-in, sending a message, marking a notification as read, adding a reaction), update the UI immediately as if the action was successful. Then, make the backend call (stubbed API call) in the background.
o	Implementation Strategy:
1.	User triggers an action (e.g., clicks "Save Check-in").
2.	Immediately update the local React state to reflect the success (e.g., mark the system card as "Completed," add the message to the chat UI locally).
3.	Trigger the (stubbed) API call to the backend.
4.	If API call succeeds (stub returns success): No further UI change is typically needed, as the UI already reflects the new state.
5.	If API call fails (stub returns error):
	Revert the UI change to its previous state.
	Display an appropriate error message (e.g., using a Toast notification: "Failed to save check-in. Please try again.").
	Provide a mechanism to retry the action if applicable.
o	Where to Apply (Examples from DuoTrak spec):
	System Check-ins (marking completed/skipped, adding notes/photos).
	Sending Direct Messages.
	Adding Reactions/Comments (Post-MVP for comments).
	Marking Notifications as Read (single or all).
	Goal/System creation/updates (basic property changes can be optimistic; ID generation from backend might require waiting for actual success for some flows).
o	State Management for Optimism: Requires careful state management to handle the temporary optimistic state and the potential rollback. Keep track of "pending" items or states if necessary.
o	Core Guideline for AI (Optimistic UI): Implement Optimistic UI updates for all specified user actions. This involves updating the local React state immediately and then handling the success/failure of the (stubbed) backend call to either confirm or revert the change and show an error.
•	B. Image Optimization (Next.js <Image> Component):
o	AI Implementation: For ALL images displayed in the application (user profile pictures, check-in photos, static assets like logos, illustrations for empty states if any), MUST use the Next.js <Image> component from next/image.
o	Benefits provided by next/image:
	Automatic responsive image sizes (serving appropriately sized images for different devices).
	Conversion to modern formats like WebP (if the browser supports it).
	Lazy loading by default (images outside the initial viewport are not loaded until they are scrolled near).
	Prevention of layout shift (CLS) by reserving space for the image.
o	Usage:
	Provide appropriate width and height props for statically known images, or use layout="fill" with a sized parent container for responsive images where dimensions are not fixed.
	Set the quality prop if needed (default is 75), but the default is often a good balance.
	For images from external sources (like a Supabase Storage bucket if user-uploaded content URLs are direct):
	The domain of the image source MUST be configured in next.config.js under the images.domains or images.remotePatterns array.
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-project-id.supabase.co', // Example
        // port: '', // if needed
        // pathname: '/storage/v1/object/public/bucket-name/**', // if more specific path needed
      },
    ],
  },
};

o	Core Guideline for AI (Image Optimization): Use next/image for all image rendering. Ensure necessary configuration in next.config.js for external image sources (like Supabase Storage, if applicable for mock image URLs).
•	C. Code Splitting & Dynamic Imports (Next.js & Framer Motion):
o	Next.js Pages: Next.js automatically code-splits by page. Each page only loads the JavaScript necessary for that page.
o	Components (next/dynamic):
	AI Implementation: Identify large components or those not needed on initial render. Import them using next/dynamic.
	Candidates for Dynamic Import:
	Complex charting libraries (e.g., Recharts, Chart.js wrappers for Progress/Stats view).
	Modals/Dialogs (Modal.jsx) that are not visible on initial page load.
	Heavy third-party integrations (e.g., a complex rich text editor if one were used).
	Potentially, parts of Framer Motion if its core bundle size becomes a concern for initial load on very critical pages (though it's generally well-optimized and tree-shakeable).
	Usage:
import dynamic from 'next/dynamic';
import SkeletonLoader from '../Feedback/SkeletonLoader'; // Or a specific skeleton for the component

const HeavyChartComponent = dynamic(
  () => import('../Charts/HeavyChartComponent'), // Path to your component
  {
    ssr: false, // If the component is client-side only
    loading: () => <SkeletonLoader variant="chart" /> // Or a simple loading message/spinner
  }
);

	Use the loading option to show a skeleton/spinner while the dynamic component loads.
	Use ssr: false if the component relies on browser-only APIs and should not be server-rendered (common for charting libraries or components using window).
o	Core Guideline for AI (Code Splitting): Analyze component dependencies. Apply dynamic imports (next/dynamic) for non-critical, heavy components, or components only needed after user interaction (like modals).
•	D. Lazy Loading (Beyond Next.js defaults):
o	Next.js <Image>: Handles lazy loading of images by default.
o	Other Content: For MVP, rely on Next.js's built-in capabilities (page-based code splitting, next/image lazy loading, next/dynamic for components). Advanced lazy loading of entire content sections far down a long scrolling page (e.g., using IntersectionObserver API) is a Post-MVP optimization unless a specific page is exceptionally long and performance testing indicates a need.
•	E. Minimize Re-renders (React Best Practices):
o	AI Implementation: Apply these React optimization techniques judiciously.
	React.memo: Wrap components that render often with the same props to prevent unnecessary re-renders. Use with a custom comparison function if prop comparison is complex (e.g., objects/arrays).
	useCallback: Memoize callback functions passed to child components, especially if those children are memoized with React.memo or if the callback is a dependency of a useEffect hook.
	useMemo: Memoize expensive calculations or derived data so they are not re-computed on every render.
	Efficient State Structure: Avoid deeply nested state objects that cause widespread re-renders when only a small part changes. Normalize state where appropriate (e.g., using objects with IDs as keys instead of arrays for lookups if performance becomes an issue).
	Key Prop: When rendering lists of components, always use a stable and unique key prop for each item. This helps React identify items that have changed, been added, or been removed.
o	Core Guideline for AI (Re-renders): Apply these React optimization techniques judiciously. Profile if performance issues arise, but start with good practices. Do not over-optimize prematurely.
•	F. Virtualization (for Long Lists - Post-MVP):
o	Concept: For potentially very long lists (e.g., chat history, notification feed, extensive check-in history if not paginated heavily), virtualization renders only the items currently visible in the viewport, significantly improving performance.
o	Libraries: react-window or react-virtualized.
o	MVP Consideration: For MVP, if lists are paginated ("Load More" button), full virtualization might be overkill. If a feed is expected to grow very long within a single view without user-triggered pagination, virtualization becomes more important. For DuoTrak's chat and notifications, assume a reasonable number of initial items are loaded, and "Load More" handles older items. Full virtualization can be a Post-MVP enhancement if performance testing shows it's needed for specific long lists.
o	Core Guideline for AI (Virtualization): Implement basic "Load More" pagination first. Consider virtualization as a Post-MVP enhancement if performance testing shows it's needed for specific long lists.
•	G. Debouncing and Throttling (Post-MVP for most features):
o	Debounce: For inputs that trigger API calls as the user types (e.g., a search filter on the Progress screen, if added Post-MVP). Use a debounce function (e.g., from Lodash, or a simple custom hook) to delay the API call until the user stops typing for a set period (e.g., 300-500ms).
o	Throttle: For events that fire rapidly (e.g., scroll or window resize events, if complex calculations are tied to them).
o	MVP: Not many clear use cases for MVP features yet, but keep in mind for future search/filter additions.
o	Core Guideline for AI (Debounce/Throttle): Not critical for current MVP spec, but be aware if implementing features that trigger frequent events/API calls.
•	H. Font Loading Strategy (Next.js next/font):
o	AI Implementation: Utilize next/font for loading the Inter font (as detailed in Section 4: Typography System). This ensures efficient loading (e.g., preloading, self-hosting of Google Fonts) and uses font-display: swap to prevent Flash of Invisible Text (FOIT) and improve perceived performance.
o	Core Guideline for AI (Font Loading): Ensure next/font is used for loading the Inter font to optimize font display and performance.
14. Frontend Architecture Notes (Next.js Context - Guidelines for AI)
Core Guideline for AI (Architecture): The following architectural notes provide a high-level summary and reinforcement of how the DuoTrak Next.js frontend should be structured and built. Adherence to these guidelines is crucial for clarity, maintainability, scalability, and effective AI-assisted development.
________________________________________
14.1. Project Structure (as previously outlined and reinforced)
•	pages/ (or app/ if using Next.js App Router - this document assumes pages/ for clarity with current spec):
o	Contains all top-level routes based on file-system routing.
o	Dynamic routes use bracket notation (e.g., pages/goals/[goalId].jsx).
o	_app.jsx: Custom App component for global layout, state providers, and page transitions.
o	_document.jsx: (Optional, if needing to customize <html> or <body> tags beyond what _app.jsx offers).
•	components/: Organized by feature or commonality. This is the primary location for all React components.
o	Feature-based: components/Dashboard/, components/Goals/, components/Auth/, components/PartnerView/, components/Checkin/, components/Progress/, components/Notifications/.
o	Commonality-based:
	components/Common/ (e.g., Button.jsx, Spinner.jsx).
	components/UI/ (e.g., Card.jsx, ScreenHeader.jsx, ModalBackdrop.jsx if a custom one was needed beyond Shadcn).
	components/Forms/ (e.g., Input.jsx, TextArea.jsx, Select.jsx, Checkbox.jsx, ImageUpload.jsx, GoalForm.jsx, SystemForm.jsx).
	components/Layout/ (e.g., MobileTabLayout.jsx, DesktopTopNavLayout.jsx).
	components/Navigation/ (e.g., BottomTabBar.jsx, BottomTabItem.jsx, TopNavBar.jsx, TopNavLink.jsx, NotificationBell.jsx, UserProfileMenu.jsx, Tabs.jsx).
	components/Overlays/ (e.g., Modal.jsx, NotificationDropdownPanel.jsx, ProfileDropdownMenu.jsx, Toast.jsx - though Toaster is global).
	components/Feedback/ (e.g., SkeletonLoader.jsx, ErrorDisplay.jsx, EmptyState.jsx).
	components/Charts/ (e.g., LineChart.jsx, BarChart.jsx - wrappers for charting libraries).
•	lib/ or utils/: Helper functions, date formatters, utility functions not tied to a specific component or service (e.g., formatDate.js, validationUtils.js).
•	services/: Modules for API stub functions, organized by resource.
o	(e.g., authService.js, dashboardService.js, goalService.js, systemService.js, partnershipService.js, checkinService.js, notificationService.js, progressService.js, aiPlannerService.js).
•	hooks/: Custom React hooks.
o	(e.g., useResponsiveBreakpoints.js, useAuth.js if creating a context consumer hook).
•	contexts/: React Context API providers.
o	(e.g., AuthContext.jsx, NotificationContext.jsx if using context for toasts, PartnershipContext.jsx if needed).
•	public/: Static assets that are served directly (e.g., favicon, manifest.json, images not handled by Next.js <Image> optimization like some SVGs or brand logos if preferred here).
•	styles/:
o	globals.css: Global styles, Tailwind CSS @tailwind directives, base HTML element styling, CSS custom properties (variables for colors, spacing, fonts if not fully in Tailwind config).
•	tailwind.config.js: Configuration for Tailwind CSS (theme extensions for colors, spacing, fonts, breakpoints, custom shadows, plugins).
•	next.config.js: Configuration for Next.js (e.g., image domains/remotePatterns, redirects, headers if managed here).
•	Core Guideline for AI (Project Structure): Adhere to this project structure for clarity, maintainability, and to facilitate easier navigation and understanding of the codebase.
________________________________________
14.2. Routing (Next.js)
•	AI Implementation:
o	Utilize Next.js's built-in file-system routing.
o	Use the <Link> component from next/link for all client-side navigation between pages to enable prefetching and smooth transitions.
o	Use useRouter() hook from next/router for programmatic navigation (e.g., router.push('/dashboard'), router.back()) and for accessing route parameters (e.g., router.query.goalId).
o	Employ dynamic routes using bracket syntax for pages that depend on variable parameters (e.g., pages/goals/[goalId].jsx).
•	Core Guideline for AI (Routing): Implement all navigation using Next.js client-side routing features.
________________________________________
14.3. State Management Strategy
•	Global State (React Context API):
o	AuthContext: (CRITICAL) Stores user authentication status, user object (currentUser), session tokens (if managed client-side, though Supabase client library often handles this), and provides login/logout functions that interact with authService.js. This context will wrap the entire application in _app.jsx.
o	NotificationContext (Optional but Recommended): Manages global toast/snackbar messages. Provides a function to trigger toasts from any component. (Shadcn UI's useToast hook and Toaster component largely fulfill this).
o	PartnershipContext (Optional): Stores details of the current partnership if frequently accessed across many components, to avoid prop drilling.
•	Server State / Cache Management (API Data):
o	MVP with Stubs: Use useState for storing fetched data from API stubs and useEffect to call these stubs on component mount or when dependencies (like filters or IDs) change. Manage isLoading and error states manually within components or custom data-fetching hooks.
o	Post-MVP (Real API): Highly recommend using a dedicated server state management library like SWR or React Query. These libraries handle caching, revalidation, loading/error states, pagination, etc., much more elegantly. (For now, with stubs, useState/useEffect is acceptable).
•	Local Component State:
o	Use useState for managing UI element states (e.g., modal open/close, active tab, input values within forms).
o	Use useReducer for more complex component state logic if it involves multiple related state values or well-defined transitions.
•	Core Guideline for AI (State Management): For MVP, implement global state with AuthContext. Use useState/useEffect for data fetching from stubs and managing local component states. No need to implement SWR/React Query with the current stubbed backend.
________________________________________
14.4. API Communication Layer (services/ directory)
•	AI Implementation:
o	Create separate JavaScript/TypeScript modules within the services/ directory for each logical group of API calls (e.g., dashboardService.js, goalService.js).
o	Each function in these modules will be an async function that currently returns mock data (as per the stubs provided in the screen specifications or implied by component needs). These functions should simulate network latency (e.g., using await new Promise(resolve => setTimeout(resolve, 500))).
o	These service functions should encapsulate the "API call" logic. In the future, they would contain actual fetch or axios calls to the real FastAPI backend.
o	Include basic error handling simulation in stubs (e.g., sometimes return { success: false, error: "Simulated network error from stub." }).
•	Frontend Component Interaction: Frontend components should import and use these service functions to fetch or submit data. They should not make direct (mock) fetch calls themselves.
•	Core Guideline for AI (API Layer): Create these service modules with the stubbed async functions. Frontend components MUST import and use these service functions, not make direct (mock) fetch calls themselves.
________________________________________
14.5. Styling Solution (Summary)
•	Primary Styling Engine: Tailwind CSS.
o	Utility-first approach for most styling.
o	Configuration in tailwind.config.js defines the DuoTrak design system (colors, spacing, fonts, breakpoints, custom shadows) by extending Tailwind's theme.
•	Component Foundation: Shadcn UI.
o	Use Shadcn UI components as unstyled or lightly styled primitives (e.g., Button, Card, Input, Dialog, Tabs, Select, Checkbox, Switch, Avatar, Popover, DropdownMenu, Toast, Skeleton).
o	Crucial: These components MUST be heavily customized using Tailwind CSS utility classes to precisely match the DuoTrak design specifications for appearance, variants, states, typography, and spacing. The code for Shadcn components will reside within the project, allowing for direct modification.
•	CSS Custom Properties (Variables):
o	Used in styles/globals.css to define core design tokens (colors, spacing values) which are then referenced in tailwind.config.js.
•	Global Styles (styles/globals.css):
o	Contains Tailwind CSS @tailwind base; @tailwind components; @tailwind utilities; directives.
o	Minimal base HTML element styling (e.g., default body background color, font smoothing).
o	Potentially a few global helper classes if absolutely necessary and not achievable via Tailwind.
•	CSS Modules (*.module.css):
o	To be used sparingly, only for very specific, complex component styling that is genuinely difficult or messy to achieve cleanly with Tailwind CSS utilities alone. Tailwind CSS should be the default and preferred method.
•	Framer Motion for Animations:
o	The primary tool for all significant UI animations, transitions, and interactive feedback, as detailed in Section 8.
•	Core Guideline for AI (Styling): Prioritize Tailwind CSS for all styling. Customize Shadcn UI components using Tailwind to match the DuoTrak spec. Use Framer Motion for animations. CSS Modules are a fallback for exceptional cases.
________________________________________
14.6. Environment Variables (Next.js)
•	AI Implementation:
o	While most API calls are stubbed for MVP, if there were any frontend-specific public keys or URLs needed (e.g., a public analytics key Post-MVP, or a specific URL for a third-party service that isn't part of the backend API), use Next.js environment variables.
o	Client-side accessible variables MUST be prefixed with NEXT_PUBLIC_ (e.g., NEXT_PUBLIC_ANALYTICS_KEY).
o	These can be defined in .env.local (for local development, not committed to Git) and then set in the deployment environment.
o	For now, API base URL for stubs can be hardcoded or not needed if service functions are self-contained.
•	Core Guideline for AI (Env Variables): Not critical for stubbed MVP, but good practice if any configuration is needed frontend-side. If used, prefix with NEXT_PUBLIC_.
________________________________________
14.7. Deployment Target (Reminder)
•	AI Implementation: The generated frontend should be a standard Next.js application.
o	For MVP, it will likely be run in SSR mode or as a statically exported site (if no server-side logic is strictly needed by Next.js itself, which is the case here with a separate FastAPI backend).
o	The code should be flexible enough for either SSR on an EC2 instance (potentially proxied by Nginx alongside the FastAPI backend) or static export to S3/CloudFront. Favor SSR structure if unsure, as it's more flexible.
•	Core Guideline for AI (Deployment): Generate a standard Next.js application structure. Do not include any EC2 or Nginx configuration files; those are infrastructure concerns.
________________________________________
Conclusion & Final AI Guidance (Reiteration from original document, adapted):
This document now provides an extremely detailed UI/UX blueprint specifically tailored for you, the AI, to generate the DuoTrak Next.js frontend using Tailwind CSS, customized Shadcn UI components, and Framer Motion. The "Core Guideline for AI" directives throughout this document are crucial: they define the boundaries of your task, focusing you on frontend generation and preventing attempts to implement backend logic or make assumptions beyond the design specification.
Key Takeaways for AI before starting code generation:
1.	Adhere to Globals: The Color Palette, Typography System, Spacing System, and Iconography (Sections 3-6) are global rules. All components must follow them strictly using the defined CSS variables (via Tailwind config) and font settings (next/font).
2.	Component-Based Architecture: Build small, reusable components first (Buttons, Inputs, Cards, etc., as per Section 7, using Shadcn as a base and customizing with Tailwind), then compose them into larger screen-specific components and pages (Section 10).
3.	State Management: Use AuthContext for global auth state. Use useState/useEffect for local component state and data fetching from stubbed service functions (Section 14.3).
4.	API Stubs: All backend interactions are to be implemented as JavaScript async functions in the services/ directory that return mock data and simulate success/error states (Section 14.4). Do not attempt to connect to a real backend.
5.	Responsiveness: Apply responsive design principles (Tailwind's responsive prefixes, Flexbox, Grid, Media Queries defined in Tailwind config) at all levels to ensure the app works seamlessly across mobile, tablet, and desktop breakpoints (Section 5).
6.	Optimistic UI: Implement optimistic UI updates for key user interactions to make the application feel "snappy" (Section 13.2.A).
7.	Animations: Use Framer Motion for all significant UI animations, transitions, and interactive feedback, aiming for a fluid and polished experience (Section 8).
8.	Error Handling & Empty States: Provide clear, user-friendly feedback for all error conditions and when no data is available, as specified for each screen/component (Section 11).
9.	Accessibility: Build with accessibility in mind from the start (semantic HTML, keyboard navigation, focus states, ARIA basics, color contrast - Section 12).
