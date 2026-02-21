import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FileUp,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  X,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mlAPI } from "../utils/api";

export default function UserReportUpload() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'success' | 'error'
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Get user ID from auth state - try multiple paths
  const userId = user?._id || user?.id || user?.userId;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    setUploadStatus(null);
    setUploadResult(null);

    if (!selectedFile) return;

    // Check file type
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus(null);
    setUploadResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    if (!userId) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      console.log("Uploading file for userId:", userId);
      const result = await mlAPI.uploadMedicalRecord(userId, file);
      console.log("Upload result:", result);
      setUploadStatus("success");
      setUploadResult(result);
    } catch (err) {
      console.error("Upload error details:", err);
      setUploadStatus("error");
      setError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <FileUp size={22} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-base">
                Upload Medical Report
              </h1>
              <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Secure AI Analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 mb-8 overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
          <div className="relative flex items-start gap-4 z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-xl bg-blue-600/90 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20 shadow-lg"
            >
              <Sparkles size={24} className="text-white" />
            </motion.div>
            <div>
              <p className="text-gray-900 text-base font-bold mb-2">
                AI-Powered Report Analysis
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Upload your medical reports (lab results, scans, prescriptions) and our AI will analyze them to provide personalized health insights through the chatbot.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => !file && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative bg-white/60 backdrop-blur-xl border-2 border-dashed transition-all duration-300 overflow-hidden shadow-lg ${
            isDragging
              ? "border-blue-600 bg-blue-50/50 shadow-2xl shadow-blue-500/20 scale-[1.02]"
              : file
              ? "border-gray-300 cursor-default"
              : "border-gray-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer group"
          } p-12`}
        >
          {!file && !isDragging && (
            <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/30 transition-all duration-300"></div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="w-20 h-20 rounded-full bg-blue-600/10 backdrop-blur-md flex items-center justify-center mb-5 border border-blue-600/20">
                  <Upload size={32} className="text-blue-600" />
                </div>
                <p className="text-gray-900 font-semibold text-base mb-2">
                  Drop your PDF file here
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  or click to browse from your device
                </p>
                <p className="text-gray-400 text-xs">
                  Maximum file size: 10MB • PDF format only
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={28} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-semibold text-sm truncate">
                    {file.name}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {!isUploading && uploadStatus !== "success" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {uploadStatus === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 size={22} className="text-green-600" />
              <p className="text-green-900 font-semibold text-base">
                Upload Successful!
              </p>
            </div>
            <p className="text-green-700 text-sm">
              Your medical report has been processed. {uploadResult?.total_chunks_created} sections were analyzed and indexed.
            </p>
          </motion.div>
        )}

        {/* Upload Button */}
        {file && uploadStatus !== "success" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleUpload}
            disabled={isUploading}
            className={`w-full mt-6 py-3.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              isUploading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-600/30"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing your report...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload & Analyze Report
              </>
            )}
          </motion.button>
        )}

        {/* Chat CTA after success */}
        {uploadStatus === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-3"
          >
            <button
              onClick={() => navigate("/chat")}
              className="w-full py-3.5 px-4 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <MessageCircle size={18} />
              Ask AI About Your Report
            </button>
            <button
              onClick={handleRemoveFile}
              className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-white/60 backdrop-blur-md border-2 border-gray-300 text-gray-700 hover:bg-white transition-colors"
            >
              Upload Another Report
            </button>
          </motion.div>
        )}

        {/* Guidelines */}
        <div className="mt-8 bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl p-6 shadow-lg">
          <p className="text-gray-900 font-semibold text-base mb-4">
            Supported Report Types
          </p>
          <ul className="space-y-2.5">
            {[
              "Blood test results (CBC, metabolic panels)",
              "Imaging reports (X-rays, MRI, CT scans)",
              "Lab reports and diagnostic tests",
              "Prescription and medication records",
              "Discharge summaries",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-600 text-sm">
                <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
