"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AppNavbar from "./AppNavbar";

const SkinDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GEMINI_API_KEY
  );

  const handleChange = (file) => {
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Image must be under 4MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAnalysis(null);
  };

  const fileToGenerativePart = async (file) => {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: base64,
        mimeType: file.type,
      },
    };
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const imagePart = await fileToGenerativePart(image);

      const response = await model.generateContent([
        imagePart,
        {
          text: `
Analyze this skin image and respond in the following STRICT format:

Observation:
<One paragraph describing what is visible>

Explanation:
<One paragraph explaining what it might indicate>

Possible Causes:
- cause 1
- cause 2
- cause 3

Use simple, non-medical language.
Do not add extra sections.
`,
        },
      ]);

      const text = response.response.text();

      const observation =
        text.split("Observation:")[1]?.split("Explanation:")[0]?.trim() || "";

      const explanation =
        text.split("Explanation:")[1]?.split("Possible Causes:")[0]?.trim() || "";

      const causesText =
        text.split("Possible Causes:")[1]?.trim() || "";

      const causes = causesText
        .split("\n")
        .map((c) => c.replace("-", "").trim())
        .filter(Boolean);

      setAnalysis({ observation, explanation, causes });

    } catch (err) {
      console.error(err);
      alert("Error analyzing image. Check console.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AppNavbar />

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-60px)]">
        {/* LEFT PANEL */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-white/50 backdrop-blur-lg md:border-r md:border-white/60">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
            AI Skin Analyzer
          </h1>
          <p className="text-blue-600 mb-8 text-sm md:text-base">
            Upload a skin image to get simple, AI-powered insights about possible conditions.
          </p>

          <div className="space-y-5">
            <div className="bg-blue-50/60 backdrop-blur-md rounded-xl p-5 border border-blue-100/50 shadow-sm">
              <h3 className="font-semibold text-blue-900 text-sm mb-3">How to use</h3>
              <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1.5">
                <li>Upload a clear photo of the affected skin area</li>
                <li>Click &quot;Analyze Image&quot;</li>
                <li>Review the AI-generated insights</li>
              </ul>
            </div>

            <div className="bg-blue-50/60 backdrop-blur-md rounded-xl p-5 border border-blue-100/50 shadow-sm">
              <h3 className="font-semibold text-blue-900 text-sm mb-3">Tips for best results</h3>
              <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1.5">
                <li>Use good lighting</li>
                <li>Keep the camera focused</li>
                <li>Avoid filters or heavy editing</li>
              </ul>
            </div>

            <div className="bg-blue-100/50 backdrop-blur-md border border-blue-200/50 p-5 rounded-xl text-sm text-blue-800 shadow-sm">
              ⚠️ This tool provides informational insights only and is not a medical diagnosis.
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-white/30 backdrop-blur-md">
          <div className="max-w-xl mx-auto w-full">
            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition bg-white/60 backdrop-blur-xl shadow-lg">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-contain rounded-2xl p-2"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="text-4xl opacity-60">📷</div>
                  </div>
                  <p className="font-medium text-gray-900 text-base">
                    Click to upload skin image
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    PNG, JPG, JPEG • Max 4MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleChange(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 w-full py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/30"
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>

            {analysis && (
              <div className="mt-8 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">🩺 Skin Analysis</h3>
                <p className="text-gray-800 mb-4 leading-relaxed">{analysis.observation}</p>
                <p className="text-gray-800 mb-4 leading-relaxed">{analysis.explanation}</p>
                {analysis.causes.length > 0 && (
                  <>
                    <h4 className="font-semibold text-blue-900 mb-3">Possible Causes</h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      {analysis.causes.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinDetection;