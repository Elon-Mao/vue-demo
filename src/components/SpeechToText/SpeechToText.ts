declare interface WebkitSpeechRecognition {
  lang: string | undefined
  continuous: boolean | undefined
  start: () => void
  stop: () => void
  onend: () => void
  onresult: (event: { results: SpeechRecognitionResult[] }) => void
}

declare const window: {
  webkitSpeechRecognition: new () => WebkitSpeechRecognition
}

export class SpeechRecognizer {
  recognition: WebkitSpeechRecognition
  results: SpeechRecognitionResult[] = []

  constructor(lang: string) {
    this.recognition = new window.webkitSpeechRecognition()
    this.recognition.lang = lang
    this.recognition.continuous = true
    this.recognition.onresult = (event: {
      results: SpeechRecognitionResult[]
    }) => {
      this.results = [...event.results]
    }
  }

  startSpeech() {
    this.recognition.start()
  }

  stopSpeech(callback: (results: string) => void) {
    this.recognition.onend = () => {
      callback(this.results.map(result => result[0].transcript).join())
    }
    this.recognition.stop()
  }
}

export const EnglishRecognizer = new SpeechRecognizer('en-US')