# Secret Sharing Web Application

This is a modern web application built with React and Vite that allows users to share and interact with secrets. It features a complete setup with Supabase integration for backend services, Tailwind CSS for styling, and a component-based architecture.

## Features

- Secret creation and sharing functionality
- Comment system on secrets
- Real-time updates using Supabase
- Modern, responsive UI with Tailwind CSS
- Environment variable configuration
- ESLint integration for code quality

## Technology Stack

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Supabase](https://supabase.io/) - Backend as a Service
- [ESLint](https://eslint.org/) - Code linting
- [PostCSS](https://postcss.org/) - CSS transformation tool

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Comment.jsx
│   │   ├── CommentForm.jsx
│   │   ├── Footer.jsx
│   │   ├── SecretForm.jsx
│   │   └── SecretList.jsx
│   ├── App.jsx
│   ├── SecretsContext.jsx
│   ├── supabaseClient.js
│   └── utils.js
├── public/
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

The project uses several development tools:

- **HMR (Hot Module Replacement)** for fast refresh during development
- **ESLint** for code quality and consistency
- **Tailwind CSS** for styling with utility classes
- **PostCSS** for CSS processing

## Deployment

The project includes a `Procfile` for Heroku deployment and can be deployed to any platform that supports Node.js applications.

## License

This project is licensed under the terms included in the LICENSE file.

---

Created with [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
