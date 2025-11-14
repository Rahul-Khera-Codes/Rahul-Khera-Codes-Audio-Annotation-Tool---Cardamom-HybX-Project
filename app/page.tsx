'use client';

import { useState } from 'react';

interface SpeechDeliveryTag {
  before: string;
  tag: string;
}

interface AnnotationResult {
  voiceCharacteristics: string;
  speakingStyle: string;
  speechDelivery: SpeechDeliveryTag[];
}

export default function Home() {
  const [referenceTranscript, setReferenceTranscript] = useState('');
  const [annotationTranscript, setAnnotationTranscript] = useState('');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnnotationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/annotate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceTranscript,
          annotationTranscript,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate annotations');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Failed to copy text:', err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Audio Annotation Tool
          </h1>
          <p className="text-gray-600 mb-6">
            Cardamom HybX Project - Generate comparative annotations for audio transcripts
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
            {/* Language Selection */}
            <div suppressHydrationWarning>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2" suppressHydrationWarning>
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
              >
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="italian">Italian</option>
              </select>
            </div>

            {/* Reference Audio Transcript */}
            <div suppressHydrationWarning>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2" suppressHydrationWarning>
                Reference Audio Transcript
              </label>
              <textarea
                id="reference"
                value={referenceTranscript}
                onChange={(e) => setReferenceTranscript(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black resize-none"
                placeholder="Enter the reference audio transcript..."
                required
              />
            </div>

            {/* Annotation Audio Transcript */}
            <div suppressHydrationWarning>
              <label htmlFor="annotation" className="block text-sm font-medium text-gray-700 mb-2" suppressHydrationWarning>
                Annotation Audio Transcript
              </label>
              <textarea
                id="annotation"
                value={annotationTranscript}
                onChange={(e) => setAnnotationTranscript(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-black"
                placeholder="Enter the annotation audio transcript..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating Annotations...' : 'Generate Annotations'}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Voice Characteristics */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Voice Characteristics (variation description)
                </h2>
                <button
                  onClick={() => handleCopy(result.voiceCharacteristics)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{result.voiceCharacteristics}</p>
              </div>
            </div>

            {/* Speaking Style */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Speaking Style</h2>
                <button
                  onClick={() => handleCopy(result.speakingStyle)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{result.speakingStyle}</p>
              </div>
            </div>

            {/* Details of Speech Delivery */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Details of Speech Delivery
                </h2>
                <button
                  onClick={() => handleCopy(
                    result.speechDelivery
                      .map((tag) => `Before ${tag.before}\n${tag.tag}`)
                      .join('\n\n')
                  )}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Copy All
                </button>
              </div>
              <div className="space-y-4">
                {result.speechDelivery.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">
                        Before <span className="text-indigo-600">{tag.before}</span>
                      </span>
                      <button
                        onClick={() => handleCopy(`Before ${tag.before}\n${tag.tag}`)}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-gray-700">{tag.tag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
