# 📄 MyResume — AI-Powered ATS Resume Builder & Career Suite

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> **MyResume** is a modern, monochromatic obsidian-themed resume builder application. Designed with ATS optimization, real-time live preview, multiple professional resume templates, smart AI phrase generation, OTP email verification via EmailJS, and high-resolution multi-page A4 PDF export.

---

## ✨ Features

- 🎨 **Monochromatic Obsidian Luxury UI**: Sleek dark mode interface tailored for maximum focus and aesthetic appeal with zero color clutter.
- 📑 **8+ Professional Templates**: Minimal, Modern, Classic, Technical, Executive, Developer, Academic, and Professional layouts.
- ⚡ **Real-Time Live A4 Preview**: Dynamic zooming, section toggling, and live responsive updates as you edit.
- 🎯 **Dual Objective & Summary Generation**: Independent generation, regeneration, and keyword enhancement for both Freshers and Experienced candidates.
- 📄 **Crisp A4 PDF Export**: Pixel-perfect PDF rendering with zero character overlapping, font ligatures normalization, and accurate page slicing.
- 🔐 **Secure Passwordless OTP Authentication**: Seamless email verification powered by EmailJS and Supabase backend.
- 📊 **Live ATS Resume Score & Metric Breakdown**: Instant feedback on contact completeness, experience action verbs, skills diversity, and keyword optimization.
- 💾 **Supabase Database Cloud Sync & Local Storage Fallback**: Automatic cloud saving with uninterrupted offline resilience.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/prasadborusu/MYResume.git

# Navigate into project directory
cd MYResume

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Build Tool**: Vite 6
- **PDF Engine**: jsPDF, html2canvas
- **Email Delivery**: EmailJS
- **Backend & Storage**: Supabase (PostgreSQL, Row Level Security)

---

## 📜 License

This project is licensed under the MIT License.
