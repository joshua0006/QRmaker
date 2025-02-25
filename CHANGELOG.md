# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-02-13

### Added
- Smart logo color extraction:
  - Automatic color theme generation from uploaded logos
  - Intelligent contrast handling
  - Gradient suggestions based on logo colors
- Enhanced QR code saving:
  - Unique filename generation
  - Improved storage organization
  - Better error handling
- URL input improvements:
  - Smart URL formatting
  - Type-specific validation
  - Clear error messages

### Changed
- Simplified authentication:
  - Removed optional profile fields
  - Streamlined signup process
  - Better error handling
- Improved QR code cards:
  - New layout and design
  - Quick category switching
  - Inline editing capabilities

### Fixed
- File naming conflicts in storage
- Category management edge cases
- URL validation issues

## [1.0.0] - 2025-02-11

## [1.1.0] - 2025-02-12

### Added
- Category management system:
  - Create, edit, and delete categories
  - Assign colors to categories
  - Filter QR codes by category
  - Category labels on QR codes
- QR code renaming functionality
- Improved dashboard organization
- Reusable ColorPickerInput component
- Lazy loading for QR code images
- Click outside detection for modals

### Changed
- Refactored color picker implementation
- Improved dashboard layout
- Enhanced QR code card design
- Optimized QR code loading

### Technical Updates
- Added Zustand for auth state management
- Implemented intersection observer for lazy loading
- Enhanced Firebase security rules
- Added new custom hooks:
  - useAuthModal
  - useClickOutside
  - useIntersectionObserver

### Added
- Initial release of the QR Code Generator
- Support for multiple QR code types (URL, Email, Phone, SMS)
- Advanced customization options:
  - Custom colors with gradient support
  - Logo upload functionality
  - Multiple pattern styles
  - Corner style customization
  - Border customization
  - Banner text with positioning
- User authentication system:
  - Email/password login
  - Registration with optional profile info
  - Password recovery
- QR code saving functionality:
  - Save to Firebase Storage
  - Save configuration to Firestore
  - User-specific storage
- Multiple export formats:
  - PNG download
  - JPEG download
  - WebP download
  - PDF download
- Responsive design with Tailwind CSS
- Firebase integration for backend services

### Technical Details
- Built with React 18 and TypeScript
- Vite for build tooling
- Firebase for authentication and storage
- Tailwind CSS for styling
- qr-code-styling for QR generation
- react-colorful for color picking
- Lucide React for icons