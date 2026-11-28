import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Command,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  BookOpen,
  LayoutDashboard,
  FileCheck2,
  Briefcase,
  Users,
  User,
  HelpCircle,
} from 'lucide-react';

export default function VoiceNavigator() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Click microphone or speak a command');
  const [lastAction, setLastAction] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [browserSpeechSupported, setBrowserSpeechSupported] = useState(true);
  const [activeLang, setActiveLang] = useState('hi-IN'); // Default to Hindi-English bilingual

  const recognitionRef = useRef(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = activeLang;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('Listening... Speak now ("open quiz", "trending skills")');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setStatusMessage('Microphone access blocked. Use the sample action buttons below!');
        } else {
          setStatusMessage(`Speech error (${event.error}). Try again or click a sample button.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically classify once speech ends if transcript exists
        setTranscript((latestTranscript) => {
          if (latestTranscript && latestTranscript.trim()) {
            handleClassifyIntent(latestTranscript.trim());
          }
          return latestTranscript;
        });
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Could not initialize speech recognition:', err);
      setBrowserSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [activeLang]);

  // Text to Speech Output using Web Speech Synthesis
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = activeLang;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
      setIsSpeaking(false);
    }
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
    } else {
      setTranscript('');
      setStatusMessage('Starting microphone...');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = activeLang;
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Error starting speech recognition:', e);
          setIsListening(false);
        }
      } else {
        setStatusMessage('Browser speech recognition not available. Click a button below!');
      }
    }
  };

  // Send speech transcript to backend /api/voice/intent
  const handleClassifyIntent = async (commandText) => {
    setStatusMessage('Analyzing intent with Gemini...');
    try {
      const res = await axios.post('/api/voice/intent', {
        command: commandText,
        language: activeLang,
      });

      if (res.data) {
        const { action, route, tts_speech, allowed } = res.data;
        setLastAction(res.data);
        setStatusMessage(`Recognized: ${action}`);

        // 1. Text-to-Speech Output
        if (tts_speech) {
          speakText(tts_speech);
        }

        // 2. Navigation if route is assigned
        if (route) {
          setTimeout(() => {
            navigate(route);
            setIsOpen(false);
          }, 1200);
        }
      }
    } catch (err) {
      console.warn('Voice intent error, executing local action fallback:', err);
      // Local fallback
      const lower = commandText.toLowerCase();
      if (lower.includes('test') || lower.includes('quiz')) {
        speakText('Opening skill assessment test.');
        navigate('/fresher/test');
        setIsOpen(false);
      } else if (lower.includes('trending') || lower.includes('skill')) {
        speakText('Currently in high demand are FastAPI, Docker, React, and Vector Search.');
      } else if (lower.includes('prepare') || lower.includes('practice')) {
        speakText('Opening practice and preparation portal.');
        navigate('/fresher/prepare');
        setIsOpen(false);
      } else if (lower.includes('dashboard')) {
        speakText('Opening dashboard.');
        navigate('/dashboard');
        setIsOpen(false);
      }
    }
  };

  const sampleButtons = [
    { label: '🧪 "Open Quiz"', command: 'take test', desc: 'Open Skill Quizzes' },
    { label: '📈 "Trending Skills"', command: 'trending skills', desc: 'Listen to Trending Skills (TTS)' },
    { label: '📚 "Prepare Page"', command: 'prepare page', desc: 'Open Practice & Prepare' },
    { label: '📊 "Open Dashboard"', command: 'open dashboard', desc: 'Candidate Dashboard' },
    { label: '📜 "Open Evidence"', command: 'open evidence', desc: 'Verified Evidence' },
    { label: '💼 "Job Matches"', command: 'job matches', desc: 'Job Match' },
    { label: '👥 "Open Mentors"', command: 'mentorship', desc: 'Mentors & Doubt Box' },
  ];

  return (
    <>
      {/* ── Fixed Floating Voice Trigger Button (Bottom-Right, 44px min target) ── */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Voice Assistant Navigation"
          title="Voice Navigator (Browser Web Speech & Gemini Intent)"
          className={`min-h-[48px] min-w-[48px] px-3.5 py-2.5 rounded-full shadow-lg flex items-center gap-2 font-bold text-xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            isOpen
              ? 'bg-neutral-900 text-white border border-neutral-700'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
          }`}
        >
          <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse text-red-400' : 'text-white'}`} />
          <span className="hidden sm:inline">Voice AI</span>
          {isListening && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>
      </div>

      {/* ── Voice Assistant Modal / Drawer ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="voice-assistant-title"
            className="bg-white border border-neutral-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative animate-in fade-in-90 zoom-in-95"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  <Mic className="w-5 h-5" />
                </span>
                <div>
                  <h2 id="voice-assistant-title" className="text-base font-bold text-neutral-900">
                    Voice Assistant &amp; Navigation
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    Speech-to-Text • Gemini Intent • Web Speech TTS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switch */}
                <select
                  value={activeLang}
                  onChange={(e) => setActiveLang(e.target.value)}
                  className="text-xs bg-neutral-100 border border-neutral-300 rounded px-2 py-1 font-semibold text-neutral-700 focus:outline-none"
                  aria-label="Select speech recognition language"
                >
                  <option value="hi-IN">Hindi (hi-IN)</option>
                  <option value="en-US">English (en-US)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-[36px] min-w-[36px] text-neutral-400 hover:text-black flex items-center justify-center rounded"
                  aria-label="Close Voice Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Microphone Listening Visualizer */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-center space-y-3">
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`min-h-[64px] min-w-[64px] rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-600 text-white ring-4 ring-red-200 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                  {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-neutral-800">
                  {statusMessage}
                </p>
                {transcript && (
                  <div className="mt-2 p-2 bg-white border border-neutral-200 rounded text-xs text-neutral-700 font-mono italic">
                    "{transcript}"
                  </div>
                )}
              </div>

              {/* TTS Status */}
              {isSpeaking && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-blue-600 font-semibold animate-pulse">
                  <Volume2 className="w-4 h-4" />
                  <span>Speaking audio response...</span>
                </div>
              )}
            </div>

            {/* Fixed Allowed Actions & Fallback Buttons */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Quick Voice Commands (Click to simulate or test):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleButtons.map((btn) => (
                  <button
                    key={btn.command}
                    type="button"
                    onClick={() => {
                      setTranscript(btn.command);
                      handleClassifyIntent(btn.command);
                    }}
                    className="min-h-[44px] p-2.5 bg-white hover:bg-blue-50 border border-neutral-200 hover:border-blue-400 rounded-md text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-800 group-hover:text-blue-700">
                        {btn.label}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {btn.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Last Recognized Action Panel */}
            {lastAction && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800">
                    Action: {lastAction.action}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    {lastAction.engine}
                  </span>
                </div>
                <p className="text-emerald-700 text-[11px]">
                  {lastAction.tts_speech}
                </p>
                {lastAction.route && (
                  <div className="text-[10px] text-emerald-600 font-medium">
                    Navigating to: <span className="underline">{lastAction.route}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
