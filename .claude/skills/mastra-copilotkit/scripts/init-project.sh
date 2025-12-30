#!/bin/bash
# Mastra + CopilotKit Project Initialization Script
# Usage: ./init-project.sh [project-name]

set -e

PROJECT_NAME=${1:-"mastra-copilotkit-app"}

echo "🚀 Initializing Mastra + CopilotKit project: $PROJECT_NAME"

# Check if directory exists
if [ -d "$PROJECT_NAME" ]; then
  echo "❌ Directory $PROJECT_NAME already exists"
  exit 1
fi

# Create Next.js project
echo "📦 Creating Next.js project..."
npx create-next-app@latest "$PROJECT_NAME" \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm

cd "$PROJECT_NAME"

# Install Mastra dependencies
echo "📦 Installing Mastra dependencies..."
npm install @mastra/core@latest zod

# Install CopilotKit dependencies
echo "📦 Installing CopilotKit dependencies..."
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime

# Install AG-UI Mastra adapter
echo "📦 Installing AG-UI Mastra adapter..."
npm install @ag-ui/mastra

# Optional: Memory support
echo "📦 Installing memory support (optional)..."
npm install @mastra/memory @mastra/libsql || echo "⚠️ Memory packages optional"

# Create directory structure
echo "📁 Creating project structure..."
mkdir -p src/mastra/{agents,tools,workflows}
mkdir -p src/app/api/copilotkit
mkdir -p src/components/chat

# Create .env.local template
echo "📝 Creating .env.local template..."
cat > .env.local << 'EOF'
# AI Provider Keys (choose one or more)
OPENAI_API_KEY=your-openai-key
# ANTHROPIC_API_KEY=your-anthropic-key

# Optional: Remote Mastra Server
# MASTRA_SERVER_URL=http://localhost:4111
EOF

echo ""
echo "✅ Project initialized successfully!"
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_NAME"
echo "  2. Add your API keys to .env.local"
echo "  3. Create your first agent in src/mastra/agents/"
echo "  4. Setup CopilotKit provider in src/app/layout.tsx"
echo "  5. Run: npm run dev"
echo ""
echo "📚 Reference the skill docs for agent and tool examples."
