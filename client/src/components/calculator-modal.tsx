import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PDFDocument } from "pdf-lib";
import { 
  calculateAge, 
  convertDate, 
  calculateBMI, 
  calculatePercentage, 
  generateRandomNumber, 
  calculateDateDifference, 
  calculateTax, 
  calculateSquareRoot, 
  calculateGPA,
  convertUnits,
  generatePassword,
  encodeText,
  decodeText,
  convertColor,
  generateDetectorCode,
  validateDetectorCode
} from "@/lib/calculations";

interface CalculatorModalProps {
  toolId: string;
  onClose: () => void;
}

interface GPACourse {
  grade: number;
  hours: number;
}

export default function CalculatorModal({ toolId, onClose }: CalculatorModalProps) {
  const [result, setResult] = useState<any>(null);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
  const [gpaCourses, setGpaCourses] = useState<GPACourse[]>([{ grade: 0, hours: 0 }]);
  const [selectedCategory, setSelectedCategory] = useState<string>('length');
  
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  
  const [worldTime, setWorldTime] = useState(new Date());
  const [worldClockInterval, setWorldClockInterval] = useState<NodeJS.Timeout | null>(null);
  const [is24HourFormat, setIs24HourFormat] = useState(true);
  
  const [scientificDisplay, setScientificDisplay] = useState("0");
  const [scientificMemory, setScientificMemory] = useState(0);
  
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchInterval, setStopwatchInterval] = useState<NodeJS.Timeout | null>(null);
  
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<Blob | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [processedSize, setProcessedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("image/jpeg");
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const [qrText, setQrText] = useState("");
  const [qrSize, setQrSize] = useState("medium");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [qrReaderImage, setQrReaderImage] = useState<File | null>(null);
  const [qrReaderPreview, setQrReaderPreview] = useState<string | null>(null);
  const [decodedQrText, setDecodedQrText] = useState<string | null>(null);
  const [isReadingQr, setIsReadingQr] = useState(false);
  const [qrReadError, setQrReadError] = useState<string | null>(null);

  const [pdfMergeFiles, setPdfMergeFiles] = useState<File[]>([]);
  const [pdfSplitFile, setPdfSplitFile] = useState<File | null>(null);
  const [pdfSplitPageCount, setPdfSplitPageCount] = useState<number>(0);
  const [pdfSplitStartPage, setPdfSplitStartPage] = useState<number>(1);
  const [pdfSplitEndPage, setPdfSplitEndPage] = useState<number>(1);
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);
  const [mergedPdfBlob, setMergedPdfBlob] = useState<Blob | null>(null);
  const [splitPdfBlob, setSplitPdfBlob] = useState<Blob | null>(null);

  const [designfyAction, setDesignfyAction] = useState<string>("enhance");
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const { toast } = useToast();

  const getUnitsForCategory = (category: string) => {
    const unitOptions: { [key: string]: Array<{value: string, label: string}> } = {
      length: [
        { value: 'meter', label: 'متر' },
        { value: 'kilometer', label: 'كيلومتر' },
        { value: 'centimeter', label: 'سنتيمتر' },
        { value: 'millimeter', label: 'مليمتر' },
        { value: 'foot', label: 'قدم' },
        { value: 'inch', label: 'بوصة' },
        { value: 'yard', label: 'ياردة' },
        { value: 'mile', label: 'ميل' },
        { value: 'nauticalMile', label: 'ميل بحري' }
      ],
      weight: [
        { value: 'kilogram', label: 'كيلوجرام' },
        { value: 'gram', label: 'جرام' },
        { value: 'pound', label: 'رطل' },
        { value: 'ounce', label: 'أونصة' },
        { value: 'ton', label: 'طن' },
        { value: 'stone', label: 'ستون' }
      ],
      volume: [
        { value: 'liter', label: 'لتر' },
        { value: 'milliliter', label: 'مليلتر' },
        { value: 'gallon', label: 'جالون' },
        { value: 'quart', label: 'كوارت' },
        { value: 'pint', label: 'باينت' },
        { value: 'cup', label: 'كوب' },
        { value: 'fluidOunce', label: 'أونصة سائلة' },
        { value: 'cubicMeter', label: 'متر مكعب' },
        { value: 'cubicCentimeter', label: 'سنتيمتر مكعب' }
      ],
      area: [
        { value: 'squareMeter', label: 'متر مربع' },
        { value: 'squareKilometer', label: 'كيلومتر مربع' },
        { value: 'squareCentimeter', label: 'سنتيمتر مربع' },
        { value: 'squareFoot', label: 'قدم مربع' },
        { value: 'squareInch', label: 'بوصة مربعة' },
        { value: 'squareYard', label: 'ياردة مربعة' },
        { value: 'acre', label: 'فدان' },
        { value: 'hectare', label: 'هكتار' }
      ],
      numbers: [
        { value: 'units', label: 'آحاد' },
        { value: 'tens', label: 'عشرات' },
        { value: 'hundreds', label: 'مئات' },
        { value: 'thousands', label: 'آلاف' },
        { value: 'tenThousands', label: 'عشرات آلاف' },
        { value: 'hundredThousands', label: 'مئات آلاف' },
        { value: 'millions', label: 'ملايين' }
      ],
      temperature: [
        { value: 'celsius', label: 'مئوية (°C)' },
        { value: 'fahrenheit', label: 'فهرنهايت (°F)' },
        { value: 'kelvin', label: 'كلفن (K)' }
      ]
    };
    return unitOptions[category] || [];
  };

  useEffect(() => {
    if (toolId === 'timer') {
      const saved = localStorage.getItem('bmo_timer_state');
      if (saved) {
        try {
          const { remaining, startTime, running } = JSON.parse(saved);
          if (running && startTime) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const newRemaining = Math.max(0, remaining - elapsed);
            if (newRemaining > 0) {
              setTimerRemaining(newRemaining);
              setTimerRunning(true);
              setTimerStartTime(Date.now() - (remaining - newRemaining) * 1000);
            } else {
              localStorage.removeItem('bmo_timer_state');
            }
          }
        } catch (e) {
          console.error('Failed to restore timer state:', e);
          localStorage.removeItem('bmo_timer_state');
        }
      }
    }
    
    if (toolId === 'world-clock') {
      const savedFormat = localStorage.getItem('bmo_clock_format');
      if (savedFormat) {
        setIs24HourFormat(savedFormat === '24');
      }
    }
  }, [toolId]);

  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      localStorage.setItem('bmo_timer_state', JSON.stringify({
        remaining: timerRemaining,
        startTime: timerStartTime || Date.now(),
        running: true
      }));
    } else if (!timerRunning) {
      localStorage.removeItem('bmo_timer_state');
    }
  }, [timerRunning, timerRemaining, timerStartTime]);

  useEffect(() => {
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (worldClockInterval) {
        clearInterval(worldClockInterval);
      }
      if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
      }
    };
  }, [countdownInterval, timerInterval, worldClockInterval, stopwatchInterval]);
  
  useEffect(() => {
    if (toolId === 'world-clock') {
      const interval = setInterval(() => {
        setWorldTime(new Date());
      }, 1000);
      setWorldClockInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [toolId]);

  const handleAgeCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const birthDate = formData.get("birthDate") as string;
    
    if (!birthDate) {
      alert("يرجى إدخال تاريخ الميلاد");
      return;
    }

    const ageResult = calculateAge(birthDate);
    setResult(ageResult);
  };

  const handleDateConversion = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const date = formData.get("date") as string;
    const type = formData.get("type") as string;
    
    if (!date) {
      alert("يرجى إدخال التاريخ");
      return;
    }

    const dateResult = convertDate(date, type);
    setResult(dateResult);
  };

  const handleBMICalculation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const weight = parseFloat(formData.get("weight") as string);
    const height = parseFloat(formData.get("height") as string);
    
    if (!weight || !height || weight <= 0 || height <= 0) {
      alert("يرجى إدخال الوزن والطول بشكل صحيح");
      return;
    }

    const bmiResult = calculateBMI(weight, height);
    setResult(bmiResult);
  };

  const handlePercentageCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const number = parseFloat(formData.get("number") as string);
    const total = parseFloat(formData.get("total") as string);
    
    if (isNaN(number) || isNaN(total) || total === 0) {
      alert("يرجى إدخال أرقام صحيحة");
      return;
    }

    const percentResult = calculatePercentage(number, total);
    setResult(percentResult);
  };

  const handleRandomGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const min = parseInt(formData.get("min") as string);
    const max = parseInt(formData.get("max") as string);
    const count = parseInt(formData.get("count") as string) || 1;
    const allowDuplicates = formData.get("allowDuplicates") === "on";
    const combine = formData.get("combine") === "on";
    
    if (isNaN(min) || isNaN(max) || min >= max) {
      alert("يرجى إدخال حد أدنى وأعلى صحيحين");
      return;
    }

    if (count < 1 || count > 100) {
      alert("يرجى إدخال عدد بين 1 و 100");
      return;
    }

    const randomResult = generateRandomNumber(min, max, count, allowDuplicates, combine);
    setResult(randomResult);
  };

  const playNotificationSound = () => {
    // Create audio context for web audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a pleasant bell sound using oscillators
    const createTone = (frequency: number, duration: number, delay: number = 0) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + delay + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
      
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + duration);
    };
    
    // Play a sequence of bell tones
    createTone(523.25, 0.5, 0);    // C5
    createTone(659.25, 0.5, 0.2);  // E5
    createTone(783.99, 0.8, 0.4);  // G5
  };

  const handleCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const targetDateTime = formData.get("targetDateTime") as string;
    
    if (!targetDateTime) {
      alert("يرجى اختيار تاريخ ووقت");
      return;
    }

    const targetDate = new Date(targetDateTime);
    if (targetDate <= new Date()) {
      alert("يرجى اختيار تاريخ ووقت في المستقبل");
      return;
    }

    if (countdownInterval) clearInterval(countdownInterval);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setResult({ finished: true });
        playNotificationSound();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setResult({ days, hours, minutes, seconds, finished: false });
    }, 1000);

    setCountdownInterval(interval);
  };

  const handleDateDifference = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const date1 = formData.get("date1") as string;
    const date2 = formData.get("date2") as string;
    
    if (!date1 || !date2) {
      alert("يرجى إدخال التاريخين");
      return;
    }

    const diffResult = calculateDateDifference(date1, date2);
    setResult(diffResult);
  };

  const handleTaxCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const taxRate = parseFloat(formData.get("taxRate") as string);
    
    if (isNaN(basePrice) || isNaN(taxRate) || basePrice < 0 || taxRate < 0) {
      alert("يرجى إدخال قيم صحيحة");
      return;
    }

    const taxResult = calculateTax(basePrice, taxRate);
    setResult(taxResult);
  };

  const handleSqrtCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const number = parseFloat(formData.get("number") as string);
    
    if (isNaN(number) || number < 0) {
      alert("يرجى إدخال رقم صحيح (غير سالب)");
      return;
    }

    const sqrtResult = calculateSquareRoot(number);
    setResult(sqrtResult);
  };

  const handleGPACalculation = () => {
    const validCourses = gpaCourses.filter(course => course.grade > 0 && course.hours > 0);
    
    if (validCourses.length === 0) {
      alert("يرجى إدخال درجات وساعات صحيحة لمادة واحدة على الأقل");
      return;
    }

    const gpaResult = calculateGPA(validCourses);
    setResult(gpaResult);
  };

  const addGPACourse = () => {
    setGpaCourses([...gpaCourses, { grade: 0, hours: 0 }]);
  };

  const updateGPACourse = (index: number, field: 'grade' | 'hours', value: number) => {
    const newCourses = [...gpaCourses];
    newCourses[index][field] = value;
    setGpaCourses(newCourses);
  };

  const removeGPACourse = (index: number) => {
    if (gpaCourses.length > 1) {
      setGpaCourses(gpaCourses.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert("يرجى اختيار ملف صورة صحيح");
      return;
    }
    
    setOriginalImage(file);
    setOriginalSize(file.size);
    setProcessedImage(null);
    setProcessedPreview(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalPreview(event.target?.result as string);
      
      const img = new Image();
      img.onload = () => {
        setTargetWidth(img.width);
        setTargetHeight(img.height);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageConvert = async () => {
    if (!originalImage) {
      alert("يرجى اختيار صورة أولاً");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const options = {
        maxSizeMB: 10,
        fileType: selectedFormat,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(originalImage, options);
      setProcessedImage(compressedFile);
      setProcessedSize(compressedFile.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProcessedPreview(event.target?.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error converting image:", error);
      alert("حدث خطأ أثناء تحويل الصورة");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageResize = async () => {
    if (!originalImage) {
      alert("يرجى اختيار صورة أولاً");
      return;
    }
    
    if (targetWidth <= 0 || targetHeight <= 0) {
      alert("يرجى إدخال أبعاد صحيحة");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: Math.max(targetWidth, targetHeight),
        useWebWorker: true
      };
      
      const resizedFile = await imageCompression(originalImage, options);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        if (maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          if (targetWidth / targetHeight > aspectRatio) {
            canvas.width = targetHeight * aspectRatio;
            canvas.height = targetHeight;
          } else {
            canvas.width = targetWidth;
            canvas.height = targetWidth / aspectRatio;
          }
        } else {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            setProcessedImage(blob);
            setProcessedSize(blob.size);
            setProcessedPreview(canvas.toDataURL());
          }
          setIsProcessing(false);
        }, originalImage.type);
      };
      
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(resizedFile);
    } catch (error) {
      console.error("Error resizing image:", error);
      alert("حدث خطأ أثناء تغيير حجم الصورة");
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const url = URL.createObjectURL(processedImage);
    const link = document.createElement('a');
    link.href = url;
    
    const extension = selectedFormat.split('/')[1];
    link.download = `processed-image.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleGenerateQr = async () => {
    if (!qrText.trim()) {
      alert("يرجى إدخال نص أو رابط");
      return;
    }

    try {
      const sizeMap = {
        small: 200,
        medium: 300,
        large: 400
      };
      
      const width = sizeMap[qrSize as keyof typeof sizeMap];
      
      const dataUrl = await QRCode.toDataURL(qrText, {
        width,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("حدث خطأ أثناء إنشاء رمز QR");
    }
  };

  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert("يرجى اختيار ملف صورة صحيح");
      return;
    }
    
    setQrReaderImage(file);
    setDecodedQrText(null);
    setQrReadError(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setQrReaderPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReadQr = async () => {
    if (!qrReaderImage) {
      alert("يرجى اختيار صورة أولاً");
      return;
    }
    
    setIsReadingQr(true);
    setQrReadError(null);
    setDecodedQrText(null);
    
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          ctx?.drawImage(img, 0, 0);
          
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          
          if (imageData) {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              setDecodedQrText(code.data);
              setQrReadError(null);
            } else {
              setQrReadError("لم يتم العثور على رمز QR في الصورة");
            }
          }
          
          setIsReadingQr(false);
        };
        
        img.onerror = () => {
          setQrReadError("حدث خطأ أثناء قراءة الصورة");
          setIsReadingQr(false);
        };
        
        img.src = event.target?.result as string;
      };
      
      reader.readAsDataURL(qrReaderImage);
    } catch (error) {
      console.error("Error reading QR code:", error);
      setQrReadError("حدث خطأ أثناء قراءة رمز QR");
      setIsReadingQr(false);
    }
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return text.startsWith('http://') || text.startsWith('https://');
    }
  };

  const handlePdfMergeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      alert("بعض الملفات ليست PDF. تم تجاهلها.");
    }
    
    setPdfMergeFiles(prev => [...prev, ...pdfFiles]);
    e.target.value = '';
  };

  const removePdfFromMergeList = (index: number) => {
    setPdfMergeFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePdfMerge = async () => {
    if (pdfMergeFiles.length < 2) {
      alert("يرجى رفع ملفين PDF على الأقل للدمج");
      return;
    }
    
    setIsPdfProcessing(true);
    setMergedPdfBlob(null);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of pdfMergeFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      setMergedPdfBlob(blob);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("حدث خطأ أثناء دمج ملفات PDF");
    } finally {
      setIsPdfProcessing(false);
    }
  };

  const handleDownloadMergedPdf = () => {
    if (!mergedPdfBlob) return;
    
    const url = URL.createObjectURL(mergedPdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `merged-pdf-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePdfSplitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert("يرجى اختيار ملف PDF صحيح");
      return;
    }
    
    setPdfSplitFile(file);
    setSplitPdfBlob(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      setPdfSplitPageCount(pageCount);
      setPdfSplitStartPage(1);
      setPdfSplitEndPage(pageCount);
    } catch (error) {
      console.error("Error loading PDF:", error);
      alert("حدث خطأ أثناء قراءة ملف PDF");
      setPdfSplitFile(null);
      setPdfSplitPageCount(0);
    }
  };

  const handlePdfSplit = async () => {
    if (!pdfSplitFile) {
      alert("يرجى رفع ملف PDF أولاً");
      return;
    }
    
    if (pdfSplitStartPage < 1 || pdfSplitEndPage > pdfSplitPageCount || pdfSplitStartPage > pdfSplitEndPage) {
      alert("يرجى إدخال نطاق صفحات صحيح");
      return;
    }
    
    setIsPdfProcessing(true);
    setSplitPdfBlob(null);
    
    try {
      const arrayBuffer = await pdfSplitFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const pageIndices = Array.from(
        { length: pdfSplitEndPage - pdfSplitStartPage + 1 },
        (_, i) => pdfSplitStartPage - 1 + i
      );
      
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });
      
      const splitPdfBytes = await newPdf.save();
      const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
      setSplitPdfBlob(blob);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("حدث خطأ أثناء تقسيم ملف PDF");
    } finally {
      setIsPdfProcessing(false);
    }
  };

  const handleDownloadSplitPdf = () => {
    if (!splitPdfBlob) return;
    
    const url = URL.createObjectURL(splitPdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `split-pdf-pages-${pdfSplitStartPage}-${pdfSplitEndPage}-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleScientificButton = (value: string) => {
    if (value === 'C') {
      setScientificDisplay('0');
    } else if (value === '=') {
      try {
        let expression = scientificDisplay;
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/√\(/g, 'Math.sqrt(');
        expression = expression.replace(/π/g, 'Math.PI');
        expression = expression.replace(/e(?!\d)/g, 'Math.E');
        expression = expression.replace(/\^/g, '**');
        
        const result = eval(expression);
        setScientificDisplay(String(result));
      } catch (e) {
        setScientificDisplay('خطأ');
      }
    } else if (value === '⌫') {
      setScientificDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (value === 'M+') {
      setScientificMemory(parseFloat(scientificDisplay) || 0);
    } else if (value === 'MR') {
      setScientificDisplay(String(scientificMemory));
    } else if (value === 'MC') {
      setScientificMemory(0);
    } else {
      setScientificDisplay(prev => {
        if (prev === '0' || prev === 'خطأ') {
          return value;
        }
        return prev + value;
      });
    }
  };

  const renderCalculator = () => {
    switch (toolId) {
      case "scientific-calculator":
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 text-white p-4 rounded-lg mb-4">
              <div className="text-right text-3xl font-mono overflow-x-auto" data-testid="text-scientific-display">
                {scientificDisplay}
              </div>
              {scientificMemory !== 0 && (
                <div className="text-right text-sm text-gray-400">M: {scientificMemory}</div>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {[
                ['MC', 'MR', 'M+', 'C', '⌫'],
                ['sin(', 'cos(', 'tan(', '^', '√('],
                ['7', '8', '9', '÷', 'log('],
                ['4', '5', '6', '×', 'ln('],
                ['1', '2', '3', '-', 'π'],
                ['0', '.', '=', '+', 'e']
              ].map((row, rowIdx) => (
                row.map((btn, btnIdx) => (
                  <Button
                    key={`${rowIdx}-${btnIdx}`}
                    onClick={() => handleScientificButton(btn)}
                    variant={btn === '=' ? 'default' : btn === 'C' || btn === '⌫' ? 'destructive' : 'outline'}
                    className={`h-14 text-lg font-semibold ${
                      ['MC', 'MR', 'M+'].includes(btn) ? 'bg-purple-100 hover:bg-purple-200' :
                      ['sin(', 'cos(', 'tan(', 'log(', 'ln(', '√(', '^', 'π', 'e'].includes(btn) ? 'bg-blue-100 hover:bg-blue-200' :
                      ''
                    }`}
                    data-testid={`button-calc-${btn}`}
                  >
                    {btn}
                  </Button>
                ))
              ))}
            </div>
            
            <div className="text-xs text-gray-600 space-y-1 mt-4">
              <p>• استخدم الأقواس () للعمليات المعقدة</p>
              <p>• الزوايا بالراديان (π = {Math.PI.toFixed(4)})</p>
              <p>• M+: حفظ في الذاكرة | MR: استرجاع | MC: مسح الذاكرة</p>
            </div>
          </div>
        );
      
      case "age-calculator":
        return (
          <div className="space-y-4">
            <form onSubmit={handleAgeCalculation} className="space-y-4">
              <div>
                <Label>تاريخ ميلادك</Label>
                <Input type="date" name="birthDate" required />
              </div>
              <Button type="submit" className="w-full">احسب العمر</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-blue-800 mb-3">نتيجة حساب العمر:</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{result.years}</div>
                      <div className="text-sm text-gray-600">سنة</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{result.months}</div>
                      <div className="text-sm text-gray-600">شهر</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{result.days}</div>
                      <div className="text-sm text-gray-600">يوم</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-blue-700">
                    <p><strong>إجمالي الأيام:</strong> {result.totalDays.toLocaleString()} يوم</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "date-converter":
        return (
          <div className="space-y-4">
            <form onSubmit={handleDateConversion} className="space-y-4">
              <div>
                <Label>نوع التحويل</Label>
                <Select name="type" defaultValue="gregorian-to-hijri">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gregorian-to-hijri">ميلادي إلى هجري</SelectItem>
                    <SelectItem value="hijri-to-gregorian">هجري إلى ميلادي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>التاريخ</Label>
                <Input type="date" name="date" required />
              </div>
              <Button type="submit" className="w-full">تحويل التاريخ</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <i className="fas fa-calendar-check text-emerald-600 text-2xl mb-3"></i>
                  <h4 className="font-semibold text-emerald-800 mb-2">نتيجة التحويل:</h4>
                  <p className="text-emerald-700">{result.convertedDate}</p>
                  <p className="text-sm text-emerald-600 mt-2">* هذا تحويل تقريبي للأغراض العامة</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "bmi-calculator":
        return (
          <div className="space-y-4">
            <form onSubmit={handleBMICalculation} className="space-y-4">
              <div>
                <Label>الوزن (كيلوجرام)</Label>
                <Input type="number" name="weight" placeholder="70" required />
              </div>
              <div>
                <Label>الطول (سنتيمتر)</Label>
                <Input type="number" name="height" placeholder="170" required />
              </div>
              <Button type="submit" className="w-full">احسب BMI</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{result.bmi}</div>
                  <div className={`text-lg font-semibold mb-3 ${result.colorClass}`}>{result.category}</div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    <p><strong>المرجع:</strong></p>
                    <p>أقل من 18.5: نقص في الوزن</p>
                    <p>18.5 - 24.9: وزن طبيعي</p>
                    <p>25 - 29.9: زيادة في الوزن</p>
                    <p>30 فأكثر: سمنة</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "percentage-calculator":
        return (
          <div className="space-y-4">
            <form onSubmit={handlePercentageCalculation} className="space-y-4">
              <div>
                <Label>الرقم</Label>
                <Input type="number" name="number" placeholder="50" required />
              </div>
              <div>
                <Label>من إجمالي</Label>
                <Input type="number" name="total" placeholder="200" required />
              </div>
              <Button type="submit" className="w-full">احسب النسبة</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{result.percentage}%</div>
                  <p className="text-purple-700">{result.calculation}</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "random-generator":
        return (
          <div className="space-y-4">
            <form onSubmit={handleRandomGeneration} className="space-y-4">
              <div>
                <Label>الرقم الأدنى</Label>
                <Input 
                  type="number" 
                  name="min" 
                  placeholder="1" 
                  required 
                  data-testid="input-random-min"
                />
              </div>
              <div>
                <Label>الرقم الأعلى</Label>
                <Input 
                  type="number" 
                  name="max" 
                  placeholder="100" 
                  required 
                  data-testid="input-random-max"
                />
              </div>
              <div>
                <Label>عدد الأرقام المراد توليدها</Label>
                <Input 
                  type="number" 
                  name="count" 
                  placeholder="1" 
                  min="1" 
                  max="100"
                  defaultValue="1"
                  data-testid="input-random-count"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input 
                    type="checkbox" 
                    name="allowDuplicates" 
                    id="allowDuplicates" 
                    defaultChecked
                    className="rounded border-gray-300"
                    data-testid="checkbox-allow-duplicates"
                  />
                  <Label htmlFor="allowDuplicates" className="cursor-pointer">
                    السماح بتكرار الأرقام
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input 
                    type="checkbox" 
                    name="combine" 
                    id="combine"
                    className="rounded border-gray-300"
                    data-testid="checkbox-combine"
                  />
                  <Label htmlFor="combine" className="cursor-pointer">
                    دمج الأرقام معاً (مثال: 2، 6 → 26)
                  </Label>
                </div>
              </div>
              <Button type="submit" className="w-full" data-testid="button-generate-random">
                توليد أرقام عشوائية
              </Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6">
                  {result.isCombined ? (
                    <div className="text-center space-y-3">
                      <div className="text-4xl font-bold text-red-600 mb-2" data-testid="text-combined-number">
                        {result.combined}
                      </div>
                      <p className="text-sm text-gray-600">
                        الأرقام الأصلية: {result.numbers.join(', ')}
                      </p>
                      <p className="text-red-700">
                        رقم مدمج من {result.count} أرقام بين {result.min} و {result.max}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="text-4xl font-bold text-red-600 mb-2" data-testid="text-random-numbers">
                        {result.numbers.join(', ')}
                      </div>
                      <p className="text-red-700">
                        {result.count === 1 ? 'رقم عشوائي' : `${result.count} أرقام عشوائية`} بين {result.min} و {result.max}
                      </p>
                      {!result.allowDuplicates && (
                        <p className="text-sm text-blue-600">
                          <i className="fas fa-info-circle ml-1"></i>
                          بدون تكرار
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "countdown-timer":
        return (
          <div className="space-y-4">
            <form onSubmit={handleCountdown} className="space-y-4">
              <div>
                <Label>التاريخ المستهدف</Label>
                <Input type="datetime-local" name="targetDateTime" required />
              </div>
              <Button type="submit" className="w-full">بدء العداد</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6">
                  {result.finished ? (
                    <div className="text-center animate-bounce">
                      <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <i className="fas fa-bell text-white text-4xl animate-pulse"></i>
                      </div>
                      <div className="text-2xl font-bold text-indigo-600 mb-2">انتهى الوقت!</div>
                      <div className="text-lg text-purple-600">🎉 تم الانتهاء من العد التنازلي 🎉</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      {/* Clock Design */}
                      <div className="relative w-48 h-48 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full shadow-2xl border-8 border-indigo-300"></div>
                        
                        {/* Clock Numbers */}
                        <div className="absolute inset-4 rounded-full border-2 border-indigo-400">
                          {[12, 3, 6, 9].map((num, index) => (
                            <div
                              key={num}
                              className={`absolute text-sm font-bold text-indigo-700 ${
                                index === 0 ? 'top-2 left-1/2 transform -translate-x-1/2' :
                                index === 1 ? 'right-2 top-1/2 transform -translate-y-1/2' :
                                index === 2 ? 'bottom-2 left-1/2 transform -translate-x-1/2' :
                                'left-2 top-1/2 transform -translate-y-1/2'
                              }`}
                            >
                              {num}
                            </div>
                          ))}
                        </div>

                        {/* Clock Hands */}
                        <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-indigo-600 origin-bottom transform -translate-x-1/2 -translate-y-full rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 w-0.5 h-12 bg-indigo-800 origin-bottom transform -translate-x-1/2 -translate-y-full rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-indigo-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>

                      {/* Time Display */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200 shadow-md">
                          <div className="text-2xl font-bold text-indigo-600 mb-1">{result.days}</div>
                          <div className="text-xs text-indigo-500 font-medium">يوم</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{result.hours}</div>
                          <div className="text-xs text-blue-500 font-medium">ساعة</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 shadow-md">
                          <div className="text-2xl font-bold text-purple-600 mb-1">{result.minutes}</div>
                          <div className="text-xs text-purple-500 font-medium">دقيقة</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200 shadow-md animate-pulse">
                          <div className="text-2xl font-bold text-pink-600 mb-1">{result.seconds}</div>
                          <div className="text-xs text-pink-500 font-medium">ثانية</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <i className="fas fa-hourglass-half text-indigo-500 ml-2"></i>
                        العد التنازلي جاري...
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "date-difference":
        return (
          <div className="space-y-4">
            <form onSubmit={handleDateDifference} className="space-y-4">
              <div>
                <Label>التاريخ الأول</Label>
                <Input type="date" name="date1" required />
              </div>
              <div>
                <Label>التاريخ الثاني</Label>
                <Input type="date" name="date2" required />
              </div>
              <Button type="submit" className="w-full">احسب الفرق</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">{result.days}</div>
                  <p className="text-teal-700 mb-3">يوم</p>
                  <div className="bg-teal-50 rounded-lg p-3 text-sm">
                    <p className="text-teal-600"><strong>أو:</strong> {result.weeks} أسبوع و {result.remainingDays} أيام</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "tax-calculator":
        return (
          <div className="space-y-4">
            <form onSubmit={handleTaxCalculation} className="space-y-4">
              <div>
                <Label>السعر الأساسي</Label>
                <Input type="number" name="basePrice" placeholder="100" step="0.01" required />
              </div>
              <div>
                <Label>نسبة الضريبة (%)</Label>
                <Input type="number" name="taxRate" placeholder="15" step="0.01" required />
              </div>
              <Button type="submit" className="w-full">احسب الضريبة</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-gray-600">السعر الأساسي:</span>
                      <span className="font-semibold">{result.basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-gray-600">مبلغ الضريبة ({result.taxRate}%):</span>
                      <span className="font-semibold text-green-600">{result.taxAmount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-lg font-bold text-green-800">
                      <span>المجموع الكلي:</span>
                      <span>{result.totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "sqrt-calculator":
        return (
          <div className="space-y-4">
            <form onSubmit={handleSqrtCalculation} className="space-y-4">
              <div>
                <Label>الرقم</Label>
                <Input type="number" name="number" placeholder="16" min="0" required />
              </div>
              <Button type="submit" className="w-full">احسب الجذر التربيعي</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{result.result}</div>
                  <p className="text-orange-700">√{result.number} = {result.result}</p>
                  <p className="text-sm text-orange-600 mt-2">{result.note}</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "gpa-calculator":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              {gpaCourses.map((course, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>الدرجة</Label>
                      <Input 
                        type="number" 
                        placeholder="85" 
                        min="0" 
                        max="100"
                        value={course.grade || ""}
                        onChange={(e) => updateGPACourse(index, 'grade', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>الساعات</Label>
                      <Input 
                        type="number" 
                        placeholder="3" 
                        min="1"
                        value={course.hours || ""}
                        onChange={(e) => updateGPACourse(index, 'hours', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  {gpaCourses.length > 1 && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => removeGPACourse(index)}
                    >
                      <i className="fas fa-trash ml-2"></i>
                      حذف المادة
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="secondary" onClick={addGPACourse} className="flex-1">
                إضافة مادة
              </Button>
              <Button onClick={handleGPACalculation} className="flex-1">
                احسب المعدل
              </Button>
            </div>
            {result && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">{result.gpa}</div>
                  <p className="text-pink-700 mb-3">المعدل التراكمي (من 4.0)</p>
                  <div className="bg-pink-50 rounded-lg p-3 text-sm">
                    <p className="text-gray-600"><strong>عدد المواد:</strong> {result.validCourses}</p>
                    <p className="text-gray-600"><strong>إجمالي الساعات:</strong> {result.totalHours}</p>
                    <p className="text-xs text-gray-500 mt-2">* التحويل تقريبي: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "unit-converter":
        return (
          <div className="space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const value = parseFloat(formData.get("value") as string);
              const category = formData.get("category") as string;
              const fromUnit = formData.get("fromUnit") as string;
              const toUnit = formData.get("toUnit") as string;
              
              if (isNaN(value)) {
                alert("يرجى إدخال قيمة صحيحة");
                return;
              }
              
              const conversionResult = convertUnits(value, fromUnit, toUnit, category);
              setResult(conversionResult);
            }} className="space-y-4">
              <div>
                <Label>فئة التحويل</Label>
                <Select 
                  name="category" 
                  defaultValue="length"
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="length">الطول والمسافة</SelectItem>
                    <SelectItem value="weight">الوزن والكتلة</SelectItem>
                    <SelectItem value="volume">الحجم والسعة</SelectItem>
                    <SelectItem value="area">المساحة</SelectItem>
                    <SelectItem value="numbers">الأرقام والعد</SelectItem>
                    <SelectItem value="temperature">درجة الحرارة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>من</Label>
                  <Select name="fromUnit" defaultValue={getUnitsForCategory(selectedCategory)[0]?.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnitsForCategory(selectedCategory).map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>إلى</Label>
                  <Select name="toUnit" defaultValue={getUnitsForCategory(selectedCategory)[1]?.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnitsForCategory(selectedCategory).map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>القيمة</Label>
                <Input type="number" name="value" placeholder="1" step="any" required />
              </div>
              <Button type="submit" className="w-full">تحويل الوحدة</Button>
            </form>
            
            {/* أمثلة سريعة للتحويلات الشائعة */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">تحويلات سريعة شائعة:</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedCategory === 'length' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const result = convertUnits(1, 'meter', 'foot', 'length');
                        setResult(result);
                      }}
                    >
                      1 متر = قدم
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const result = convertUnits(1, 'kilometer', 'mile', 'length');
                        setResult(result);
                      }}
                    >
                      1 كم = ميل
                    </Button>
                  </>
                )}
                {selectedCategory === 'weight' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const result = convertUnits(1, 'kilogram', 'pound', 'weight');
                        setResult(result);
                      }}
                    >
                      1 كيلو = رطل
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const result = convertUnits(1, 'ton', 'kilogram', 'weight');
                        setResult(result);
                      }}
                    >
                      1 طن = كيلو
                    </Button>
                  </>
                )}
                {selectedCategory === 'numbers' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const result = convertUnits(100, 'units', 'hundreds', 'numbers');
                        setResult(result);
                      }}
                    >
                      100 آحاد = مئات
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const result = convertUnits(1000, 'units', 'thousands', 'numbers');
                        setResult(result);
                      }}
                    >
                      1000 آحاد = آلاف
                    </Button>
                  </>
                )}
              </div>
            </div>
            {result && !result.error && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-cyan-600">{result.result}</div>
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <div className="text-lg font-semibold text-cyan-800 mb-2">
                        {result.fromValue} {getUnitsForCategory(selectedCategory).find(u => u.value === result.fromUnit)?.label} 
                        = {result.result} {getUnitsForCategory(selectedCategory).find(u => u.value === result.toUnit)?.label}
                      </div>
                      <div className="text-sm text-cyan-600">
                        {selectedCategory === 'length' && 'تحويل المسافات والأطوال'}
                        {selectedCategory === 'weight' && 'تحويل الأوزان والكتل'}
                        {selectedCategory === 'volume' && 'تحويل الأحجام والسعات'}
                        {selectedCategory === 'area' && 'تحويل المساحات'}
                        {selectedCategory === 'numbers' && 'تحويل الأرقام والعد'}
                        {selectedCategory === 'temperature' && 'تحويل درجات الحرارة'}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigator.clipboard.writeText(`${result.fromValue} ${getUnitsForCategory(selectedCategory).find(u => u.value === result.fromUnit)?.label} = ${result.result} ${getUnitsForCategory(selectedCategory).find(u => u.value === result.toUnit)?.label}`)}
                    >
                      <i className="fas fa-copy ml-2"></i>
                      نسخ النتيجة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {result && result.error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6 text-center">
                  <div className="text-red-600 font-semibold">{result.error}</div>
                  <p className="text-sm text-red-500 mt-2">تأكد من اختيار وحدات متوافقة من نفس الفئة</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "password-generator":
        return (
          <div className="space-y-4">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const length = parseInt(formData.get("length") as string) || 12;
              const options = {
                uppercase: formData.get("uppercase") === "on",
                lowercase: formData.get("lowercase") === "on" || true,
                numbers: formData.get("numbers") === "on",
                symbols: formData.get("symbols") === "on",
                useWords: formData.get("useWords") === "on"
              };
              
              // Show loading state
              setResult({ loading: true });
              
              // 3-second delay for security
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              const passwordResult = generatePassword(length, options);
              setResult(passwordResult);
            }} className="space-y-4">
              <div>
                <Label>طول كلمة المرور</Label>
                <Input type="number" name="length" min="4" max="50" defaultValue="12" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input type="checkbox" name="useWords" id="useWords" />
                  <Label htmlFor="useWords">استخدام كلمات معروفة (أكثر أماناً)</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input type="checkbox" name="uppercase" id="uppercase" defaultChecked />
                  <Label htmlFor="uppercase">أحرف كبيرة (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input type="checkbox" name="lowercase" id="lowercase" defaultChecked />
                  <Label htmlFor="lowercase">أحرف صغيرة (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input type="checkbox" name="numbers" id="numbers" defaultChecked />
                  <Label htmlFor="numbers">أرقام (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input type="checkbox" name="symbols" id="symbols" />
                  <Label htmlFor="symbols">رموز (!@#$%)</Label>
                </div>
              </div>
              <Button type="submit" className="w-full">إنشاء كلمة مرور آمنة</Button>
            </form>
            {result && result.loading && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4"></div>
                  <p className="text-blue-600">جاري إنشاء كلمة مرور آمنة...</p>
                  <p className="text-sm text-gray-500 mt-2">يتم تطبيق خوارزميات الأمان (3 ثوانِ)</p>
                </CardContent>
              </Card>
            )}
            {result && !result.error && !result.loading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="font-mono text-lg text-center break-all">{result.password}</div>
                  </div>
                  <div className="text-center space-y-3">
                    <div className={`text-lg font-semibold ${
                      result.strength >= 90 ? 'text-emerald-600' :
                      result.strength >= 75 ? 'text-green-600' :
                      result.strength >= 60 ? 'text-blue-600' :
                      result.strength >= 40 ? 'text-yellow-600' :
                      result.strength >= 25 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      قوة كلمة المرور: {result.strengthText} ({result.strength}%)
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm">
                      <p><strong>النوع:</strong> {result.type === 'word-based' ? 'مبنية على كلمات' : 'عشوائية'}</p>
                      <p><strong>الطول:</strong> {result.length} حرف</p>
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              result.strength >= 75 ? 'bg-green-500' :
                              result.strength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${result.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigator.clipboard.writeText(result.password)}
                    >
                      <i className="fas fa-copy ml-2"></i>
                      نسخ كلمة المرور
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "text-encoder":
        return (
          <div className="space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const text = formData.get("text") as string;
              const method = formData.get("method") as string;
              const operation = formData.get("operation") as string;
              
              if (!text.trim()) {
                alert("يرجى إدخال النص");
                return;
              }
              
              let processedText;
              if (operation === 'encode') {
                processedText = encodeText(text, method);
              } else {
                processedText = decodeText(text, method);
              }
              
              setResult({
                original: text,
                processed: processedText,
                method,
                operation
              });
            }} className="space-y-4">
              <div>
                <Label>النص المراد معالجته</Label>
                <Input 
                  name="text" 
                  placeholder="أدخل النص هنا..."
                  required 
                />
              </div>
              <div>
                <Label>نوع التشفير</Label>
                <Select name="method" defaultValue="caesar">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caesar">قيصر (Caesar)</SelectItem>
                    <SelectItem value="lol">LOL (حروف لأرقام)</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                    <SelectItem value="reverse">عكس النص</SelectItem>
                    <SelectItem value="atbash">أتباش (Atbash)</SelectItem>
                    <SelectItem value="bmo">🔥 BMO - تشفير متقدم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>العملية</Label>
                <Select name="operation" defaultValue="encode">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encode">تشفير</SelectItem>
                    <SelectItem value="decode">فك التشفير</SelectItem>
                    <SelectItem value="auto">🔍 كاشف تلقائي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">معالجة النص</Button>
            </form>
            
            {/* قسم إدارة أكواد الكاشف التلقائي */}
            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-violet-800">إدارة الكاشف التلقائي</h3>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => {
                    const randomText = `DTC-${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 6)}`;
                    const code = generateDetectorCode(randomText);
                    setResult({ type: 'detector-code', code, isValid: true });
                  }}
                >
                  إنشاء كود جديد
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Input 
                  placeholder="أدخل كود التفعيل (DTC-xxxxxx-xxxx)"
                  onBlur={(e) => {
                    const code = e.target.value;
                    if (code && code.startsWith('DTC-')) {
                      const isValid = validateDetectorCode(code);
                      setResult({ type: 'detector-validation', code, isValid });
                    }
                  }}
                />
              </div>
            </div>

            {result && result.type === 'detector-code' && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="text-green-800 font-semibold">تم إنشاء كود تفعيل جديد</div>
                    <div className="bg-white p-3 rounded border font-mono text-lg">{result.code}</div>
                    <p className="text-sm text-green-700">احفظ هذا الكود لاستخدام الكاشف التلقائي</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(result.code)}
                    >
                      نسخ الكود
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && result.type === 'detector-validation' && (
              <Card className={result.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`font-semibold ${result.isValid ? 'text-green-800' : 'text-red-800'}`}>
                      {result.isValid ? '✓ كود صحيح ومفعل' : '✗ كود غير صحيح'}
                    </div>
                    <p className={`text-sm mt-2 ${result.isValid ? 'text-green-700' : 'text-red-700'}`}>
                      {result.isValid ? 'يمكنك الآن استخدام الكاشف التلقائي' : 'تحقق من صحة الكود المدخل'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && result.original && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-violet-700">النص الأصلي:</Label>
                      <div className="bg-gray-50 p-3 rounded border text-sm break-all">{result.original}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-violet-700">
                        النتيجة ({result.method} - {result.operation === 'encode' ? 'تشفير' : result.operation === 'auto' ? 'كاشف تلقائي' : 'فك تشفير'}):
                      </Label>
                      <div className="bg-violet-50 p-3 rounded border text-sm break-all font-mono whitespace-pre-wrap">{result.processed}</div>
                    </div>
                    {result.method === 'bmo' && result.operation === 'encode' && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="text-orange-600 font-semibold">🔥 تشفير BMO المتقدم</div>
                        </div>
                        <p className="text-sm text-orange-700 mt-2">
                          تم تطبيق 5 مراحل تشفير متقدمة تشمل التشويش الزمني والتشفير المتعدد المستويات. 
                          هذا التشفير من أصعب التشفيرات في العالم ويتطلب معرفة خاصة لفكه.
                        </p>
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigator.clipboard.writeText(result.processed)}
                    >
                      <i className="fas fa-copy ml-2"></i>
                      نسخ النتيجة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "color-palette":
        return (
          <div className="space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const color = formData.get("color") as string;
              
              setResult({ original: color, hex: color, rgb: convertColor(color, 'hex', 'rgb') });
            }} className="space-y-4">
              <div>
                <Label>اختر لون</Label>
                <input 
                  type="color" 
                  name="color" 
                  defaultValue="#3b82f6"
                  className="w-full h-12 rounded border"
                />
              </div>
              <Button type="submit" className="w-full">عرض معلومات اللون</Button>
            </form>
            {result && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div 
                        className="w-16 h-16 rounded border shadow-lg"
                        style={{ backgroundColor: result.original }}
                      ></div>
                      <div>
                        <p className="font-semibold">اللون المختار</p>
                        <div className="text-sm space-y-1">
                          <p><strong>Hex:</strong> {result.original}</p>
                          <p><strong>RGB:</strong> {result.rgb}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "timer":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>ساعات</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="23"
                    value={timerHours}
                    onChange={(e) => setTimerHours(parseInt(e.target.value) || 0)}
                    disabled={timerRunning}
                    data-testid="input-timer-hours"
                  />
                </div>
                <div>
                  <Label>دقائق</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="59"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                    disabled={timerRunning}
                    data-testid="input-timer-minutes"
                  />
                </div>
                <div>
                  <Label>ثوان</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                    disabled={timerRunning}
                    data-testid="input-timer-seconds"
                  />
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    if (timerRunning) {
                      if (timerInterval) clearInterval(timerInterval);
                      setTimerRunning(false);
                      setTimerStartTime(null);
                    } else {
                      const totalSeconds = timerRemaining > 0 ? timerRemaining : (timerHours * 3600 + timerMinutes * 60 + timerSeconds);
                      if (totalSeconds === 0) {
                        alert("يرجى إدخال وقت صحيح");
                        return;
                      }
                      
                      const startTime = Date.now();
                      setTimerRemaining(totalSeconds);
                      setTimerRunning(true);
                      setTimerStartTime(startTime);
                      
                      const interval = setInterval(() => {
                        const elapsed = Math.floor((Date.now() - startTime) / 1000);
                        const remaining = Math.max(0, totalSeconds - elapsed);
                        
                        setTimerRemaining(remaining);
                        
                        if (remaining === 0) {
                          clearInterval(interval);
                          setTimerRunning(false);
                          setTimerStartTime(null);
                          playNotificationSound();
                        }
                      }, 100);
                      
                      setTimerInterval(interval);
                    }
                  }}
                  data-testid="button-timer-start-stop"
                >
                  {timerRunning ? "إيقاف" : "بدء"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (timerInterval) clearInterval(timerInterval);
                    setTimerRunning(false);
                    setTimerRemaining(0);
                    setTimerHours(0);
                    setTimerMinutes(0);
                    setTimerSeconds(0);
                  }}
                  data-testid="button-timer-reset"
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>
            {(timerRunning || timerRemaining > 0) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-sky-600 mb-4" data-testid="text-timer-display">
                      {Math.floor(timerRemaining / 3600).toString().padStart(2, '0')}:
                      {Math.floor((timerRemaining % 3600) / 60).toString().padStart(2, '0')}:
                      {(timerRemaining % 60).toString().padStart(2, '0')}
                    </div>
                    {timerRemaining === 0 && (
                      <div className="text-lg text-sky-700 animate-bounce" data-testid="text-timer-finished">
                        ⏰ انتهى الوقت! ⏰
                      </div>
                    )}
                    {timerRunning && (
                      <div className="text-sm text-gray-600">
                        المؤقت جاري...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "world-clock":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">الساعة العالمية</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newFormat = !is24HourFormat;
                  setIs24HourFormat(newFormat);
                  localStorage.setItem('bmo_clock_format', newFormat ? '24' : '12');
                }}
                data-testid="button-toggle-time-format"
              >
                {is24HourFormat ? '12 ساعة' : '24 ساعة'}
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { city: 'مكة المكرمة', timezone: 'Asia/Riyadh', flag: '🕋' },
                    { city: 'الرياض', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
                    { city: 'دبي', timezone: 'Asia/Dubai', flag: '🇦🇪' },
                    { city: 'القاهرة', timezone: 'Africa/Cairo', flag: '🇪🇬' },
                    { city: 'إسطنبول', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
                    { city: 'لندن', timezone: 'Europe/London', flag: '🇬🇧' },
                    { city: 'باريس', timezone: 'Europe/Paris', flag: '🇫🇷' },
                    { city: 'نيويورك', timezone: 'America/New_York', flag: '🇺🇸' },
                    { city: 'لوس أنجلوس', timezone: 'America/Los_Angeles', flag: '🗽' },
                    { city: 'طوكيو', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
                    { city: 'سيدني', timezone: 'Australia/Sydney', flag: '🇦🇺' }
                  ].map((location) => {
                    const timeString = worldTime.toLocaleTimeString('en-US', {
                      timeZone: location.timezone,
                      hour12: !is24HourFormat,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });
                    
                    return (
                      <div 
                        key={location.city} 
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200"
                        data-testid={`world-clock-${location.city}`}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <span className="text-3xl">{location.flag}</span>
                          <div>
                            <div className="font-semibold text-cyan-800">{location.city}</div>
                            <div className="text-xs text-cyan-600">{location.timezone}</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-cyan-700 font-mono" data-testid={`time-${location.city}`}>
                          {timeString}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "stopwatch":
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-emerald-600 mb-6 font-mono" data-testid="text-stopwatch-display">
                    {Math.floor(stopwatchTime / 3600000).toString().padStart(2, '0')}:
                    {Math.floor((stopwatchTime % 3600000) / 60000).toString().padStart(2, '0')}:
                    {Math.floor((stopwatchTime % 60000) / 1000).toString().padStart(2, '0')}.
                    {Math.floor((stopwatchTime % 1000) / 10).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    HH:MM:SS:ms
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        if (stopwatchRunning) {
                          if (stopwatchInterval) clearInterval(stopwatchInterval);
                          setStopwatchRunning(false);
                        } else {
                          setStopwatchRunning(true);
                          const startTime = Date.now() - stopwatchTime;
                          
                          const interval = setInterval(() => {
                            setStopwatchTime(Date.now() - startTime);
                          }, 10);
                          
                          setStopwatchInterval(interval);
                        }
                      }}
                      data-testid="button-stopwatch-start-stop"
                    >
                      {stopwatchRunning ? "إيقاف" : "بدء"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (stopwatchInterval) clearInterval(stopwatchInterval);
                        setStopwatchRunning(false);
                        setStopwatchTime(0);
                      }}
                      data-testid="button-stopwatch-reset"
                    >
                      إعادة تعيين
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "image-converter":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload">اختر صورة</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  data-testid="input-image-upload"
                />
              </div>

              {originalPreview && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-gray-700 mb-3">الصورة الأصلية</h4>
                      <img 
                        src={originalPreview} 
                        alt="Original" 
                        className="w-full rounded-lg mb-2"
                        data-testid="img-original-preview"
                      />
                      <p className="text-sm text-gray-600" data-testid="text-original-size">
                        الحجم: {formatFileSize(originalSize)}
                      </p>
                    </CardContent>
                  </Card>

                  <div>
                    <Label htmlFor="format-select">التنسيق المستهدف</Label>
                    <Select 
                      value={selectedFormat} 
                      onValueChange={setSelectedFormat}
                    >
                      <SelectTrigger id="format-select" data-testid="select-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image/jpeg">JPG</SelectItem>
                        <SelectItem value="image/png">PNG</SelectItem>
                        <SelectItem value="image/webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleImageConvert} 
                    className="w-full" 
                    disabled={isProcessing}
                    data-testid="button-convert-image"
                  >
                    {isProcessing ? "جاري التحويل..." : "تحويل الصورة"}
                  </Button>
                </>
              )}

              {processedPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-green-700 mb-3">الصورة المحولة</h4>
                    <img 
                      src={processedPreview} 
                      alt="Processed" 
                      className="w-full rounded-lg mb-2"
                      data-testid="img-processed-preview"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600" data-testid="text-processed-size">
                        الحجم الجديد: {formatFileSize(processedSize)}
                      </p>
                      <p className="text-sm text-green-600" data-testid="text-size-reduction">
                        التوفير: {formatFileSize(originalSize - processedSize)} 
                        ({Math.round((1 - processedSize / originalSize) * 100)}%)
                      </p>
                      <Button 
                        onClick={downloadImage} 
                        className="w-full"
                        data-testid="button-download-image"
                      >
                        تحميل الصورة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case "image-resizer":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-resize-upload">اختر صورة</Label>
                <Input
                  id="image-resize-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  data-testid="input-image-resize-upload"
                />
              </div>

              {originalPreview && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-gray-700 mb-3">الصورة الأصلية</h4>
                      <img 
                        src={originalPreview} 
                        alt="Original" 
                        className="w-full rounded-lg mb-2"
                        data-testid="img-original-resize-preview"
                      />
                      <p className="text-sm text-gray-600" data-testid="text-original-resize-size">
                        الحجم: {formatFileSize(originalSize)}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="target-width">العرض (px)</Label>
                      <Input
                        id="target-width"
                        type="number"
                        value={targetWidth}
                        onChange={(e) => setTargetWidth(parseInt(e.target.value) || 0)}
                        data-testid="input-target-width"
                      />
                    </div>
                    <div>
                      <Label htmlFor="target-height">الارتفاع (px)</Label>
                      <Input
                        id="target-height"
                        type="number"
                        value={targetHeight}
                        onChange={(e) => setTargetHeight(parseInt(e.target.value) || 0)}
                        data-testid="input-target-height"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="maintain-aspect"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="rounded border-gray-300"
                      data-testid="checkbox-maintain-aspect"
                    />
                    <Label htmlFor="maintain-aspect" className="cursor-pointer">
                      الحفاظ على نسبة العرض إلى الارتفاع
                    </Label>
                  </div>

                  <Button 
                    onClick={handleImageResize} 
                    className="w-full" 
                    disabled={isProcessing}
                    data-testid="button-resize-image"
                  >
                    {isProcessing ? "جاري تغيير الحجم..." : "تغيير حجم الصورة"}
                  </Button>
                </>
              )}

              {processedPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-green-700 mb-3">الصورة المعدلة</h4>
                    <img 
                      src={processedPreview} 
                      alt="Resized" 
                      className="w-full rounded-lg mb-2"
                      data-testid="img-resized-preview"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600" data-testid="text-resized-size">
                        الحجم الجديد: {formatFileSize(processedSize)}
                      </p>
                      <p className="text-sm text-green-600" data-testid="text-resize-reduction">
                        التوفير: {formatFileSize(originalSize - processedSize)} 
                        ({Math.round((1 - processedSize / originalSize) * 100)}%)
                      </p>
                      <Button 
                        onClick={downloadImage} 
                        className="w-full"
                        data-testid="button-download-resized"
                      >
                        تحميل الصورة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case "bg-remover":
        const removeBackgroundMutation = useMutation({
          mutationFn: async (imageBase64: string) => {
            const response = await apiRequest('POST', '/api/background-removal', { imageBase64 });
            return response.json();
          },
          onSuccess: (data) => {
            if (data.success && data.imageBase64) {
              setProcessedPreview(data.imageBase64);
              const base64Data = data.imageBase64.replace(/^data:image\/\w+;base64,/, '');
              const buffer = atob(base64Data);
              const bytes = new Uint8Array(buffer.length);
              for (let i = 0; i < buffer.length; i++) {
                bytes[i] = buffer.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: 'image/png' });
              setProcessedImage(blob);
              setProcessedSize(blob.size);
              toast({
                title: "تم بنجاح",
                description: "تم إزالة الخلفية بنجاح",
              });
            } else {
              toast({
                title: "خطأ",
                description: "فشل في إزالة الخلفية",
                variant: "destructive",
              });
            }
          },
          onError: (error: any) => {
            toast({
              title: "خطأ",
              description: error.message || "فشل في إزالة الخلفية",
              variant: "destructive",
            });
          },
        });

        const handleRemoveBackground = async () => {
          if (!originalPreview) {
            toast({
              title: "خطأ",
              description: "يرجى اختيار صورة أولاً",
              variant: "destructive",
            });
            return;
          }
          
          removeBackgroundMutation.mutate(originalPreview);
        };

        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">حول أداة إزالة الخلفية</h4>
                  <p className="text-sm text-blue-700">
                    قم برفع صورة وسنقوم بإزالة الخلفية تلقائياً باستخدام تقنية الذكاء الاصطناعي.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="bg-remove-upload">اختر صورة</Label>
                <Input
                  id="bg-remove-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  data-testid="input-bg-remove-upload"
                />
              </div>

              {originalPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-gray-700 mb-3">الصورة الأصلية</h4>
                    <img 
                      src={originalPreview} 
                      alt="Original" 
                      className="w-full rounded-lg mb-2"
                      data-testid="img-bg-original-preview"
                    />
                    <p className="text-sm text-gray-600 mb-3" data-testid="text-bg-original-size">
                      الحجم: {formatFileSize(originalSize)}
                    </p>
                    <Button 
                      onClick={handleRemoveBackground} 
                      className="w-full"
                      disabled={removeBackgroundMutation.isPending}
                      data-testid="button-remove-background"
                    >
                      {removeBackgroundMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin ml-2"></i>
                          جاري إزالة الخلفية...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-magic ml-2"></i>
                          إزالة الخلفية
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {processedPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-green-700 mb-3">الصورة بدون خلفية</h4>
                    <div className="bg-gray-100 rounded-lg p-4 mb-2">
                      <img 
                        src={processedPreview} 
                        alt="No Background" 
                        className="w-full rounded-lg"
                        data-testid="img-bg-removed-preview"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600" data-testid="text-bg-removed-size">
                        الحجم الجديد: {formatFileSize(processedSize)}
                      </p>
                      <Button 
                        onClick={downloadImage} 
                        className="w-full"
                        data-testid="button-download-bg-removed"
                      >
                        <i className="fas fa-download ml-2"></i>
                        تحميل الصورة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case "designfy":
        const designfyMutation = useMutation({
          mutationFn: async ({ imageBase64, action }: { imageBase64: string; action: string }) => {
            const response = await apiRequest('POST', '/api/designfy', { 
              action, 
              imageBase64,
              params: {} 
            });
            return response.json();
          },
          onSuccess: (data) => {
            if (data.result_url) {
              setProcessedPreview(data.result_url);
              toast({
                title: "تم بنجاح",
                description: "تمت معالجة الصورة بنجاح",
              });
            } else {
              toast({
                title: "خطأ",
                description: "فشل في معالجة الصورة",
                variant: "destructive",
              });
            }
          },
          onError: (error: any) => {
            toast({
              title: "خطأ",
              description: error.message || "فشل في معالجة الصورة",
              variant: "destructive",
            });
          },
        });

        const handleDesignfyProcess = async () => {
          if (!originalPreview) {
            toast({
              title: "خطأ",
              description: "يرجى اختيار صورة أولاً",
              variant: "destructive",
            });
            return;
          }
          
          designfyMutation.mutate({ imageBase64: originalPreview, action: designfyAction });
        };

        const downloadDesignfyImage = () => {
          if (!processedPreview) return;
          
          const link = document.createElement('a');
          link.href = processedPreview;
          link.download = `designfy-${designfyAction}-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <i className="fas fa-wand-magic-sparkles text-purple-600 mt-1"></i>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">حول أداة Designfy</h4>
                  <p className="text-sm text-purple-700">
                    استخدم تقنيات الذكاء الاصطناعي لتحسين الصور، تكبيرها، إعادة تلوينها، أو إزالة الأشياء منها.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="designfy-upload">اختر صورة</Label>
                <Input
                  id="designfy-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  data-testid="input-designfy-upload"
                />
              </div>

              <div>
                <Label htmlFor="designfy-action">اختر العملية</Label>
                <Select value={designfyAction} onValueChange={setDesignfyAction}>
                  <SelectTrigger id="designfy-action" data-testid="select-designfy-action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enhance">تحسين الجودة</SelectItem>
                    <SelectItem value="upscale">تكبير الحجم</SelectItem>
                    <SelectItem value="recolor">إعادة التلوين</SelectItem>
                    <SelectItem value="remove-object">إزالة الأشياء</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {originalPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-gray-700 mb-3">الصورة الأصلية</h4>
                    <img 
                      src={originalPreview} 
                      alt="Original" 
                      className="w-full rounded-lg mb-2"
                      data-testid="img-designfy-original-preview"
                    />
                    <p className="text-sm text-gray-600 mb-3" data-testid="text-designfy-original-size">
                      الحجم: {formatFileSize(originalSize)}
                    </p>
                    <Button 
                      onClick={handleDesignfyProcess} 
                      className="w-full"
                      disabled={designfyMutation.isPending}
                      data-testid="button-process-designfy"
                    >
                      {designfyMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin ml-2"></i>
                          جاري المعالجة...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-wand-magic-sparkles ml-2"></i>
                          معالجة بواسطة Designfy
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {processedPreview && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-green-700 mb-3">الصورة المعالجة</h4>
                    <img 
                      src={processedPreview} 
                      alt="Processed" 
                      className="w-full rounded-lg mb-2"
                      data-testid="img-designfy-processed-preview"
                    />
                    <Button 
                      onClick={downloadDesignfyImage} 
                      className="w-full"
                      data-testid="button-download-designfy"
                    >
                      <i className="fas fa-download ml-2"></i>
                      تحميل الصورة
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case "ai-image-generator":
        const generateImageMutation = useMutation({
          mutationFn: async (prompt: string) => {
            const response = await apiRequest('POST', '/api/ai-image-generate', { prompt });
            return response.json();
          },
          onSuccess: (data) => {
            if (data.success && data.imageBase64) {
              setGeneratedImage(data.imageBase64);
              toast({
                title: "تم بنجاح",
                description: "تم توليد الصورة بنجاح",
              });
            } else {
              toast({
                title: "خطأ",
                description: "فشل في توليد الصورة",
                variant: "destructive",
              });
            }
          },
          onError: (error: any) => {
            toast({
              title: "خطأ",
              description: error.message || "فشل في توليد الصورة",
              variant: "destructive",
            });
          },
        });

        const handleGenerateImage = async () => {
          if (!aiPrompt.trim()) {
            toast({
              title: "خطأ",
              description: "يرجى إدخال وصف للصورة",
              variant: "destructive",
            });
            return;
          }
          
          generateImageMutation.mutate(aiPrompt);
        };

        const downloadGeneratedImage = () => {
          if (!generatedImage) return;
          
          const link = document.createElement('a');
          link.href = generatedImage;
          link.download = `ai-generated-${Date.now()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        const examplePrompts = [
          "قطة لطيفة ترتدي نظارة شمسية",
          "منظر طبيعي لجبال عند غروب الشمس",
          "مدينة مستقبلية مع سيارات طائرة",
          "باقة ورد ملونة في مزهرية",
          "شاطئ استوائي مع أشجار النخيل"
        ];

        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <i className="fas fa-sparkles text-blue-600 mt-1"></i>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">مولد الصور بالذكاء الاصطناعي</h4>
                  <p className="text-sm text-blue-700">
                    اكتب وصفاً للصورة التي تريدها وسنقوم بتوليدها باستخدام الذكاء الاصطناعي.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt-input">وصف الصورة</Label>
                <Input
                  id="ai-prompt-input"
                  placeholder="مثال: قطة لطيفة في حديقة..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  data-testid="input-ai-prompt"
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h5 className="text-xs font-semibold text-gray-700 mb-2">أمثلة للأوصاف:</h5>
                <div className="space-y-1">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setAiPrompt(example)}
                      className="block text-xs text-blue-600 hover:text-blue-800 hover:underline text-right w-full"
                      data-testid={`button-example-prompt-${index}`}
                    >
                      • {example}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleGenerateImage} 
                className="w-full"
                disabled={generateImageMutation.isPending}
                data-testid="button-generate-ai-image"
              >
                {generateImageMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin ml-2"></i>
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sparkles ml-2"></i>
                    توليد الصورة
                  </>
                )}
              </Button>

              {generatedImage && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-green-700 mb-3">الصورة المولدة</h4>
                    <img 
                      src={generatedImage} 
                      alt="AI Generated" 
                      className="w-full rounded-lg mb-2"
                      data-testid="img-ai-generated"
                    />
                    <Button 
                      onClick={downloadGeneratedImage} 
                      className="w-full"
                      data-testid="button-download-ai-image"
                    >
                      <i className="fas fa-download ml-2"></i>
                      تحميل الصورة
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case "qr-code":
        return (
          <div className="space-y-4">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate" data-testid="tab-qr-generate">مولد QR</TabsTrigger>
                <TabsTrigger value="read" data-testid="tab-qr-read">قارئ QR</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr-text-input">النص أو الرابط</Label>
                    <Input
                      id="qr-text-input"
                      placeholder="أدخل نص أو رابط..."
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      data-testid="input-qr-text"
                    />
                  </div>

                  <div>
                    <Label htmlFor="qr-size-select">حجم رمز QR</Label>
                    <Select value={qrSize} onValueChange={setQrSize}>
                      <SelectTrigger id="qr-size-select" data-testid="select-qr-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">صغير (200x200)</SelectItem>
                        <SelectItem value="medium">متوسط (300x300)</SelectItem>
                        <SelectItem value="large">كبير (400x400)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleGenerateQr} 
                    className="w-full"
                    data-testid="button-generate-qr"
                  >
                    إنشاء رمز QR
                  </Button>

                  {qrCodeDataUrl && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <h4 className="font-semibold text-blue-700 mb-3">رمز QR الناتج</h4>
                          <div className="flex justify-center">
                            <img 
                              src={qrCodeDataUrl} 
                              alt="QR Code" 
                              className="border-2 border-gray-200 rounded-lg shadow-lg"
                              data-testid="img-qr-code"
                            />
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-700 break-all" data-testid="text-qr-content">
                              <strong>المحتوى:</strong> {qrText}
                            </p>
                          </div>
                          <Button 
                            onClick={handleDownloadQr} 
                            variant="outline" 
                            className="w-full"
                            data-testid="button-download-qr"
                          >
                            <i className="fas fa-download ml-2"></i>
                            تحميل رمز QR
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="read" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr-image-upload">رفع صورة تحتوي على رمز QR</Label>
                    <Input
                      id="qr-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleQrImageUpload}
                      data-testid="input-qr-image-upload"
                    />
                  </div>

                  {qrReaderPreview && (
                    <>
                      <Card>
                        <CardContent className="pt-6">
                          <h4 className="font-semibold text-gray-700 mb-3">الصورة المرفوعة</h4>
                          <img 
                            src={qrReaderPreview} 
                            alt="QR to read" 
                            className="w-full max-w-sm mx-auto rounded-lg border"
                            data-testid="img-qr-reader-preview"
                          />
                        </CardContent>
                      </Card>

                      <Button 
                        onClick={handleReadQr} 
                        className="w-full"
                        disabled={isReadingQr}
                        data-testid="button-read-qr"
                      >
                        {isReadingQr ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                            جاري قراءة رمز QR...
                          </>
                        ) : (
                          "قراءة رمز QR"
                        )}
                      </Button>
                    </>
                  )}

                  {qrReadError && (
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="pt-6">
                        <div className="text-center text-red-600" data-testid="text-qr-error">
                          <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
                          <p className="font-semibold">{qrReadError}</p>
                          <p className="text-sm mt-2">تأكد من أن الصورة تحتوي على رمز QR واضح</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {decodedQrText && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="text-center">
                            <i className="fas fa-check-circle text-green-600 text-3xl mb-2"></i>
                            <h4 className="font-semibold text-green-700 mb-3">تم قراءة رمز QR بنجاح</h4>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border">
                            <Label className="text-sm font-semibold text-green-700">المحتوى المستخرج:</Label>
                            <p className="mt-2 break-all text-gray-800" data-testid="text-decoded-qr">
                              {decodedQrText}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              onClick={() => navigator.clipboard.writeText(decodedQrText)}
                              variant="outline"
                              className="flex-1"
                              data-testid="button-copy-decoded"
                            >
                              <i className="fas fa-copy ml-2"></i>
                              نسخ
                            </Button>
                            
                            {isUrl(decodedQrText) && (
                              <Button 
                                onClick={() => window.open(decodedQrText, '_blank')}
                                className="flex-1"
                                data-testid="button-open-url"
                              >
                                <i className="fas fa-external-link-alt ml-2"></i>
                                فتح الرابط
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "pdf-tools":
        return (
          <div className="space-y-4">
            <Tabs defaultValue="merge" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="merge" data-testid="tab-pdf-merge">دمج PDF</TabsTrigger>
                <TabsTrigger value="split" data-testid="tab-pdf-split">تقسيم PDF</TabsTrigger>
              </TabsList>

              <TabsContent value="merge" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-merge-upload">رفع ملفات PDF للدمج</Label>
                    <Input
                      id="pdf-merge-upload"
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={handlePdfMergeUpload}
                      data-testid="input-pdf-merge-upload"
                    />
                    <p className="text-xs text-gray-500 mt-1">يمكنك اختيار ملفين أو أكثر</p>
                  </div>

                  {pdfMergeFiles.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-gray-700 mb-3">الملفات المرفوعة ({pdfMergeFiles.length})</h4>
                        <div className="space-y-2">
                          {pdfMergeFiles.map((file, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                              data-testid={`pdf-merge-file-${index}`}
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removePdfFromMergeList(index)}
                                data-testid={`button-remove-pdf-${index}`}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    onClick={handlePdfMerge}
                    className="w-full"
                    disabled={isPdfProcessing || pdfMergeFiles.length < 2}
                    data-testid="button-merge-pdf"
                  >
                    {isPdfProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                        جاري دمج الملفات...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-compress-arrows-alt ml-2"></i>
                        دمج ملفات PDF
                      </>
                    )}
                  </Button>

                  {mergedPdfBlob && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <i className="fas fa-check-circle text-green-600 text-3xl"></i>
                          <h4 className="font-semibold text-green-700">تم الدمج بنجاح!</h4>
                          <p className="text-sm text-green-600" data-testid="text-merged-size">
                            حجم الملف: {formatFileSize(mergedPdfBlob.size)}
                          </p>
                          <Button
                            onClick={handleDownloadMergedPdf}
                            className="w-full"
                            data-testid="button-download-merged"
                          >
                            <i className="fas fa-download ml-2"></i>
                            تحميل ملف PDF المدموج
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="split" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-split-upload">رفع ملف PDF للتقسيم</Label>
                    <Input
                      id="pdf-split-upload"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfSplitUpload}
                      data-testid="input-pdf-split-upload"
                    />
                  </div>

                  {pdfSplitFile && pdfSplitPageCount > 0 && (
                    <>
                      <Card>
                        <CardContent className="pt-6">
                          <h4 className="font-semibold text-gray-700 mb-3">معلومات الملف</h4>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <strong>الاسم:</strong> {pdfSplitFile.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>الحجم:</strong> {formatFileSize(pdfSplitFile.size)}
                            </p>
                            <p className="text-sm text-blue-600" data-testid="text-page-count">
                              <strong>عدد الصفحات:</strong> {pdfSplitPageCount} صفحة
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start-page">من صفحة</Label>
                          <Input
                            id="start-page"
                            type="number"
                            min={1}
                            max={pdfSplitPageCount}
                            value={pdfSplitStartPage}
                            onChange={(e) => setPdfSplitStartPage(parseInt(e.target.value) || 1)}
                            data-testid="input-start-page"
                          />
                        </div>
                        <div>
                          <Label htmlFor="end-page">إلى صفحة</Label>
                          <Input
                            id="end-page"
                            type="number"
                            min={1}
                            max={pdfSplitPageCount}
                            value={pdfSplitEndPage}
                            onChange={(e) => setPdfSplitEndPage(parseInt(e.target.value) || pdfSplitPageCount)}
                            data-testid="input-end-page"
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700" data-testid="text-split-range">
                          <i className="fas fa-info-circle ml-1"></i>
                          سيتم استخراج {pdfSplitEndPage - pdfSplitStartPage + 1} صفحة 
                          (من {pdfSplitStartPage} إلى {pdfSplitEndPage})
                        </p>
                      </div>

                      <Button
                        onClick={handlePdfSplit}
                        className="w-full"
                        disabled={isPdfProcessing}
                        data-testid="button-split-pdf"
                      >
                        {isPdfProcessing ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                            جاري تقسيم الملف...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-cut ml-2"></i>
                            تقسيم PDF
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {splitPdfBlob && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <i className="fas fa-check-circle text-green-600 text-3xl"></i>
                          <h4 className="font-semibold text-green-700">تم التقسيم بنجاح!</h4>
                          <p className="text-sm text-green-600" data-testid="text-split-size">
                            حجم الملف الجديد: {formatFileSize(splitPdfBlob.size)}
                          </p>
                          <Button
                            onClick={handleDownloadSplitPdf}
                            className="w-full"
                            data-testid="button-download-split"
                          >
                            <i className="fas fa-download ml-2"></i>
                            تحميل ملف PDF المقسم
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "url-shortener":
        return <URLShortener />;

      case "link-checker":
        return <LinkChecker />;

      case "image-cropper":
        return <ImageCropper />;

      case "image-combiner":
        return <ImageCombiner />;

      default:
        return <div className="p-6"><p>الأداة غير متوفرة حالياً</p></div>;
    }
  };

  const URLShortener = () => {
    const { toast } = useToast();
    const [originalUrl, setOriginalUrl] = useState("");
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string>(() => {
      return localStorage.getItem('urlShortenerService') || 'bmo';
    });
    const [isShortening, setIsShortening] = useState(false);

    useEffect(() => {
      localStorage.setItem('urlShortenerService', selectedService);
    }, [selectedService]);

    const { data: allUrls, isLoading: isLoadingUrls } = useQuery<any[]>({
      queryKey: ['/api/urls'],
      enabled: selectedService === "bmo",
    });

    const createShortUrlMutation = useMutation({
      mutationFn: async (url: string) => {
        const response = await apiRequest('POST', '/api/urls', { originalUrl: url });
        return response.json();
      },
      onSuccess: (data) => {
        const baseUrl = window.location.origin;
        setShortUrl(`${baseUrl}/api/urls/${data.shortCode}`);
        queryClient.invalidateQueries({ queryKey: ['/api/urls'] });
        toast({
          title: "تم إنشاء الرابط المختصر!",
          description: "يمكنك الآن نسخ الرابط ومشاركته",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "حدث خطأ",
          description: error.message || "فشل في إنشاء الرابط المختصر",
          variant: "destructive",
        });
      },
    });

    const shortenWithIsGd = async (url: string) => {
      try {
        const response = await apiRequest('POST', '/api/urls/isgd', { originalUrl: url });
        const data = await response.json();
        
        if (data.shorturl) {
          setShortUrl(data.shorturl);
          toast({
            title: "تم إنشاء الرابط المختصر!",
            description: "يمكنك الآن نسخ الرابط ومشاركته",
          });
        } else {
          throw new Error(data.error || "فشل في اختصار الرابط");
        }
      } catch (error: any) {
        toast({
          title: "حدث خطأ",
          description: error.message || "فشل في الاتصال بخدمة is.gd",
          variant: "destructive",
        });
      }
    };

    const shortenWithTinyUrl = async (url: string) => {
      try {
        const response = await apiRequest('POST', '/api/urls/tinyurl', { originalUrl: url });
        const data = await response.json();
        
        if (data.shorturl) {
          setShortUrl(data.shorturl);
          toast({
            title: "تم إنشاء الرابط المختصر!",
            description: "يمكنك الآن نسخ الرابط ومشاركته",
          });
        } else {
          throw new Error(data.error || "فشل في اختصار الرابط");
        }
      } catch (error: any) {
        toast({
          title: "حدث خطأ",
          description: error.message || "فشل في الاتصال بخدمة TinyURL",
          variant: "destructive",
        });
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!originalUrl.trim()) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال رابط صحيح",
          variant: "destructive",
        });
        return;
      }

      try {
        new URL(originalUrl);
        
        if (selectedService === "bmo") {
          createShortUrlMutation.mutate(originalUrl);
        } else if (selectedService === "isgd") {
          setIsShortening(true);
          await shortenWithIsGd(originalUrl);
          setIsShortening(false);
        } else if (selectedService === "tinyurl") {
          setIsShortening(true);
          await shortenWithTinyUrl(originalUrl);
          setIsShortening(false);
        } else if (selectedService === "bitly") {
          toast({
            title: "الخدمة غير متاحة",
            description: "Bitly يتطلب مفتاح API - استخدم TinyURL أو is.gd بدلاً منه",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "خطأ",
          description: "يرجى إدخال رابط صحيح بصيغة URL",
          variant: "destructive",
        });
        setIsShortening(false);
      }
    };

    const copyToClipboard = async () => {
      if (!shortUrl) return;
      
      try {
        await navigator.clipboard.writeText(shortUrl);
        toast({
          title: "تم النسخ!",
          description: "تم نسخ الرابط إلى الحافظة",
        });
      } catch {
        toast({
          title: "فشل النسخ",
          description: "حاول مرة أخرى",
          variant: "destructive",
        });
      }
    };

    const isPending = createShortUrlMutation.isPending || isShortening;

    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service-select">خدمة الاختصار</Label>
            <select
              id="service-select"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="select-service"
            >
              <option value="bmo">BMO Shortener (داخلي)</option>
              <option value="isgd">is.gd (مجاني)</option>
              <option value="tinyurl">TinyURL (مجاني)</option>
              <option value="bitly">Bit.ly (يتطلب API)</option>
            </select>
          </div>
          <div>
            <Label htmlFor="original-url">الرابط الأصلي</Label>
            <Input
              id="original-url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={isPending}
              data-testid="input-original-url"
              className="text-left"
              dir="ltr"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
            data-testid="button-shorten-url"
          >
            {isPending ? "جاري الاختصار..." : "اختصر الرابط"}
          </Button>
        </form>

        {shortUrl && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <i className="fas fa-link text-blue-600 text-2xl mb-3"></i>
                <h4 className="font-semibold text-blue-800 mb-2">الرابط المختصر:</h4>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p 
                  className="text-sm text-blue-600 break-all text-left" 
                  dir="ltr"
                  data-testid="text-short-url"
                >
                  {shortUrl}
                </p>
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full"
                data-testid="button-copy-url"
              >
                <i className="fas fa-copy ml-2"></i>
                نسخ الرابط
              </Button>
            </CardContent>
          </Card>
        )}

        {selectedService === "bmo" && allUrls && allUrls.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-gray-800 mb-3">إحصائيات:</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-600" data-testid="text-total-urls">
                    {allUrls.length}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي الروابط</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-600">
                    {allUrls.filter(url => {
                      const createdAt = new Date(url.createdAt);
                      const today = new Date();
                      return createdAt.toDateString() === today.toDateString();
                    }).length}
                  </div>
                  <div className="text-sm text-gray-600">روابط اليوم</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const LinkChecker = () => {
    const { toast } = useToast();
    const [urlToCheck, setUrlToCheck] = useState("");
    const [checkResult, setCheckResult] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(false);

    const handleCheck = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!urlToCheck.trim()) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال رابط للفحص",
          variant: "destructive",
        });
        return;
      }

      setIsChecking(true);
      setCheckResult(null);

      try {
        const response = await apiRequest('POST', '/api/urls/check-malicious', { url: urlToCheck });
        const data = await response.json();
        setCheckResult(data);
      } catch (error: any) {
        toast({
          title: "حدث خطأ",
          description: error.message || "فشل في فحص الرابط",
          variant: "destructive",
        });
      } finally {
        setIsChecking(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3 space-x-reverse">
            <i className="fas fa-shield-alt text-yellow-600 mt-1"></i>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">فاحص الروابط الخبيثة</h4>
              <p className="text-sm text-yellow-700">
                هذه الأداة تفحص الروابط ضد قاعدة بيانات URLhaus للبرمجيات الخبيثة والتهديدات.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <Label htmlFor="url-to-check">الرابط المراد فحصه</Label>
            <Input
              id="url-to-check"
              type="url"
              placeholder="https://example.com"
              value={urlToCheck}
              onChange={(e) => setUrlToCheck(e.target.value)}
              disabled={isChecking}
              data-testid="input-url-to-check"
              className="text-left"
              dir="ltr"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isChecking}
            data-testid="button-check-url"
          >
            {isChecking ? "جاري الفحص..." : "فحص الرابط"}
          </Button>
        </form>

        {checkResult && (
          <Card className={
            checkResult.status === 'malicious' ? 'border-red-200 bg-red-50' :
            checkResult.status === 'safe' ? 'border-green-200 bg-green-50' :
            'border-yellow-200 bg-yellow-50'
          }>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <i className={`text-4xl mb-3 ${
                  checkResult.status === 'malicious' ? 'fas fa-exclamation-triangle text-red-600' :
                  checkResult.status === 'safe' ? 'fas fa-check-circle text-green-600' :
                  'fas fa-question-circle text-yellow-600'
                }`}></i>
                <h4 className={`font-bold text-lg mb-2 ${
                  checkResult.status === 'malicious' ? 'text-red-800' :
                  checkResult.status === 'safe' ? 'text-green-800' :
                  'text-yellow-800'
                }`}>
                  {checkResult.status === 'malicious' ? '⚠️ رابط خطير!' :
                   checkResult.status === 'safe' ? '✓ رابط آمن' :
                   '⚠ حالة غير معروفة'}
                </h4>
              </div>
              
              <div className="space-y-2">
                <div className={`rounded-lg p-3 ${
                  checkResult.status === 'malicious' ? 'bg-red-100' :
                  checkResult.status === 'safe' ? 'bg-green-100' :
                  'bg-yellow-100'
                }`}>
                  <p className="text-sm break-all" data-testid="text-checked-url">
                    <strong>الرابط:</strong> {checkResult.url}
                  </p>
                  {checkResult.details && (
                    <p className="text-sm mt-2" data-testid="text-check-details">
                      <strong>التفاصيل:</strong> {checkResult.details}
                    </p>
                  )}
                  {checkResult.threat && (
                    <p className="text-sm mt-2 text-red-700" data-testid="text-threat-type">
                      <strong>نوع التهديد:</strong> {checkResult.threat}
                    </p>
                  )}
                  {checkResult.tags && checkResult.tags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold">العلامات:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {checkResult.tags.map((tag: string, index: number) => (
                          <span key={index} className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const ImageCropper = () => {
    const { toast } = useToast();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [cropSettings, setCropSettings] = useState({
      x: 0,
      y: 0,
      width: 200,
      height: 200
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار ملف صورة صحيح",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedImage(file);
      setCroppedImage(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    };

    const handleCrop = () => {
      if (!imagePreview) return;
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        canvas.width = cropSettings.width;
        canvas.height = cropSettings.height;
        
        ctx.drawImage(
          img,
          cropSettings.x,
          cropSettings.y,
          cropSettings.width,
          cropSettings.height,
          0,
          0,
          cropSettings.width,
          cropSettings.height
        );
        
        const croppedDataUrl = canvas.toDataURL('image/png');
        setCroppedImage(croppedDataUrl);
        
        toast({
          title: "تم القص بنجاح!",
          description: "يمكنك الآن تحميل الصورة المقصوصة",
        });
      };
      img.src = imagePreview;
    };

    const downloadCroppedImage = () => {
      if (!croppedImage) return;
      
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `cropped-${Date.now()}.png`;
      link.click();
    };

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="image-crop-upload">اختر صورة للقص</Label>
          <Input
            id="image-crop-upload"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            data-testid="input-crop-upload"
          />
        </div>

        {imagePreview && (
          <>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-gray-700 mb-3">الصورة الأصلية</h4>
                <img 
                  src={imagePreview} 
                  alt="Original" 
                  className="w-full rounded-lg mb-2"
                  data-testid="img-crop-original"
                />
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">إعدادات القص</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="crop-x">X (البداية الأفقية)</Label>
                  <Input
                    id="crop-x"
                    type="number"
                    min="0"
                    value={cropSettings.x}
                    onChange={(e) => setCropSettings({...cropSettings, x: parseInt(e.target.value) || 0})}
                    data-testid="input-crop-x"
                  />
                </div>
                <div>
                  <Label htmlFor="crop-y">Y (البداية العمودية)</Label>
                  <Input
                    id="crop-y"
                    type="number"
                    min="0"
                    value={cropSettings.y}
                    onChange={(e) => setCropSettings({...cropSettings, y: parseInt(e.target.value) || 0})}
                    data-testid="input-crop-y"
                  />
                </div>
                <div>
                  <Label htmlFor="crop-width">العرض</Label>
                  <Input
                    id="crop-width"
                    type="number"
                    min="1"
                    value={cropSettings.width}
                    onChange={(e) => setCropSettings({...cropSettings, width: parseInt(e.target.value) || 1})}
                    data-testid="input-crop-width"
                  />
                </div>
                <div>
                  <Label htmlFor="crop-height">الارتفاع</Label>
                  <Input
                    id="crop-height"
                    type="number"
                    min="1"
                    value={cropSettings.height}
                    onChange={(e) => setCropSettings({...cropSettings, height: parseInt(e.target.value) || 1})}
                    data-testid="input-crop-height"
                  />
                </div>
              </div>
              
              <Button onClick={handleCrop} className="w-full" data-testid="button-crop-image">
                <i className="fas fa-cut ml-2"></i>
                قص الصورة
              </Button>
            </div>
          </>
        )}

        {croppedImage && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-green-700 mb-3">الصورة المقصوصة</h4>
              <img 
                src={croppedImage} 
                alt="Cropped" 
                className="w-full rounded-lg mb-2"
                data-testid="img-cropped"
              />
              <Button onClick={downloadCroppedImage} className="w-full" data-testid="button-download-cropped">
                <i className="fas fa-download ml-2"></i>
                تحميل الصورة المقصوصة
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const ImageCombiner = () => {
    const { toast } = useToast();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [combinedImage, setCombinedImage] = useState<string | null>(null);
    const [combineDirection, setCombineDirection] = useState<'horizontal' | 'vertical'>('horizontal');

    const handleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      
      if (files.length === 0) return;
      
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار ملفات صور صحيحة",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedImages(imageFiles);
      setCombinedImage(null);
      
      const previews: string[] = [];
      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          previews.push(event.target?.result as string);
          if (previews.length === imageFiles.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    };

    const handleCombine = async () => {
      if (imagePreviews.length < 2) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار صورتين على الأقل",
          variant: "destructive",
        });
        return;
      }
      
      const images = await Promise.all(
        imagePreviews.map(src => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
          });
        })
      );
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      if (combineDirection === 'horizontal') {
        canvas.width = images.reduce((sum, img) => sum + img.width, 0);
        canvas.height = Math.max(...images.map(img => img.height));
        
        let x = 0;
        images.forEach(img => {
          ctx.drawImage(img, x, 0);
          x += img.width;
        });
      } else {
        canvas.width = Math.max(...images.map(img => img.width));
        canvas.height = images.reduce((sum, img) => sum + img.height, 0);
        
        let y = 0;
        images.forEach(img => {
          ctx.drawImage(img, 0, y);
          y += img.height;
        });
      }
      
      const combinedDataUrl = canvas.toDataURL('image/png');
      setCombinedImage(combinedDataUrl);
      
      toast({
        title: "تم الدمج بنجاح!",
        description: "يمكنك الآن تحميل الصورة المدمجة",
      });
    };

    const downloadCombinedImage = () => {
      if (!combinedImage) return;
      
      const link = document.createElement('a');
      link.href = combinedImage;
      link.download = `combined-${Date.now()}.png`;
      link.click();
    };

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="images-combine-upload">اختر صورتين أو أكثر للدمج</Label>
          <Input
            id="images-combine-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesSelect}
            data-testid="input-combine-upload"
          />
        </div>

        {imagePreviews.length > 0 && (
          <>
            <div>
              <Label htmlFor="combine-direction">اتجاه الدمج</Label>
              <select
                id="combine-direction"
                value={combineDirection}
                onChange={(e) => setCombineDirection(e.target.value as 'horizontal' | 'vertical')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="select-combine-direction"
              >
                <option value="horizontal">أفقي (جنب إلى جنب)</option>
                <option value="vertical">عمودي (فوق بعض)</option>
              </select>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-gray-700 mb-3">الصور المختارة ({imagePreviews.length})</h4>
                <div className="grid grid-cols-2 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <img 
                      key={index}
                      src={preview} 
                      alt={`Image ${index + 1}`} 
                      className="w-full rounded-lg border border-gray-200"
                      data-testid={`img-combine-preview-${index}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleCombine} className="w-full" data-testid="button-combine-images">
              <i className="fas fa-layer-group ml-2"></i>
              دمج الصور
            </Button>
          </>
        )}

        {combinedImage && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-green-700 mb-3">الصورة المدمجة</h4>
              <img 
                src={combinedImage} 
                alt="Combined" 
                className="w-full rounded-lg mb-2"
                data-testid="img-combined"
              />
              <Button onClick={downloadCombinedImage} className="w-full" data-testid="button-download-combined">
                <i className="fas fa-download ml-2"></i>
                تحميل الصورة المدمجة
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const getToolTitle = () => {
    const titles = {
      "scientific-calculator": "الآلة الحاسبة العلمية",
      "age-calculator": "حاسبة العمر",
      "date-converter": "تحويل التاريخ",
      "bmi-calculator": "حاسبة مؤشر كتلة الجسم",
      "percentage-calculator": "حاسبة النسبة المئوية",
      "random-generator": "مولد الأرقام العشوائية",
      "countdown-timer": "العداد التنازلي",
      "date-difference": "حاسبة الفرق بين التواريخ",
      "tax-calculator": "حاسبة الضريبة",
      "sqrt-calculator": "حاسبة الجذر التربيعي",
      "gpa-calculator": "حاسبة المعدل التراكمي",
      "unit-converter": "محول الوحدات",
      "password-generator": "مولد كلمات المرور",
      "text-encoder": "مشفر النصوص",
      "color-palette": "منتقي الألوان",
      "timer": "المؤقت",
      "world-clock": "الساعة العالمية",
      "stopwatch": "ساعة الإيقاف",
      "image-converter": "محول الصور",
      "image-resizer": "تغيير حجم الصور",
      "image-cropper": "قص الصور",
      "image-combiner": "دمج الصور",
      "bg-remover": "إزالة الخلفية",
      "designfy": "أداة Designfy",
      "ai-image-generator": "مولد الصور بالذكاء الاصطناعي",
      "pdf-merger": "دمج ملفات PDF",
      "pdf-splitter": "تقسيم ملفات PDF",
      "qr-code": "مولد وقارئ رموز QR",
      "pdf-tools": "أدوات PDF",
      "url-shortener": "مختصر الروابط",
      "link-checker": "فاحص الروابط الخبيثة"
    };
    return titles[toolId as keyof typeof titles] || "أداة حسابية";
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getToolTitle()}</DialogTitle>
        </DialogHeader>
        {renderCalculator()}
      </DialogContent>
    </Dialog>
  );
}
