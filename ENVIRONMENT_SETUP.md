# Environment Setup Guide

## QA Agent - Gemini AI Integration

This guide will help you set up the QA Agent chat application with Gemini 1.5 Flash AI integration.

## Prerequisites

1. **Node.js** (version 16 or higher)
2. **Google AI Studio Account** for Gemini API access

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API Key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy the API key (starts with `AIza...`)

## Environment Configuration

### Step 1: Create Environment File

Create a `.env` file in the root directory of your project:

```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Add Your API Key

Open the `.env` file and add your Gemini API key:

```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_actual_api_key_here

# Application Configuration
VITE_APP_NAME=QA Agent
VITE_APP_VERSION=1.0.0
```

**Important**: Replace `your_actual_api_key_here` with your actual Gemini API key.

### Step 3: Verify Configuration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser
3. Look for the status indicator in the header:
   - **Green dot + "AI Connected"**: Configuration successful
   - **Yellow dot + "API Setup Needed"**: Configuration needed

## Features Enabled with API Configuration

### Text Conversations
- Natural language processing
- Context-aware responses
- Conversation history

### Image Analysis
- Upload and analyze images (PNG, JPG, JPEG, WebP)
- Ask questions about uploaded images
- Multiple image support
- Maximum file size: 20MB per image

### Advanced Features
- Conversation context preservation
- Error handling and retry mechanisms
- Loading states and user feedback
- Rate limiting awareness
- Smart question suggestions after image upload
- Interactive image hover effects with fullscreen view
- Contextual question generation based on file types

## Troubleshooting

### Common Issues

#### 1. "API key not configured" message
- Ensure your `.env` file exists in the root directory
- Verify the API key is correctly formatted
- Restart the development server after adding the key

#### 2. API key errors
- Check that your API key is valid and active
- Ensure you have sufficient quota in Google AI Studio
- Verify the key has access to Gemini 1.5 Flash model

#### 3. Image upload issues
- Ensure images are under 20MB
- Supported formats: PNG, JPG, JPEG, WebP, SVG
- Check your internet connection

### Development Tips

1. **Environment Variables**: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the client
2. **API Limits**: Be aware of Google AI Studio rate limits and quotas
3. **Security**: Never commit your `.env` file to version control
4. **Testing**: You can test the interface without API configuration - it will work in demo mode

## API Rate Limits

Google AI Studio has the following limits:
- **Free tier**: 15 requests per minute
- **Paid tier**: Higher limits based on your plan

The application includes built-in error handling for rate limit scenarios.

## Security Best Practices

1. **Never expose your API key** in client-side code or public repositories
2. **Use environment variables** for all sensitive configuration
3. **Regularly rotate your API keys** for enhanced security
4. **Monitor usage** in Google AI Studio dashboard

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key in Google AI Studio
3. Ensure your internet connection is stable
4. Try refreshing the application

For additional help, refer to the [Google AI Studio documentation](https://ai.google.dev/docs). 