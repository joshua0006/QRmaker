# QR Code Generator Architecture

## Core Architecture

The QR Code Generator is built using a modern React architecture with TypeScript, emphasizing:
- Component-based design
- Clean separation of concerns
- Type safety
- Reusable components
- Performance optimization

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── AuthModal/
│   ├── Dashboard/
│   │   ├── CategoryManager/
│   │   ├── QRCodeCard/
│   │   └── QRCodeList/
│   ├── QRCodeGenerator/
│   │   ├── components/
│   │   │   ├── AdvancedSettings/
│   │   │   ├── ColorPanel/
│   │   │   ├── CustomizePanel/
│   │   │   ├── Preview/
│   │   │   └── SaveSection/
│   │   ├── hooks/
│   │   └── index.tsx
│   └── common/
│       └── ColorPickerInput/
├── hooks/
├── services/
├── types/
└── utils/
```

## Core Components

### Dashboard Components

#### CategoryManager
- Manages QR code categories
- Handles category CRUD operations
- Provides category filtering

#### QRCodeCard
- Displays individual QR codes
- Handles QR code renaming
- Supports lazy loading
- Shows category labels

#### QRCodeList
- Displays grid of QR codes
- Handles pagination
- Supports category filtering

### Common Components

#### NewQRCodeCard
- Enhanced QR code display
- Supports saved images and live generation
- Inline category management
- Quick editing capabilities

#### ColorPickerInput
- Reusable color picker component
- Supports color presets
- Handles hex input
- Click outside detection

## Storage Architecture

### File Organization
- QR codes: `/qrcodes/{userId}/{timestamp}-{uniqueId}.png`
- Logos: `/logos/{userId}/{timestamp}-{uniqueId}.{ext}`
- Profiles: `/profiles/{userId}/{timestamp}-{uniqueId}.{ext}`

### Security Rules
- Row-level security
- Size limitations
- Content type validation
- User-based access control

## State Management

The application uses a combination of:
- React's built-in state management
- Custom hooks for complex logic
- Zustand for global auth state
- Event-based communication

### Custom Hooks

- useAuthModal: Manages auth modal state
- useClickOutside: Handles click outside detection
- useIntersectionObserver: Manages lazy loading

## Data Flow

1. User Input Flow:
   - Input validation
   - Type-specific formatting
   - Real-time preview updates

2. QR Code Generation:
   - Dynamic URL creation
   - Logo processing
   - Color extraction
   - Theme generation

3. Save Process:
   - Image capture
   - Unique filename generation
   - Metadata storage
   - Category assignment

## Firebase Integration

### Authentication
- Email/password authentication
- Password reset functionality
- User profile management

### Storage
- QR code image storage
- Logo image storage
- Unique filename generation
- Content type validation
- Organized by user ID

### Database (Firestore)
- QR code configurations
- User preferences
- Categories
- Metadata storage

### Security Rules
- Row-level security
- User-based access control
- Category ownership validation

## Performance Optimizations

1. Image Loading:
   - Lazy loading with Intersection Observer
   - Progressive image loading
   - Cached QR code generation

2. State Management:
   - Debounced updates
   - Memoized calculations
   - Efficient re-renders

3. Data Management:
   - Optimized queries
   - Efficient filtering
   - Smart caching

4. User Experience:
   - Instant feedback
   - Smooth transitions
   - Error prevention