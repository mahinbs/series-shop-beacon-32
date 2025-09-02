# 📢 Announcement Image Standards Guide

## 🎯 **Purpose**
This guide ensures that **ALL announcement images** throughout the application maintain consistent dimensions and aspect ratios for a professional, uniform appearance.

## 📐 **Standardized Aspect Ratios**

### **1. Announcement Cards (4:3 Ratio)**
- **Use Case**: Main announcement cards, grid items, featured announcements
- **Component**: `<AnnouncementCardImage />`
- **Aspect Ratio**: `aspect-[4/3]` (4:3)
- **Example**:
```tsx
import { AnnouncementCardImage } from '@/components/AnnouncementImage';

<AnnouncementCardImage 
  src={announcement.image} 
  alt={announcement.title}
/>
```

### **2. Hero Images (16:9 Ratio)**
- **Use Case**: Large hero images on announcement detail pages
- **Component**: `<AnnouncementHeroImage />`
- **Aspect Ratio**: `aspect-[16/9]` (16:9)
- **Example**:
```tsx
import { AnnouncementHeroImage } from '@/components/AnnouncementImage';

<AnnouncementHeroImage 
  src={announcement.image} 
  alt={announcement.title}
/>
```

### **3. Thumbnail Images (4:3 Ratio)**
- **Use Case**: Small thumbnails, related announcements, sidebar images
- **Component**: `<AnnouncementThumbnailImage />`
- **Aspect Ratio**: `aspect-[4/3]` (4:3)
- **Example**:
```tsx
import { AnnouncementThumbnailImage } from '@/components/AnnouncementImage';

<AnnouncementThumbnailImage 
  src={announcement.image} 
  alt={announcement.title}
/>
```

## 🚫 **What NOT to Do**

### **❌ Avoid These Patterns:**
```tsx
// DON'T use fixed heights
<img className="h-48 w-full object-cover" />

// DON'T use inconsistent aspect ratios
<img className="h-64 w-full object-cover" />

// DON'T mix different height classes
<img className="h-32 md:h-auto w-full object-cover" />
```

### **✅ Always Use These Patterns:**
```tsx
// DO use standardized components
<AnnouncementCardImage src={image} alt={title} />

// DO use consistent aspect ratios
<div className="aspect-[4/3] overflow-hidden">
  <img className="w-full h-full object-cover" />
</div>
```

## 🔧 **Implementation Examples**

### **For New Announcement Components:**

```tsx
import { AnnouncementCardImage } from '@/components/AnnouncementImage';

function NewAnnouncementComponent({ announcement }) {
  return (
    <div className="announcement-card">
      <AnnouncementCardImage 
        src={announcement.image} 
        alt={announcement.title}
      />
      <div className="content">
        <h3>{announcement.title}</h3>
        <p>{announcement.description}</p>
      </div>
    </div>
  );
}
```

### **For Custom Aspect Ratios:**

```tsx
import { AnnouncementImage } from '@/components/AnnouncementImage';

function CustomAnnouncementComponent({ announcement }) {
  return (
    <div className="custom-announcement">
      <AnnouncementImage 
        src={announcement.image} 
        alt={announcement.title}
        aspectRatio="square" // or "16/9" or "4/3"
        showOverlay={true}
        overlayContent={<div>Custom Overlay</div>}
      />
    </div>
  );
}
```

## 📱 **Responsive Behavior**

All standardized announcement image components automatically:
- ✅ Maintain aspect ratios on all screen sizes
- ✅ Use `object-cover` for proper image cropping
- ✅ Include hover effects and transitions
- ✅ Support custom CSS classes for additional styling

## 🎨 **Styling Guidelines**

### **Base Classes Applied:**
- `relative overflow-hidden` - Container positioning
- `w-full h-full object-cover` - Image sizing
- `transition-transform duration-300 hover:scale-110` - Hover effects

### **Custom Styling:**
```tsx
<AnnouncementCardImage 
  src={image} 
  alt={title}
  className="rounded-xl shadow-lg" // Custom styling
/>
```

## 🔄 **Migration Checklist**

When updating existing announcement components:

- [ ] Replace `<img>` tags with appropriate standardized components
- [ ] Remove hardcoded height classes (`h-48`, `h-64`, etc.)
- [ ] Update aspect ratio containers to use `aspect-[4/3]` or `aspect-[16/9]`
- [ ] Test responsive behavior on different screen sizes
- [ ] Ensure consistent hover effects and transitions

## 📋 **Component Usage Summary**

| Use Case | Component | Aspect Ratio | Import Path |
|----------|-----------|--------------|-------------|
| **Card Images** | `<AnnouncementCardImage />` | 4:3 | `@/components/AnnouncementImage` |
| **Hero Images** | `<AnnouncementHeroImage />` | 16:9 | `@/components/AnnouncementImage` |
| **Thumbnails** | `<AnnouncementThumbnailImage />` | 4:3 | `@/components/AnnouncementImage` |
| **Custom** | `<AnnouncementImage />` | Configurable | `@/components/AnnouncementImage` |

## 🎯 **Benefits of This System**

1. **Consistency**: All announcements look uniform across the application
2. **Maintainability**: Easy to update image standards in one place
3. **Responsiveness**: Automatic responsive behavior on all devices
4. **Performance**: Optimized image rendering with proper aspect ratios
5. **Developer Experience**: Simple, reusable components for new announcements

## 🚀 **Quick Start for New Developers**

1. **Import the component** you need from `@/components/AnnouncementImage`
2. **Use the appropriate component** based on your use case
3. **Pass the required props**: `src` and `alt`
4. **Add custom styling** via the `className` prop if needed

**Example:**
```tsx
import { AnnouncementCardImage } from '@/components/AnnouncementImage';

// Simple usage
<AnnouncementCardImage src="/path/to/image.jpg" alt="Description" />

// With custom styling
<AnnouncementCardImage 
  src="/path/to/image.jpg" 
  alt="Description"
  className="rounded-lg shadow-xl"
/>
```

---

**Remember**: Always use these standardized components for announcement images to maintain consistency across your application! 🎉
