import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2 } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setErrorMsg('');
      return;
    }

    // Attempt browser Web Speech API
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMsg('');
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          if (event.results[current].isFinal) {
            setTimeout(() => {
              onSearch(text);
              onClose();
            }, 600);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          setErrorMsg('Microphone not recognized or permission was denied. Try typing instead!');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();

        return () => {
          try {
            recognition.stop();
          } catch {
            // Ignore
          }
        };
      } catch {
        simulateVoiceListening();
      }
    } else {
      simulateVoiceListening();
    }
  }, [isOpen]);

  const simulateVoiceListening = () => {
    setIsListening(true);
    const demoQueries = ['Coding tutorials', 'Lofi beats', 'Science and space', 'Fireship 100 concepts'];
    const randomQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)];

    const timer = setTimeout(() => {
      setTranscript(randomQuery);
      setIsListening(false);
      setTimeout(() => {
        onSearch(randomQuery);
        onClose();
      }, 700);
    }, 2200);

    return () => clearTimeout(timer);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#212121] text-white p-6 shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2 pb-6">
          <h3 className="text-xl font-medium mb-1">
            {isListening ? 'Listening...' : transcript ? 'Searching for...' : 'Search with your voice'}
          </h3>
          <p className="text-sm text-neutral-400 min-h-6">
            {transcript || (isListening ? 'Say a topic, channel, or video title' : 'Speak into your microphone')}
          </p>

          <div className="relative my-8 flex items-center justify-center">
            {/* Animated pulsating circles */}
            {isListening && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-red-600/20 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full bg-red-600/30 animate-pulse" />
              </>
            )}

            <button
              onClick={() => {
                if (!isListening) simulateVoiceListening();
              }}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                isListening ? 'bg-red-600 text-white scale-110' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {isListening ? <Volume2 className="w-8 h-8 animate-bounce" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          {errorMsg ? (
            <p className="text-xs text-amber-400 mt-2">{errorMsg}</p>
          ) : (
            <p className="text-xs text-neutral-500">
              Microphone permission may be requested in some browsers
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
