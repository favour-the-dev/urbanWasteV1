# 🎨 UrbanWaste Design System Documentation

## Overview

This document outlines the unified design system for the Urban Waste Management application. All components, pages, and features should adhere to these guidelines to ensure visual consistency and professional appearance.

---

## 🎯 Design Principles

1. **Consistency**: Same visual language across all user roles (Admin, Operator, Citizen)
2. **Clarity**: Clean, minimal interface with clear hierarchy
3. **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios
4. **Performance**: Optimized components with smooth transitions
5. **Responsive**: Mobile-first approach with breakpoints at 640px, 768px, 1024px, 1280px

---

## 🎨 Color System

### Primary Colors (Emerald)

-   **primary-50**: `#f0fdf4` - Lightest background
-   **primary-100**: `#dcfce7` - Light background
-   **primary-500**: `#10b981` - Main brand color
-   **primary-600**: `#059669` - Primary buttons, links
-   **primary-700**: `#047857` - Hover states

### Accent Colors (Teal)

-   **accent-50**: `#f0fdfa` - Lightest accent
-   **accent-500**: `#14b8a6` - Accent elements
-   **accent-600**: `#0d9488` - Accent buttons
-   **accent-700**: `#0f766e` - Accent hover states

### Neutral Colors

-   **Gray Scale**: `gray-50` through `gray-900`
-   **Background**: `#fefefe` (white)
-   **Surface**: `#ffffff` (card backgrounds)
-   **Border**: `#e2e8f0` (gray-200)

### Status Colors

-   **Success**: `#10b981` (green-500)
-   **Warning**: `#f59e0b` (amber-500)
-   **Error**: `#ef4444` (red-500)
-   **Info**: `#3b82f6` (blue-500)

### Usage Examples

```tsx
// Primary button
<Button>Save Changes</Button>

// Accent/secondary action
<Button variant="outline">Cancel</Button>

// Error state
<Button variant="destructive">Delete</Button>
```

---

## 📝 Typography

### Font Families

-   **Headings**: `'Space Grotesk'` - Bold, modern sans-serif
-   **Body**: `'Noto Sans'` - Clean, readable sans-serif
-   **Code**: `'JetBrains Mono'` - Monospace for technical content

### Type Scale

```
xs:   0.75rem (12px) - Captions, labels
sm:   0.875rem (14px) - Small text, metadata
base: 1rem (16px) - Body text
lg:   1.125rem (18px) - Large body text
xl:   1.25rem (20px) - Small headings
2xl:  1.5rem (24px) - Section headings
3xl:  1.875rem (30px) - Page headings
4xl:  2.25rem (36px) - Hero headings
5xl:  3rem (48px) - Display headings
6xl:  3.75rem (60px) - Large display headings
```

### Font Weights

-   **Light**: 300 - De-emphasized text
-   **Regular**: 400 - Body text
-   **Medium**: 500 - Emphasized text
-   **Semibold**: 600 - Headings, labels
-   **Bold**: 700 - Strong emphasis

### Usage Examples

```tsx
<h1 className="text-4xl font-bold text-gray-900">
  Main Page Title
</h1>

<p className="text-base text-gray-600">
  Regular paragraph text with good readability
</p>

<span className="text-sm text-gray-500">
  Metadata or secondary information
</span>
```

---

## 📏 Spacing System

### Scale

```
xs:  0.25rem (4px)
sm:  0.5rem (8px)
md:  1rem (16px)
lg:  1.5rem (24px)
xl:  2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

### Application

-   **Component padding**: Use `p-4` (16px) or `p-6` (24px)
-   **Section spacing**: Use `py-16` (64px) or `py-24` (96px)
-   **Element gaps**: Use `gap-4` (16px) or `gap-6` (24px)

---

## 🔲 Border Radius

```
sm:  0.375rem (6px) - Small elements
md:  0.5rem (8px) - Default elements
lg:  0.75rem (12px) - Buttons, inputs
xl:  1rem (16px) - Cards, modals
2xl: 1.5rem (24px) - Large containers
```

### Usage

-   **Buttons**: `rounded-lg` (12px)
-   **Cards**: `rounded-xl` (16px)
-   **Modals**: `rounded-xl` (16px)
-   **Inputs**: `rounded-lg` (12px)

---

## 🌑 Shadows

```
sm:      0 1px 2px 0 rgb(0 0 0 / 0.05)
DEFAULT: 0 1px 3px 0 rgb(0 0 0 / 0.1)
md:      0 4px 6px -1px rgb(0 0 0 / 0.1)
lg:      0 10px 15px -3px rgb(0 0 0 / 0.1)
xl:      0 20px 25px -5px rgb(0 0 0 / 0.1)
```

### Usage

-   **Cards**: `shadow-sm` with `hover:shadow-md`
-   **Modals**: `shadow-xl`
-   **Floating elements**: `shadow-lg`

---

## 🧩 Component Library

### Button

```tsx
// Primary action
<Button size="lg">Get Started</Button>

// Secondary action
<Button variant="outline">Learn More</Button>

// Danger action
<Button variant="destructive">Delete</Button>

