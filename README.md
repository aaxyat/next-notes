# 📝 Next Notes ✨

![Next.js](https://img.shields.io/badge/Next.js-14.2.14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.9.0-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

Next Notes is a modern, sleek note-taking application built with Next.js, TypeScript, and MongoDB. It offers a seamless experience for creating, organizing, and managing your notes with a beautiful user interface.


## 🎮 Demo

Experience Next Notes in action! Check out our live demo:

[https://next-notes-five.vercel.app/](https://next-notes-five.vercel.app/)

Feel free to explore the features, create notes, and see how Next Notes can enhance your note-taking experience. This demo showcases the full functionality of the application, giving you a hands-on preview of what you can expect when you deploy your own instance.



## 🌟 Features

- 🔐 Secure user authentication with Clerk
- 📱 Responsive design for all devices
- 🌓 Dark mode support
- 🏷️ Tag-based note organization
- 🔍 Full-text search functionality
- 📝 Rich text editing with React Quill
- 🚀 Fast and efficient with server-side rendering

## 🛠️ Tech Stack

- **Frontend**: Next.js 14.2.14, TypeScript 5, Tailwind CSS 3.4.1
- **Backend**: Next.js API Routes
- **Database**: MongoDB 6.9.0
- **Authentication**: Clerk 4.23.2
- **Deployment**: Vercel

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your environment variables
4. Run the development server with `npm run dev`

## 🚀 Deploy Your Own

Deploy your own version of Next Notes with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faaxyat%2Fnext-notes)

## 🏠 Self-Hosting Guide

To self-host Next Notes, follow these steps:

1. **Fork the Repository**: Fork this repository to your GitHub account.

2. **Clone Your Fork**: Clone your forked repository to your local machine.

3. **Install Dependencies**: Run `npm install` to install all required dependencies.

4. **Set Up Environment Variables**: Create a `.env.local` file in the root directory and add the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=your_database_name
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

5. **Set Up MongoDB**: Create a MongoDB database and obtain your connection string.

6. **Set Up Clerk**: Create a Clerk account, set up your application, and obtain your API keys.

7. **Development**: Run `npm run dev` to start the development server.

8. **Production Build**: When ready for production, run `npm run build` followed by `npm start`.

9. **Deploy**: Deploy to your preferred hosting platform. We recommend Vercel for the easiest setup.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/aaxyat/next-notes/issues).

## 📜 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Quill](https://github.com/zenoamaro/react-quill)