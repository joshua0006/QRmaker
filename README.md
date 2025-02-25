# QR Code Generator

A powerful and user-friendly QR code generator built with React, TypeScript, and Firebase. Create beautiful, customizable QR codes with your brand colors, logos, and smart organization features.

## Features

- **Multiple QR Code Types**
  - Website URLs
  - Email addresses
  - Phone numbers
  - SMS messages
  - Dynamic URL redirection
  - Scan tracking and analytics

- **Advanced Customization**
  - Custom colors with gradient support
  - Logo upload and sizing
  - Multiple pattern styles
  - Corner styles customization
  - Border customization
  - Banner text with positioning
  - Smart color extraction from logos
  - Automatic theme generation

- **Category Management**
  - Create custom categories
  - Assign colors to categories
  - Filter QR codes by category
  - Rename and delete categories
  - Quick category switching

- **User Management**
  - Email/password authentication
  - Password recovery
  - QR code saving and management
  - QR code renaming
  - Secure file storage

- **Export Options**
  - PNG download
  - JPEG download
  - WebP download
  - High-resolution exports
  - Banner and border support

- **Organization**
  - Categorize QR codes
  - Rename QR codes
  - Filter by category
  - Sort by creation date
  - Bulk actions
  - Quick editing

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Build**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- qr-code-styling
- react-colorful
- Lucide React icons
- html2canvas
- clsx

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.