// Ghost action
<Button variant="ghost">Cancel</Button>
```

**Variants**: `default | outline | secondary | ghost | link | destructive`  
**Sizes**: `sm | default | lg | icon`

### Card

```tsx
<Card hover className="p-6">
    <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
    <p className="text-gray-600">Card content goes here</p>
</Card>
```

**Props**:

-   `hover`: Adds hover effect
-   `padding`: `none | sm | md | lg`

### Modal

```tsx
<Modal
    isOpen={isOpen}
    onClose={handleClose}
    title="Modal Title"
    footer={<Button>Save</Button>}
>
    <p>Modal content</p>
</Modal>
```

**Sizes**: `sm | md | lg | xl`

---

## 📱 Responsive Breakpoints

```
sm:  640px  - Mobile landscape
md:  768px  - Tablet
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large desktop
```

### Mobile-First Approach

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Responsive grid */}
</div>
```

---

## 🎭 Animation & Transitions

### Duration

```
fast: 150ms - Quick interactions
base: 200ms - Default transitions
slow: 300ms - Smooth animations
```

### Easing

```
cubic-bezier(0.4, 0, 0.2, 1) - Default easing
```

### Usage

```tsx
// Hover effect
className = "transition-all duration-200 hover:shadow-md";

// Scale animation
className = "transform hover:scale-105 transition-transform duration-200";
```

---

## 🎨 Layout Patterns

### Container

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Centered, responsive container */}
</div>
```

### Section Spacing

```tsx
<section className="py-16 sm:py-24">
    {/* Section with responsive vertical padding */}
</section>
```

### Grid Layouts

```tsx
// Features grid
<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
  {features.map(...)}
</div>

// Two-column layout
<div className="grid md:grid-cols-2 gap-8">
  <div>Left column</div>
  <div>Right column</div>
</div>
```

---

## 🚫 Anti-Patterns (What NOT to Do)

### ❌ Don't Use

-   Multiple gradient backgrounds
-   Inconsistent color schemes per role
-   Inline styles (use Tailwind classes)
-   Custom CSS for spacing (use Tailwind spacing scale)
-   Bright neon colors or high-contrast gradients
-   Inconsistent border radius across similar components

### ✅ Do Use

-   Flat colors with subtle shadows
-   Consistent primary brand colors
-   Tailwind utility classes
-   Design system spacing scale
-   Professional, muted color palette
-   Uniform border radius within component types

---

## 📐 Dashboard Layouts

### Sidebar Structure

```tsx
{
    /* Logo Area */
}
<div className="px-6 py-6 border-b border-gray-200">
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600">
            <Icon />
        </div>
        <div>
            <h1 className="text-lg font-bold">UrbanWaste</h1>
            <p className="text-xs text-gray-600">Admin Panel</p>
        </div>
    </div>
</div>;

{
    /* Navigation */
}
<nav className="px-4 py-6 space-y-2">
    <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
        <Icon className="w-5 h-5" />
        <span>Dashboard</span>
    </Link>
</nav>;
```

### Main Content Area

```tsx
<main className="flex-1 md:pl-64 p-6 sm:p-8 bg-gray-50">
    <div className="max-w-7xl mx-auto">{/* Page content */}</div>
</main>
```

---

## 🎯 Implementation Checklist

### For Each New Component

-   [ ] Uses design system colors
-   [ ] Follows typography scale
-   [ ] Implements proper spacing
-   [ ] Includes hover/focus states
-   [ ] Responsive on mobile
-   [ ] Accessible (ARIA labels, keyboard navigation)
-   [ ] Smooth transitions
-   [ ] Consistent border radius

### For Each New Page

-   [ ] Uses consistent layout structure
-   [ ] Follows spacing guidelines
-   [ ] Implements proper headings hierarchy
-   [ ] Uses Card components appropriately
-   [ ] Mobile responsive
-   [ ] Loading states included
-   [ ] Error states handled

---

## 🔄 Migration Guide

### Updating Existing Components

1. **Replace color classes**

    ```tsx
    // Before
    className = "bg-emerald-50 text-emerald-700";

    // After
    className = "bg-primary-50 text-primary-700";
    ```

2. **Standardize spacing**

    ```tsx
    // Before
    className = "p-5 m-3";

    // After
    className = "p-6 m-4";
    ```

3. **Use component library**

    ```tsx
    // Before
    <button className="px-4 py-2 bg-blue-500 rounded...">

    // After
    <Button>Click Me</Button>
    ```

---

## 📚 Resources

-   **Tailwind CSS Docs**: https://tailwindcss.com/docs
-   **Lucide Icons**: https://lucide.dev/
-   **Framer Motion**: https://www.framer.com/motion/
-   **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

## 🤝 Contributing

When adding new components or pages:

1. Review this design system documentation
2. Use existing components when possible
3. Follow naming conventions
4. Test on mobile and desktop
5. Ensure accessibility compliance
6. Update this documentation if adding new patterns

---

**Last Updated**: October 30, 2025  
**Version**: 1.0.0  
**Status**: Active

---

For questions or suggestions, contact the development team.
