# Kairos Email Builder

A lightweight, native React email builder component designed for Next.js applications. Built with **Tailwind CSS**, **Shadcn UI**, and **dnd-kit**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)

https://github.com/user-attachments/assets/2ce18ee0-bf8e-466e-9440-432655c83eb7


## 🚀 Features

*   **Drag & Drop Interface:** Smooth, intuitive drag-and-drop experience powered by `@dnd-kit`.
*   **Lightweight & Native:** No heavy external dependencies like GrapesJS or iframe wrappers.
*   **Modern Stack:** Built for the modern React ecosystem (Next.js 15, React 19, Tailwind CSS v3, Shadcn UI).
*   **Rich Text Editor:** Full-featured WYSIWYG editor with formatting options (bold, italic, headings, lists, colors, links).
*   **Professional Blocks:** 
    - **Core Blocks:** Text, Image, Button, Columns, Divider, Spacer
    - **Professional Blocks:** Header (with logo and navigation), Footer (with company info and legal links), Social Links (Facebook, X/Twitter, Instagram, LinkedIn, YouTube)
*   **Template System:** Predefined templates (Transactional, Welcome, Newsletter, Support) and custom template saving.
*   **Resizable Panels:** Dynamic sidebar resizing with persistent width preferences.
*   **Email-Ready Output:** Exports to clean, table-based HTML compatible with major email clients (Outlook, Gmail, etc.).
*   **JSON State:** Saves templates as structured JSON for easy persistence and re-editing.
*   **Nested Blocks:** Full support for nested block structures (e.g., columns containing other blocks).

## 📦 Installation

```bash
npm install kairos-email-builder
# or
yarn add kairos-email-builder
```

*(Note: Package publication pending. Currently, clone and import the component directly.)*

## 🛠️ Usage

```tsx
import { EmailBuilder, type EmailTemplate } from '@/components/email-builder';
import { useState } from 'react';

const initialTemplate: EmailTemplate = {
  version: '1.0',
  root: {
    backgroundColor: '#ffffff',
    fontFamily: 'sans-serif',
    children: []
  }
};

export default function Page() {
  const [template, setTemplate] = useState<EmailTemplate>(initialTemplate);

  return (
    <div className="h-screen">
      <EmailBuilder 
        value={template} 
        onChange={setTemplate}
        onUploadImage={async (file) => {
          // Implement your image upload logic here
          return 'https://example.com/image.jpg';
        }}
      />
    </div>
  );
}
```

## 📚 Documentation

- **[Developer Documentation](docs/DEVELOPER_DOCUMENTATION.md)**: Complete technical documentation, API reference, and implementation tutorial for developers
- **[User Manual](docs/USER_MANUAL.md)**: Step-by-step guide for non-technical users on how to use the email builder

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [x] Core Drag & Drop Logic
- [x] Block Configuration Panels
- [x] HTML Export Utility
- [x] Professional Blocks (Header, Footer, Social Links)
- [x] Template System
- [ ] Mobile Preview Mode
- [ ] Dark Mode Support
