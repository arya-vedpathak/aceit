import { useCallback, useEffect, useRef, useState } from "react";

function getRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Speech-to-text through the browser's built-in recogniser (Chrome, Edge, Safari).
 * `onFinal` receives each finished phrase; `interim` is the live, still-changing text.
 */
export function useSpeech(onFinal) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const recRef = useRef(null);
  const callback = useRef(onFinal);

  useEffect(() => {
    callback.current = onFinal;
  }, [onFinal]);

  const supported = Boolean(getRecognition());

  const start = useCallback(() => {
    const Recognition = getRecognition();
    if (!Recognition) return;
    setError("");
    const rec = new Recognition();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let live = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) callback.current(result[0].transcript);
        else live += result[0].transcript;
      }
      setInterim(live);
    };
    rec.onerror = (event) => {
      if (event.error === "not-allowed") setError("Microphone permission was denied.");
      else if (event.error !== "no-speech" && event.error !== "aborted") setError("Speech recognition stopped. Tap the mic to retry.");
    };
    rec.onend = () => {
      setListening(false);
      setInterim("");
    };
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => recRef.current?.stop(), []);

  useEffect(() => () => recRef.current?.abort?.(), []);

  return { supported, listening, interim, error, start, stop };
}
