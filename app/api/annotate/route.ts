import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Language-specific forbidden words and guidelines
const languageGuidelines = {
  english: {
    forbidden: [],
    avoid: ['general descriptions', 'templates', 'patterns'],
  },
  french: {
    forbidden: ['La voix', 'La résonance', "L'expression", 'Le ton'],
    avoid: ['descriptions générales', 'modèles', 'motifs'],
  },
  italian: {
    forbidden: [],
    avoid: ['descrizioni generali', 'modelli', 'pattern'],
  },
};

export async function POST(request: NextRequest) {
  try {
    const { referenceTranscript, annotationTranscript, language } = await request.json();

    if (!referenceTranscript || !annotationTranscript) {
      return NextResponse.json(
        { error: 'Both reference and annotation transcripts are required' },
        { status: 400 }
      );
    }

    const lang = language?.toLowerCase() || 'english';
    const guidelines = languageGuidelines[lang as keyof typeof languageGuidelines] || languageGuidelines.english;

    // Create a comprehensive prompt based on the guidelines
    const systemPrompt = `You are an expert audio annotation specialist for the Cardamom HybX project. Your task is to create annotations that compare the Annotation Audio to the Reference Audio.

CRITICAL REQUIREMENTS:
1. Use COMPARATIVE language - describe differences, not general descriptions of a single audio
2. Use natural language - NO patterns, NO templates, NO general descriptions
3. Focus ONLY on differences between the two audios
4. Voice Characteristics: 25-35 words describing differences in voice properties (pitch, timbre, articulation, etc.)
5. Speaking Style: 25-35 words describing differences in delivery style (pace, tone, emotion, etc.)
6. Details of Speech Delivery: Up to 5 tags placed BEFORE specific words in the annotation transcript, describing notable speech events

${lang === 'french' ? `FORBIDDEN WORDS IN FRENCH (always replace these):
- "La voix" → use descriptive alternatives
- "La résonance" → use descriptive alternatives  
- "L'expression" → use descriptive alternatives
- "Le ton" → use descriptive alternatives` : ''}

Output format:
- Voice Characteristics: A comparative description (25-35 words)
- Speaking Style: A comparative description (25-35 words)
- Details of Speech Delivery: Up to 5 tags in format "Before [word]: [description]"`;

    const userPrompt = `Reference Audio Transcript:
${referenceTranscript}

Annotation Audio Transcript:
${annotationTranscript}

Language: ${lang}

Analyze the differences between the Annotation Audio and Reference Audio. Generate annotations that:
1. Compare differences (not describe a single audio)
2. Use natural, varied language (no templates or patterns)
3. Focus on what makes the annotation audio different from the reference

Output in JSON format:
{
  "voiceCharacteristics": "A comparative description (25-35 words) focusing on differences in voice properties like pitch, timbre, resonance, articulation, stability, etc. Use comparative language (more/less, higher/lower, etc.)",
  "speakingStyle": "A comparative description (25-35 words) focusing on differences in delivery style like pace, rhythm, emotional tone, formality, volume dynamics, etc. Use comparative language.",
  "speechDelivery": [
    {"before": "word_from_annotation_transcript", "tag": "short_description_of_speech_event"},
    {"before": "another_word", "tag": "another_description"}
  ]
}

IMPORTANT:
- speechDelivery should contain up to 5 tags maximum
- Each tag's "before" field must be a word that actually appears in the Annotation Audio Transcript
- Tags should describe notable speech events (emphasis, pauses, emotional changes, etc.)
- Use short, descriptive tags (not full sentences)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const annotations = JSON.parse(response);

    return NextResponse.json(annotations);
  } catch (error: any) {
    console.error('Error generating annotations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate annotations' },
      { status: 500 }
    );
  }
}

