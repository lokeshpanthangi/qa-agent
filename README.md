# QA Agent - Intelligent Chat Assistant

A modern, responsive chat application powered by **Gemini 1.5 Flash AI** with advanced image processing capabilities. Built with React, TypeScript, and Tailwind CSS for a seamless user experience.

## ✨ Features

### 🤖 AI-Powered Conversations
- **Gemini 1.5 Flash Integration**: Natural language processing with context awareness
- **Conversation History**: Maintains context across multiple exchanges
- **Smart Responses**: Detailed, helpful answers with complete session context retention

### 🖼️ Advanced Image Analysis
- **Drag & Drop Upload**: Seamlessly upload images for analysis
- **Image URL Support**: Add images from URLs with pin button
- **Multi-Image Support**: Analyze multiple images simultaneously (files + URLs)
- **Format Support**: PNG, JPG, JPEG, WebP, GIF, SVG (up to 20MB per image)
- **Visual Q&A**: Ask questions about uploaded images and web images
- **Intelligent Conversation**: Maintains full context across entire chat session
- **Interactive Image Previews**: Hover effects with download, fullscreen, and external link options
- **URL Validation**: Real-time validation of image URLs before adding

### 🎨 Modern Interface
- **Full-Page Layout**: Utilizes entire viewport for maximum usability
- **Contractable Sidebar**: Claude.ai-inspired sidebar with chat history
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Smooth Animations**: 300ms transitions throughout the interface
- **Auto-Scroll**: Automatically scrolls to latest messages
- **Smart UX Features**: Interactive image hover effects and seamless scrolling

### 🛠️ Developer Experience
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Environment Configuration**: Secure API key management
- **Loading States**: Visual feedback during AI processing

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- Google AI Studio account for Gemini API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create environment file
   cp .env.example .env
   
   # Add your Gemini API key to .env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:8080`

## 🔧 Environment Setup

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new key
4. Copy the API key (starts with `AIza...`)
5. Add it to your `.env` file

For detailed setup instructions, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

## 🏗️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Icons**: Lucide React

## 📱 Interface Components

### Layout System
- **Header**: Menu toggle, branding, and API status indicator
- **Sidebar**: Chat history, new chat button, and settings
- **Main Chat**: Message display with auto-scroll
- **Input Area**: Text input, file upload, and send controls

### Responsive Behavior
- **Desktop**: Full sidebar with dynamic main area resizing
- **Mobile**: Overlay sidebar with backdrop blur
- **Tablet**: Adaptive layout based on screen size

## 🎯 Core Features

### Chat Functionality
- Real-time message exchange with Gemini AI
- Conversation context preservation
- Message history and threading
- Error handling with user feedback

### Image URL Feature
- **Pin Button**: Click the pin icon next to the file upload button
- **URL Input**: Enter any valid image URL (JPG, PNG, GIF, WebP, SVG)
- **Auto-Validation**: Real-time validation ensures the URL is accessible
- **Mixed Analysis**: Combine uploaded files with web images in one conversation
- **Full Context Retention**: All images and conversations remembered throughout session
- **Preview & Actions**: View, download, or open images in new tabs
- **Error Handling**: Clear feedback if images fail to load

### Image Processing
- Drag-and-drop image upload with immediate processing
- Pin button for adding image URLs from web sources
- Interactive image previews with hover effects and fullscreen view
- Multiple image analysis with complete context retention (mixed files and URLs)
- File size validation (20MB limit) and URL validation
- Download functionality for uploaded images and web images
- External link access for URL-based images
- Full conversation context preserved across all image interactions

### User Experience
- Smooth scroll to latest messages with full scrollable interface
- Auto-resizing text input with overflow scrolling
- Loading indicators during AI processing
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Interactive image hover effects with elegant popups
- Professional animations and transitions
- Complete conversation context preservation throughout session

## 🔒 Security & Privacy

- API keys stored in environment variables
- No sensitive data in client-side code
- Secure file upload handling
- Rate limiting awareness

## 📈 Performance Features

- Lazy loading for optimal performance
- Memoized components where appropriate
- Efficient re-rendering strategies
- Conversation history optimization

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Options
- Deploy to Vercel, Netlify, or any static hosting service
- Ensure environment variables are configured in your deployment platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
2. Review the browser console for error messages
3. Verify your API key configuration
4. Ensure your internet connection is stable

## 🙏 Acknowledgments

- [Google AI Studio](https://aistudio.google.com/) for Gemini API access
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for consistent iconography
