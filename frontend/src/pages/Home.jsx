import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, Download, ArrowRight, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { parseExcelFile } from '../services/excelParser';
import { apiService } from '../services/api';
import { validateFile, validateExcelData } from '../utils/validation';
import { formatFileSize, formatQualityScore, getQualityLevel, downloadFile } from '../utils/helpers';

const Home = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [calendar, setCalendar] = useState(null);
  const [weekNumber, setWeekNumber] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) await processFile(droppedFile);
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) await processFile(selectedFile);
  };

  const processFile = async (selectedFile) => {
    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      toast.error(validation.errors.join(', '));
      return;
    }

    setFile(selectedFile);
    
    try {
      const data = await parseExcelFile(selectedFile);
      const dataValidation = validateExcelData(data);
      
      if (!dataValidation.valid) {
        toast.error(dataValidation.errors.join(', '));
        setFile(null);
        return;
      }
      
      setParsedData(data);
      toast.success('FILE PARSED SUCCESSFULLY', { icon: '⚡' });
    } catch (error) {
      toast.error('PARSE ERROR: ' + error.message);
      setFile(null);
    }
  };

  const handleGenerate = async (week = 1) => {
    if (!parsedData) {
      toast.error('UPLOAD FILE FIRST');
      return;
    }

    setIsGenerating(true);
    setProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 2000);

      const result = await apiService.generateCalendar({
        ...parsedData,
        weekNumber: week,
      });

      clearInterval(progressInterval);
      setProgress(100);

      console.log('API Response:', result); // Debug log
      
      setCalendar(result);
      setWeekNumber(week);
      toast.success(`WEEK ${week} GENERATED`, { icon: '🔥' });
    } catch (error) {
      console.error('Generation error:', error); // Debug log
      toast.error('GENERATION FAILED: ' + error.message);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!calendar) return;
    try {
      const blob = await apiService.downloadExcel(calendar.sessionId || 'calendar');
      downloadFile(blob, `reddit_calendar_week_${weekNumber}.xlsx`);
      toast.success('DOWNLOADED', { icon: '⬇️' });
    } catch (error) {
      toast.error('DOWNLOAD FAILED');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 grain">
      {/* Header */}
      <header className="border-b-4 border-dark-700 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">⚡</div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  REDDIT <span className="text-neon-orange">MASTERMIND</span>
                </h1>
                <p className="text-sm text-gray-400 uppercase tracking-widest">
                  AI Content Generator
                </p>
              </div>
            </div>
            <a 
              href="https://github.com/yourusername/reddit-mastermind" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-neon-orange transition-colors"
            >
              <Github size={28} />
            </a>
          </div>
        </div>
      </header>

      <div className="container-custom py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-7xl md:text-9xl font-bold mb-6 leading-none">
            AUTHENTIC<br />
            <span className="text-gradient">REDDIT CONTENT</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl">
            Upload Excel → Generate calendar → Download results. 
            AI-powered posts that look 100% human.
          </p>
        </motion.div>

        {/* Upload Section */}
        {!file && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <div className="brutal-card p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-4xl font-bold mb-2">STEP 01</h3>
                  <p className="text-xl text-gray-400">UPLOAD EXCEL FILE</p>
                </div>
                <div className="px-4 py-2 bg-neon-orange text-dark-950 font-mono font-bold">
                  REQUIRED
                </div>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`upload-brutal p-16 cursor-pointer transition-all ${
                  isDragging ? 'active' : ''
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="text-center">
                  <Upload size={64} className="mx-auto mb-6 text-neon-orange" />
                  <p className="text-2xl font-bold mb-2">DROP FILE HERE</p>
                  <p className="text-gray-400 mb-6">or click to browse</p>
                  <div className="inline-block px-6 py-3 border-2 border-white">
                    <span className="font-mono">.XLSX / .XLS / MAX 10MB</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 border-l-4 border-neon-cyan bg-neon-cyan/5">
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-neon-cyan">REQUIRED FORMAT:</span> Excel file with Company, Personas, and Keywords sections
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* File Info */}
        {file && !calendar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="brutal-card p-8 border-neon-orange">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-neon-orange flex items-center justify-center">
                    <Upload size={32} className="text-dark-950" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl">{file.name}</p>
                    <p className="text-gray-400 font-mono">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setParsedData(null);
                  }}
                  className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  REMOVE
                </button>
              </div>

              {parsedData && !isGenerating && (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-dark-800 border-4 border-dark-700">
                      <p className="text-sm text-gray-400 mb-2 uppercase">Company</p>
                      <p className="text-3xl font-bold">{parsedData.company.name}</p>
                    </div>
                    <div className="p-6 bg-dark-800 border-4 border-dark-700">
                      <p className="text-sm text-gray-400 mb-2 uppercase">Personas</p>
                      <p className="text-3xl font-bold text-neon-cyan">{parsedData.personas.length}</p>
                    </div>
                    <div className="p-6 bg-dark-800 border-4 border-dark-700">
                      <p className="text-sm text-gray-400 mb-2 uppercase">Keywords</p>
                      <p className="text-3xl font-bold text-accent-purple">{parsedData.keywords.length}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerate(1)}
                    className="btn btn-primary w-full text-2xl py-6"
                  >
                    <span><Zap size={28} /> GENERATE WEEK 1</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <div className="brutal-card p-12 text-center">
              <div className="mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-8 border-dark-700 border-t-neon-orange mx-auto mb-6"
                />
                <h3 className="text-4xl font-bold mb-4">GENERATING CONTENT</h3>
                <p className="text-xl text-gray-400">AI is working its magic...</p>
              </div>

              <div className="progress-brutal max-w-2xl mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="progress-fill"
                />
              </div>
              <p className="font-mono text-2xl mt-4">{progress}%</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {calendar && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="brutal-card p-8 mb-8 border-accent-green">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-5xl font-bold mb-2">WEEK {weekNumber} COMPLETE</h3>
                  <p className="text-xl text-gray-400">
                    {calendar.posts?.length || 0} POSTS · {calendar.totalComments || 0} COMMENTS
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 uppercase mb-2">Avg Quality</p>
                  <p className="text-6xl font-mono font-bold text-accent-green">
                    {formatQualityScore(
                      calendar.posts?.reduce((sum, p) => sum + (p.quality_score || 0), 0) / 
                      (calendar.posts?.length || 1)
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={handleDownload}
                  className="btn btn-primary text-xl py-6"
                >
                  <span><Download size={24} /> DOWNLOAD EXCEL</span>
                </button>
                <button
                  onClick={() => handleGenerate(weekNumber + 1)}
                  className="btn btn-outline text-xl py-6"
                >
                  <span>WEEK {weekNumber + 1} <ArrowRight size={24} /></span>
                </button>
                <button
                  onClick={() => {
                    setCalendar(null);
                    setFile(null);
                    setParsedData(null);
                    setWeekNumber(1);
                    toast.success('RESET TO START', { icon: '🔄' });
                  }}
                  className="btn btn-outline text-xl py-6"
                >
                  <span>DONE</span>
                </button>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calendar.posts?.map((post, index) => (
                <motion.div
                  key={post.post_id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="post-card"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="quality-badge quality-high">
                      {formatQualityScore(post.quality_score || 0)}
                    </span>
                    <span className="px-2 py-1 bg-dark-800 text-xs font-mono">
                      {post.subreddit}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold mb-3">{post.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    {post.body?.substring(0, 120)}...
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    <span>@{post.author}</span>
                    <span>·</span>
                    <span>
                      {calendar.comments?.filter(c => c.post_id === post.post_id).length || 0} replies
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
