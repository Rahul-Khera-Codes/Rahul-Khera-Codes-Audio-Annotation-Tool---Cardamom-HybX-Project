# Audio Annotation Tool - Cardamom HybX Project

A Next.js application for generating comparative audio annotations based on reference and annotation audio transcripts.

## Features

- **Multi-language Support**: English, French, and Italian
- **Comparative Annotations**: Generates Voice Characteristics and Speaking Style descriptions that compare differences between Reference and Annotation audio
- **Speech Delivery Tags**: Creates up to 5 inline tags for notable speech events
- **Clean UI**: Modern, responsive interface built with Tailwind CSS

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open the Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Select the language (English, French, or Italian)
2. Enter the Reference Audio Transcript
3. Enter the Annotation Audio Transcript
4. Click "Generate Annotations"
5. Review and copy the generated:
   - Voice Characteristics (25-35 words, comparative)
   - Speaking Style (25-35 words, comparative)
   - Details of Speech Delivery (up to 5 tags)

## Guidelines

The tool follows Cardamom HybX project guidelines:
- Uses comparative language (not general descriptions)
- Natural language, no patterns or templates
- Focuses on differences between Reference and Annotation audio
- For French: Avoids words like "La voix", "La résonance", "L'expression", "Le ton"

## Project Structure

```
annotation-ui/
├── app/
│   ├── api/
│   │   └── annotate/
│   │       └── route.ts    # API endpoint for OpenAI integration
│   ├── page.tsx            # Main UI component
│   └── layout.tsx          # Root layout
├── .env.local              # Environment variables (create this)
└── package.json
```

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- OpenAI API
