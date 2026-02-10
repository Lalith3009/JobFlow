import React, { createContext, useContext, useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { createClient } from '@supabase/supabase-js';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserAndResume();
  }, []);

  const loadUserAndResume = async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        setIsLoading(false);
        return;
      }
      
      setUser(currentUser);

      if (currentUser) {
        const { data: resumes, error: resumeError } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (resumeError) {
          console.error('Error loading resume:', resumeError);
        } else if (resumes && resumes.length > 0) {
          const resume = resumes[0];
          setResumeText(resume.content || '');
          setResumeFileName(resume.name || '');
          setResumeId(resume.id);
          console.log('Resume loaded:', resume.name);

          // Sync to localStorage so the browser extension can pick it up
          try {
            if (resume.content) {
              localStorage.setItem('jf_resume', resume.content);
              localStorage.setItem('jf_resume_name', resume.name || '');
              const ext = JSON.parse(localStorage.getItem('jobflow_ext') || '{}');
              ext.resume = resume.content;
              localStorage.setItem('jobflow_ext', JSON.stringify(ext));
            }
          } catch (e) {
            console.error('LocalStorage sync failed:', e);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load user and resume:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResumeToSupabase = async (text, name) => {
    if (!supabase) {
      setError('Supabase is not configured');
      return false;
    }

    if (!user) {
      setError('Please log in to save your resume');
      return false;
    }

    if (!text || text.trim().length < 50) {
      setError('Resume text is too short or empty');
      return false;
    }

    try {
      const resumeData = {
        user_id: user.id,
        name: name || 'resume.txt',
        content: text.trim(),
        updated_at: new Date().toISOString()
      };

      let result;
      if (resumeId) {
        result = await supabase
          .from('resumes')
          .update(resumeData)
          .eq('id', resumeId)
          .select();
      } else {
        result = await supabase
          .from('resumes')
          .insert([resumeData])
          .select();
      }

      if (result.error) {
        throw result.error;
      }

      if (result.data && result.data.length > 0) {
        setResumeId(result.data[0].id);
        console.log('Resume saved successfully:', result.data[0].name);
      }

      return true;
    } catch (err) {
      console.error('Failed to save resume to Supabase:', err);
      setError('Failed to save resume: ' + err.message);
      return false;
    }
  };

  const saveResume = async (text, name) => {
    setResumeText(text);
    setResumeFileName(name);
    const success = await saveResumeToSupabase(text, name);
    
    if (success) {
      try {
        localStorage.setItem('jf_resume', text);
        localStorage.setItem('jf_resume_name', name);
        
        const ext = JSON.parse(localStorage.getItem('jobflow_ext') || '{}');
        ext.resume = text;
        localStorage.setItem('jobflow_ext', JSON.stringify(ext));
      } catch (e) {
        console.error('LocalStorage save failed:', e);
      }
    }
    
    return success;
  };

  const extractPdfText = async (arrayBuffer) => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => {
            const str = item.str || '';
            return str.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ').trim();
          })
          .filter(Boolean)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. The file may be scanned or image-based.');
    }
  };

  const extractDocxText = async (arrayBuffer) => {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value
        .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Failed to extract text from DOCX file.');
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    setIsProcessing(true);
    setError('');

    try {
      let text = '';
      const arrayBuffer = await file.arrayBuffer();
      const type = file.type || '';
      const name = file.name.toLowerCase();

      if (type === 'application/pdf' || name.endsWith('.pdf')) {
        text = await extractPdfText(arrayBuffer);
      } 
      else if (
        type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        name.endsWith('.docx')
      ) {
        text = await extractDocxText(arrayBuffer);
      } 
      else if (type === 'text/plain' || name.endsWith('.txt')) {
        text = await file.text();
        text = text
          .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, '\n')
          .trim();
      } 
      else {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
      }

      const cleanText = text
        .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();

      if (!cleanText || cleanText.length < 50) {
        throw new Error('No readable text found in file. It might be an image-based PDF or empty document.');
      }

      console.log('Extracted text length:', cleanText.length);
      await saveResume(cleanText, file.name);
      return cleanText;

    } catch (err) {
      console.error('File processing error:', err);
      setError(err.message || 'Failed to parse file');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResume = async () => {
    if (resumeId && user && supabase) {
      try {
        await supabase
          .from('resumes')
          .delete()
          .eq('id', resumeId);
        console.log('Resume deleted from Supabase');
      } catch (err) {
        console.error('Failed to delete resume:', err);
      }
    }
    
    setResumeText('');
    setResumeFileName('');
    setResumeId(null);
    setError('');
    
    try {
      localStorage.removeItem('jf_resume');
      localStorage.removeItem('jf_resume_name');
    } catch (e) {
      console.error('LocalStorage clear failed:', e);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeText,
        resumeFileName,
        isProcessing,
        isLoading,
        error,
        user,
        processFile,
        saveResume,
        clearResume,
        refreshResume: loadUserAndResume
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};