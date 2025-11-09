# InterviewPrep AI - Smart Coding Interview Platform

A full-stack web application built in **under 6 hours** using AI-powered development tools (Cursor AI & GitHub Copilot) to demonstrate rapid modern software development.

## 🚀 Project Overview

InterviewPrep AI is an intelligent coding practice platform that helps developers prepare for technical interviews with AI-powered feedback. Users can solve coding problems, run their solutions against test cases, and receive instant AI-generated feedback on their code quality and approach.

## ✨ Key Features

- **Interactive Code Editor**: Monaco Editor (VS Code) integration with syntax highlighting
- **Multi-language Support**: JavaScript, Python, and Java
- **Real-time Code Execution**: Run code against predefined test cases
- **AI-Powered Feedback**: Get intelligent suggestions and code reviews using OpenAI GPT
- **Problem Library**: Curated collection of coding interview problems
- **Responsive Design**: Beautiful UI built with Tailwind CSS

## 🛠️ Technology Stack

**Frontend:**
- Next.js 15 (React Framework with App Router)
- TypeScript
- Tailwind CSS
- Monaco Editor (@monaco-editor/react)
- Lucide React Icons

**Backend:**
- Next.js API Routes
- Prisma ORM
- SQLite Database
- OpenAI API Integration

**Development Tools:**
- Cursor AI - AI-powered code editor
- GitHub Copilot - Code completion
- TypeScript for type safety

## 📊 AI-Assisted Development Metrics

This project showcases efficient use of AI development tools:

- **Total Development Time**: ~5 hours
- **AI Tool Usage**: 70%+ of code generated/assisted by AI
- **Lines of Code**: ~1000+ lines
- **Components Created**: 8+ React components
- **API Endpoints**: 2 REST endpoints
- **Database Models**: 2 Prisma models

## 🎯 Development Approach

### Phase 1: Setup & Architecture (30 min)
- Project scaffolding with Next.js
- Database schema design with Prisma
- Environment configuration

### Phase 2: Core UI (45 min)
- Navigation component
- Landing page with features
- Problems listing page

### Phase 3: Code Editor (90 min)
- Monaco Editor integration
- Language switching functionality
- Test execution UI

### Phase 4: Backend Integration (60 min)
- Code execution API
- AI feedback API with OpenAI
- Database integration

### Phase 5: Polish & Testing (60 min)
- UI refinements
- Error handling
- Cross-browser testing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/interview-prep-platform.git
cd interview-prep-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env` file:
```env
DATABASE_URL="file:./dev.db"
```

Create `.env.local` file:
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-openai-api-key"
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

5. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure
```
interview-prep-platform/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── execute/        # Code execution endpoint
│   │   └── feedback/       # AI feedback endpoint
│   ├── problems/           # Problems pages
│   │   ├── [id]/          # Dynamic problem page
│   │   └── page.tsx       # Problems list
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── Navigation.tsx     # Nav bar
│   └── CodeEditor.tsx     # Monaco editor wrapper
├── lib/                   # Utilities
│   └── prisma.ts         # Prisma client
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration files
├── data/                 # Seed data
│   └── problems.ts       # Problem definitions
└── scripts/              # Utility scripts
    └── seed.ts          # Database seeding
```

## 🎨 Key Features Implementation

### Code Execution
- Mock execution with configurable pass/fail rates
- Real-time test result feedback
- Visual test case comparison

### AI Feedback System
- OpenAI GPT-3.5 integration
- Contextual code analysis
- Fallback to mock feedback when API unavailable

### Problem Management
- Prisma ORM for data persistence
- JSON storage for test cases and starter code
- Category and difficulty filtering

## 🔄 Future Enhancements

- [ ] Real code execution with Docker sandboxing
- [ ] User authentication and profiles
- [ ] Submission history tracking
- [ ] Performance analytics dashboard
- [ ] Collaborative problem-solving
- [ ] More programming languages
- [ ] Video explanations for solutions

## 📝 Lessons Learned

### AI-Assisted Development Insights:
1. **Rapid Prototyping**: AI tools accelerate boilerplate and component creation
2. **Context Awareness**: Cursor AI understands project structure for consistent code
3. **Problem-Solving**: AI suggestions for debugging and optimization
4. **Documentation**: Quick generation of comments and documentation

### Technical Decisions:
- **SQLite over PostgreSQL**: Faster local development setup
- **Monaco Editor**: Professional code editing experience
- **Mock Execution First**: Validate UI/UX before complex backend
- **Modular Components**: Easy to extend and maintain

## 🤝 Contributing

This is a portfolio/demonstration project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project for learning and inspiration.

## 👤 Author

**Pratham Roy**
- GitHub: [@prathamroy](https://github.com/prathamroy)
- LinkedIn: [Pratham Roy](https://linkedin.com/in/prathamroy)

---

**Built with ❤️ using AI-powered development tools in under 6 hours**