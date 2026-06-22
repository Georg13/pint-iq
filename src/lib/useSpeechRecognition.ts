'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useLocale } from 'next-intl'

// Типы для Web Speech API
interface SpeechRecognitionResult {
  transcript: string
}

interface SpeechRecognitionEvent extends Event {
  results: { [index: number]: { [index: number]: SpeechRecognitionResult } }
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface ISpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition
    webkitSpeechRecognition?: new () => ISpeechRecognition
  }
}

// Сопоставляем locale приложения с языковым кодом для распознавания речи
const LOCALE_TO_SPEECH_LANG: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
}

export const useSpeechRecognition = () => {
  const locale = useLocale()
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)   // по умолчанию false и на сервере, и при первом клиентском рендере
  const recognitionRef = useRef<ISpeechRecognition | null>(null)

  // Проверяем поддержку ПОСЛЕ монтирования(сервер и первый клиентский рендер совпадают)
    useEffect(() => {
    const timer = setTimeout(() => {
        setIsSupported(
        window.SpeechRecognition !== undefined || window.webkitSpeechRecognition !== undefined
        )
    }, 0)
    return () => clearTimeout(timer)
    }, [])

  const startListening = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionClass) return

    const recognition = new SpeechRecognitionClass()
    recognition.lang = LOCALE_TO_SPEECH_LANG[locale] ?? 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    setIsListening(true)
    recognition.start()
  }, [locale])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return { isSupported, isListening, startListening, stopListening }
}