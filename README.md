# Pichincha AI Onboarding Platform

A modern, multi-agent orchestration system for intelligent client onboarding and verification using Claude AI models, React, TypeScript, and Supabase.

## 🎯 Overview

This platform implements an intelligent onboarding verification system with specialized AI agents:

- **Agente Orquestador** - Orchestrates the entire verification process
- **Agente Verifica Identidad** - Verifies client identity and documents
- **Agente Listas de Riesgo** - Assesses risk factors and compliance issues
- **Agente Documentacion** - Verifies documentation completeness
- **Agente Respuesta Cliente** - Generates professional client communications

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **AI Models**: Claude (Opus, Sonnet, Haiku)
- **Real-time**: Supabase Realtime subscriptions
- **Build Tool**: Vite

### Project Structure

```
pichincha/
├── src/
│   ├── agents/           # AI agent orchestration logic
│   ├── components/       # React components
│   ├── services/         # API clients (Supabase, Claude)
│   ├── stores/           # Zustand state management
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library configurations
│   ├── mcp/              # Model Context Protocol integration
│   ├── rag/              # Retrieval-Augmented Generation
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── supabase/
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
├── public/               # Static assets
├── .env.example          # Environment variables template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Claude API key
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mao2319/pichincha
cd pichincha
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

```env
# Supabase
VITE_SUPABASE_URL=https://db.vhcapsgwemepzvlubtdy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Claude API
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Application
VITE_APP_ENV=development
```

4. **Set up database**

The database schema will be created automatically via Supabase migrations. To manually apply:

```bash
# Using Supabase CLI
supabase db push
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📋 Database Schema

### Tables

#### `prospects`
- User demographic and personal information
- Document verification data
- Financial information

#### `onboarding_requests`
- Status tracking (pending, in_progress, approved, rejected, ambiguous)
- Verification results
- Timestamps

#### `agent_traces`
- Execution logs for each agent
- Input/output data
- Token usage tracking
- Error information

## 🤖 Agent System

### Agent Flow

1. **Prospect Submission** → Form submission with prospect data
2. **Orchestration** → Orchestrator agent analyzes and plans verification
3. **Parallel Verification**:
   - Identity verification
   - Risk assessment
   - Documentation check
4. **Consolidation** → Results combined for final decision
5. **Response Generation** → Professional client communication

### Agent Models

- **Orchestrador**: Claude Opus 5.5 (most capable)
- **Identidad**: Claude Sonnet 5.5 (balanced)
- **Riesgo**: Claude Sonnet 5.5 (balanced)
- **Documentacion**: Claude Haiku 4.5 (fast & efficient)
- **Respuesta**: Claude Sonnet 5.5 (balanced)

## 🔄 Real-time Features

The platform uses Supabase Realtime to:

- Update UI when new requests are created
- Stream agent execution traces
- Synchronize verification results
- Live agent status updates

## 🛡️ Security

- Row-level security (RLS) policies on all tables
- JWT-based authentication via Supabase
- Environment variable encryption
- No sensitive data in client code

## 📊 Available Features

### Sidebar Dashboard
- Real-time agent status monitoring
- Available AI models display
- MCP servers integration status
- RAG configuration info

### Onboarding Form
- Multi-section prospect data collection
- Required field validation
- Real-time form submission
- Processing status indicators

### Request Details Panel
- Prospect information display
- Verification results summary
- Agent execution trace timeline
- Risk factor highlighting

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## 🚢 Deployment

### Vercel Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Supabase Edge Functions

Deploy edge functions:
```bash
supabase functions deploy orchestrate-verification
```

## 📝 API Integration

### Claude API

The platform integrates with Claude API for:
- Prospect analysis
- Identity verification
- Risk assessment
- Decision-making
- Client communication

### Supabase Integration

- PostgreSQL database
- Real-time subscriptions
- Authentication
- Edge functions
- Vector search (pgvector)

## 🔌 MCP Integration

Model Context Protocol servers can be configured for:
- OpenWebUI integration
- Browserbase automation
- GitHub integration
- Custom protocol implementations

## 📚 RAG (Retrieval-Augmented Generation)

Configuration for knowledge base:
- Vector embeddings via pgvector
- Semantic search
- Context enrichment
- Policy validation

## 📞 Support

For issues and feature requests, please open an issue on GitHub.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with Claude AI
- Powered by Supabase
- Styled with Tailwind CSS
- Orchestrated with Zustand
