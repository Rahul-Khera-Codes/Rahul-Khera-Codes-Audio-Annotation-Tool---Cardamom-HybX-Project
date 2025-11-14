# Quick Start Guide

## 🚀 Getting Started

1. **Navigate to the project directory:**
   ```bash
   cd annotation-ui
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 How to Use

1. **Select Language**: Choose English, French, or Italian from the dropdown
2. **Enter Reference Transcript**: Paste the reference audio transcript
3. **Enter Annotation Transcript**: Paste the annotation audio transcript
4. **Generate**: Click "Generate Annotations" button
5. **Review Results**: 
   - Voice Characteristics (25-35 words, comparative)
   - Speaking Style (25-35 words, comparative)
   - Details of Speech Delivery (up to 5 tags)

## 🎯 Example Usage

**Input:**
- Reference Audio Transcript: `Grandma Sarah sat in her cozy armchair, knitting a soft, blue scarf.`
- Annotation Audio Transcript: `"And then, I climbed the tallest tree in the forest and saw the whole world from the top. It was breathtaking."`

**Expected Output:**
- Voice Characteristics: Comparative description of differences
- Speaking Style: Comparative description of delivery differences
- Details of Speech Delivery: Tags before specific words (e.g., "Before climbed: Marked and distinctive accent")

## ⚙️ Configuration

The API key is already configured in `.env.local`. If you need to change it, edit the file:
```
OPENAI_API_KEY=your-key-here
```

## 🐛 Troubleshooting

- **API Errors**: Check that your OpenAI API key is valid and has credits
- **Build Errors**: Run `npm install` again to ensure all dependencies are installed
- **Port Already in Use**: Change the port with `npm run dev -- -p 3001`

