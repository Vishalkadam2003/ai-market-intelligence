import { useState } from "react";
import { API } from "../utils/backend";

function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setResponse("");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);

      API.post("/voice/query", { query: text })
        .then((res) => setResponse(res.data.answer))
        .catch(() => setResponse("Error understanding your query."));
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return (
    <div className="mt-8 bg-white p-4 rounded shadow max-w-2xl">
      <h2 className="text-xl font-bold mb-3">🎤 Voice Financial Assistant</h2>

      <button
        onClick={startListening}
        className={`px-4 py-2 rounded text-white ${
          listening ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        {listening ? "Listening..." : "Start Speaking"}
      </button>

      <p className="mt-4 text-gray-700">
        <strong>You said:</strong> {transcript}
      </p>

      <p className="mt-4 text-blue-800 font-semibold">{response}</p>
    </div>
  );
}

export default VoiceAssistant;
