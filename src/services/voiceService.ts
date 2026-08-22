import { ChatMessage } from '../types';

export class VoiceService {
  private static initialMessages: Record<string, ChatMessage[]> = {
    en: [
      {
        id: 'msg_0_en',
        sender: 'assistant',
        text: 'Namaste! I am SWASTYA, your healthcare navigation assistant. Describe your symptoms (e.g., fever, body ache, acidity, stomach pain) and I will connect you to the nearest qualified doctors and hospitals.',
        timestamp: 'Just now',
        suggestedActions: [
          { label: '🩺 Describe Symptoms & Find Doctor', action: 'symptoms_help' },
          { label: '👨‍⚕️ View Nearby Doctors', action: 'view_appointments' },
          { label: '🏥 Find 24x7 Hospitals', action: 'hospitals' },
          { label: '🚨 Open Emergency Card', action: 'emergency' }
        ]
      }
    ],
    hi: [
      {
        id: 'msg_0_hi',
        sender: 'assistant',
        text: 'नमस्ते! मैं स्वास्थ्य (SWASTYA) स्वास्थ्य सहायक हूँ। अपने लक्षण (जैसे बुखार, शरीर दर्द, एसिडिटी) बताएं, और मैं आपको निकटतम डॉक्टरों और अस्पतालों से जोड़ूंगा।',
        timestamp: 'Just now',
        suggestedActions: [
          { label: '🩺 लक्षण बताएं और डॉक्टर खोजें', action: 'symptoms_help' },
          { label: '👨‍⚕️ पास के डॉक्टर देखें', action: 'view_appointments' },
          { label: '🏥 24x7 अस्पताल खोजें', action: 'hospitals' },
          { label: '🚨 इमरजेंसी कार्ड खोलें', action: 'emergency' }
        ]
      }
    ],
    bn: [
      {
        id: 'msg_0_bn',
        sender: 'assistant',
        text: 'নমস্কার! আমি স্বাস্থ্য (SWASTYA) স্বাস্থ্য সহকারী। আপনার লক্ষণের কথা বলুন (যেমন জ্বর, শরীর ব্যথা, পেটে গ্যাস) এবং আমি নিকটস্থ বিশেষজ্ঞ ডাক্তার ও হাসপাতালের সাথে সংযুক্ত করব।',
        timestamp: 'Just now',
        suggestedActions: [
          { label: '🩺 লক্ষণ বলুন ও ডাক্তার খুঁজুন', action: 'symptoms_help' },
          { label: '👨‍⚕️ কাছাকাছি ডাক্তার দেখুন', action: 'view_appointments' },
          { label: '🏥 ২৪x৭ হাসপাতাল খুঁজুন', action: 'hospitals' },
          { label: '🚨 ইমার্জেন্সি কার্ড খুলুন', action: 'emergency' }
        ]
      }
    ],
    or: [
      {
        id: 'msg_0_or',
        sender: 'assistant',
        text: 'ନମସ୍କାର! ମୁଁ ସ୍ୱାସ୍ଥ୍ୟ (SWASTYA) ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ଆପଣଙ୍କ ଲକ୍ଷଣ (ଯେପରି ଜ୍ଵର, ଗୋଡ଼ହାତ ବିନ୍ଧା, ଗ୍ୟାସ) କହନ୍ତୁ, ମୁଁ ନିକଟସ୍ଥ ଡାକ୍ତର ଓ ଡାକ୍ତରଖାନା ସହିତ ଯୋଡ଼ିବି।',
        timestamp: 'Just now',
        suggestedActions: [
          { label: '🩺 ଲକ୍ଷଣ କହନ୍ତୁ ଓ ଡାକ୍ତର ଖୋଜନ୍ତୁ', action: 'symptoms_help' },
          { label: '👨‍⚕️ ନିକଟସ୍ଥ ଡାକ୍ତର ଦେଖନ୍ତୁ', action: 'view_appointments' },
          { label: '🏥 ୨୪x୭ ଡାକ୍ତରଖାନା ଖୋଜନ୍ତୁ', action: 'hospitals' },
          { label: '🚨 ଇମର୍ଜେନ୍ସି କାର୍ଡ ଖୋଲନ୍ତୁ', action: 'emergency' }
        ]
      }
    ]
  };

  static getInitialMessages(lang: 'en' | 'hi' | 'bn' | 'or' = 'en'): ChatMessage[] {
    return this.initialMessages[lang] || this.initialMessages.en;
  }

  // Detect script or query language automatically if query is in native script
  private static autoDetectLanguage(query: string, preferredLang: 'en' | 'hi' | 'bn' | 'or'): 'en' | 'hi' | 'bn' | 'or' {
    if (/[\u0900-\u097F]/.test(query)) return 'hi'; // Devanagari (Hindi)
    if (/[\u0980-\u09FF]/.test(query)) return 'bn'; // Bengali
    if (/[\u0B00-\u0B7F]/.test(query)) return 'or'; // Odia
    return preferredLang;
  }

  static processUserInput(query: string, language: 'en' | 'hi' | 'bn' | 'or' = 'en'): ChatMessage {
    const activeLang = this.autoDetectLanguage(query, language);
    const lower = query.toLowerCase();
    let text = '';
    let actions: { label: string; action: string }[] | undefined = undefined;

    // --- 1. CRITICAL EMERGENCY & CHEST PAIN SAFETY ---
    if (
      lower.includes('chest pain') ||
      lower.includes('heart attack') ||
      lower.includes('सीने में दर्द') ||
      lower.includes('বুকে ব্যথা') ||
      lower.includes('ଛାତି ବିନ୍ଧା') ||
      lower.includes('stroke')
    ) {
      if (activeLang === 'hi') {
        text = "🚨 **आपातकालीन चेतावनी:** सीने में दर्द गंभीर हो सकता है! दवाओं का सेवन करने के बजाय तुरंत निकटतम कार्डियोलॉजिस्ट या 24x7 इमरजेंसी अस्पताल जाएं।\n🏥 **निकटतम अस्पताल:** SCB मेडिकल कॉलेज एंड कार्डियोलॉजी केंद्र (0.8 किमी दूर - 24x7 आपातकालीन सेवा उपलब्ध)।";
      } else if (activeLang === 'bn') {
        text = "🚨 **জরুরি সতর্কতা:** বুকে ব্যথা অত্যন্ত বিপজ্জনক হতে পারে! কোনো ওষুধ না খেয়ে অবিলম্বে নিকটস্থ হৃদরোগ বিশেষজ্ঞ বা ইমার্জেন্সি হাসপাতালে যান।\n🏥 **নিকটস্থ হাসপাতাল:** SCB মেডিকেল কলেজ ও কার্ডিওলজি বিভাগ (০.৮ কিমি দূরে)।";
      } else if (activeLang === 'or') {
        text = "🚨 **ଜରୁରୀ ସତର୍କତା:** ଛାତି ବିନ୍ଧା ଗୁରୁତର ହୋଇପାରେ! ଔଷଧ ନ ଖାଇ ତୁରନ୍ତ ନିକଟସ୍ଥ ହୃଦରୋଗ ବିଶେଷଜ୍ଞ କିମ୍ବା ଇମର୍ଜେନ୍ସି ହସ୍ପିଟାଲ୍ କୁ ଯାଆନ୍ତୁ।\n🏥 **ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା:** SCB ମେଡିକାଲ କଲେଜ (୦.୮ କିମି)।";
      } else {
        text = "🚨 **EMERGENCY WARNING:** Severe chest pain requires clinical emergency care! Do not attempt self-medication. Consult a Cardiologist immediately.\n🏥 **Nearest Hospital:** SCB Medical College & Cardiology Dept (0.8 km away - 24x7 Emergency ICU Available).";
      }
      actions = [
        { label: '🚨 Open Emergency Modal', action: 'emergency' },
        { label: '🏥 Route to SCB Hospital (0.8 km)', action: 'hospitals' }
      ];
    }

    // --- 2. SYMPTOM ROUTING & NEARBY DOCTOR RECOMMENDATIONS ---
    // A. FEVER / BODY ACHE / FLU
    else if (
      lower.includes('fever') || lower.includes('temperature') || lower.includes('body pain') || lower.includes('body ache') ||
      lower.includes('bukhar') || lower.includes('bukar') || lower.includes('badan dard') || lower.includes('बुखार') || lower.includes('दर्द') ||
      lower.includes('jhor') || lower.includes('jor') || lower.includes('জ্বর') || lower.includes('ব্যথা') ||
      lower.includes('jwara') || lower.includes('jwar') || lower.includes('ଜ୍ଵର') || lower.includes('ବିନ୍ଧା')
    ) {
      if (activeLang === 'hi') {
        text = "📋 **लक्षण मूल्यांकन:** बुखार और शरीर दर्द\n👨‍⚕️ **सलाह:** बिना डॉक्टर के पर्चे के खुद दवा लेने के बजाय पास के जनरल फिजिशियन से परामर्श लें।\n🏥 **निकटतम डॉक्टर:**\n1. **डॉ. बी. के. मोहंती** (जनरल मेडिसिन) - सन हॉस्पिटल एंड डायग्नोस्टिक्स (1.2 किमी दूर)\n2. **डॉ. ए. के. पट्टनायक** - अपोलो क्लिनिक (2.0 किमी दूर)";
      } else if (activeLang === 'bn') {
        text = "📋 **লক্ষণ মূল্যায়ন:** জ্বর ও শরীর ব্যথা\n👨‍⚕️ **পরামর্শ:** নিজ থেকে ওষুধ না খেয়ে নিকটস্থ জেনারেল ফিজিশিয়ান ডাক্তারের পরামর্শ নিন।\n🏥 **নিকটস্থ ডাক্তার:**\n১. **ডঃ বি. কে. মহান্তি** (জেনারেল মেডিসিন) - সান হাসপাতাল (১.২ কিমি দূরে)\n২. **ডঃ এ. কে. পট্টনায়ক** - অ্যাপোলো ক্লিনিক (২.০ কিমি দূরে)";
      } else if (activeLang === 'or') {
        text = "📋 **ଲକ୍ଷଣ ମୂଲ୍ୟାଙ୍କନ:** ଜ୍ଵର ଓ ଗୋଡ଼ହାତ ବିନ୍ଧା\n👨‍⚕️ **ପରାମର୍ଶ:** ନିଜେ ଔଷଧ ନ ଖାଇ ନିକଟସ୍ଥ ଜେନେରାଲ ଫିଜିସିଆନ୍ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।\n🏥 **ନିକଟସ୍ଥ ଡାକ୍ତର:**\n୧. **ଡାକ୍ତର ବି. କେ. ମହାନ୍ତି** - ସନ୍ ହସ୍ପିଟାଲ୍ (୧.୨ କିମି)\n୨. **ଡାକ୍ତର ଏ. କେ. ପଟ୍ଟନାୟକ** - ଆପୋଲୋ କ୍ଲିନିକ୍ (୨.୦ କିମି)";
      } else {
        text = "📋 **Symptom Assessment:** Fever & Body Ache\n👨‍⚕️ **Clinical Advice:** Avoid unprescribed self-medication. Please consult a qualified General Physician nearby for clinical diagnosis.\n🏥 **Recommended Nearby Doctors:**\n1. **Dr. B. K. Mohanty** (MD, Internal Medicine) - Sun Hospital & Diagnostics (1.2 km away)\n2. **Dr. A. K. Pattnaik** - Apollo Clinic (2.0 km away)";
      }
      actions = [
        { label: '🩺 Book Appointment with Dr. Mohanty', action: 'view_appointments' },
        { label: '🏥 Find Nearby Hospitals', action: 'hospitals' }
      ];
    }

    // B. ACIDITY / HEARTBURN / GASTRIC / INDIGESTION
    else if (
      lower.includes('acidity') || lower.includes('gas') || lower.includes('heartburn') || lower.includes('indigestion') ||
      lower.includes('gastric') || lower.includes('pet me gas') || lower.includes('एसिडिटी') || lower.includes('गैस') ||
      lower.includes('এসিডিটি') || lower.includes('গ্যাস') || lower.includes('ଗ୍ୟାସ') || lower.includes('ଅମ୍ଳ')
    ) {
      if (activeLang === 'hi') {
        text = "📋 **लक्षण मूल्यांकन:** एसिडिटी व पेट में गैस\n👨‍⚕️ **सलाह:** पास के गैस्ट्रोएंटेरोलॉजिस्ट (पेट रोग विशेषज्ञ) से सलाह लें।\n🏥 **निकटतम डॉक्टर:**\n1. **डॉ. एस. के. दास** (गैस्ट्रोएंटेरोलॉजिस्ट) - SCB मेडिकल कॉलेज (1.5 किमी दूर)\n2. **डॉ. आर. एन. सामंतराय** - कलिंगा हॉस्पिटल (2.2 किमी दूर)";
      } else if (activeLang === 'bn') {
        text = "📋 **লক্ষণ মূল্যায়ন:** এসিডিটি ও গ্যাস্ট্রিক সমস্যা\n👨‍⚕️ **পরামর্শ:** পরিপাকতন্ত্র বিশেষজ্ঞ (গ্যাস্ট্রোএন্টারোলজিস্ট) ডাক্তারের পরামর্শ নিন।\n🏥 **নিকটস্থ ডাক্তার:**\n১. **ডঃ এস. কে. দাস** (গ্যাস্ট্রোএন্টারোলজিস্ট) - SCB মেডিকেল কলেজ (১.৫ কিমি দূরে)";
      } else if (activeLang === 'or') {
        text = "📋 **ଲକ୍ଷଣ ମୂଲ୍ୟାଙ୍କନ:** ଗ୍ୟାସ ଓ ଅମ୍ଳତା\n👨‍⚕️ **ପରାମର୍ଶ:** ନିକଟସ୍ଥ ପେଟ ରୋଗ ବିଶେଷଜ୍ଞ (Gastroenterologist) ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।\n🏥 **ନିକଟସ୍ଥ ଡାକ୍ତର:**\n୧. **ଡାକ୍ତର ଏସ୍. କେ. ଦାସ** - SCB ମେଡିକାଲ (୧.୫ କିମି)";
      } else {
        text = "📋 **Symptom Assessment:** Acidity / Gastric Distress\n👨‍⚕️ **Clinical Advice:** Please consult a Gastroenterologist or General Physician to address underlying stomach reflux.\n🏥 **Recommended Nearby Doctors:**\n1. **Dr. S. K. Dash** (DM Gastroenterology) - SCB Medical OP (1.5 km away)\n2. **Dr. R. N. Samantaray** - Kalinga Hospital (2.2 km away)";
      }
      actions = [
        { label: '🩺 Book Gastroenterologist', action: 'view_appointments' },
        { label: '🏥 View Nearby Hospitals', action: 'hospitals' }
      ];
    }

    // C. STOMACH ACHE / DIARRHEA / LOOSE MOTION / VOMITING
    else if (
      lower.includes('stomach ache') || lower.includes('stomach pain') || lower.includes('loose motion') || lower.includes('diarrhea') || lower.includes('vomiting') ||
      lower.includes('pet dard') || lower.includes('दस्त') || lower.includes('पेट दर्द') || lower.includes('उल्टी') ||
      lower.includes('পেট ব্যথা') || lower.includes('পাতলা পায়খানা') || lower.includes('বমি') ||
      lower.includes('ପେଟ ବିନ୍ଧା') || lower.includes('ଝାଡ଼ା') || lower.includes('ବାନ୍ତି')
    ) {
      if (activeLang === 'hi') {
        text = "📋 **लक्षण मूल्यांकन:** पेट दर्द व दस्त\n👨‍⚕️ **सलाह:** तुरंत पास के डॉक्टर से पेट जांच करवाएं। खुद से एंटीबायोटिक या दर्द निवारक न लें।\n🏥 **निकटतम डॉक्टर:**\n1. **डॉ. पी. के. स्वाईं** - सन हॉस्पिटल (1.2 किमी)\n2. **डॉ. अनिता महापात्रा** - केआईआईएमएस हॉस्पिटल (3.0 किमी)";
      } else if (activeLang === 'bn') {
        text = "📋 **লক্ষণ মূল্যায়ন:** পেট ব্যথা ও বমি/ডায়রিয়া\n👨‍⚕️ **পরামর্শ:** ডাক্তারের পরামর্শ ছাড়া অ্যান্টিবায়োটিক খাবেন না। নিকটস্থ হাসপাতালে ডাক্তার দেখান।\n🏥 **নিকটস্থ ডাক্তার:**\n১. **ডঃ পি. কে. সোয়াইন** - সান হাসপাতাল (১.২ কিমি)";
      } else if (activeLang === 'or') {
        text = "📋 **ଲକ୍ଷଣ ମୂଲ୍ୟାଙ୍କନ:** ପେଟ ବିନ୍ଧା ଓ ଝାଡ଼ା/ବାନ୍ତି\n👨‍⚕️ **ପରାମର୍ଶ:** ନିଜେ ଔଷଧ ନ ଖାଇ ତୁରନ୍ତ ଡାକ୍ତରଙ୍କ ପାଖକୁ ଯାଆନ୍ତୁ।\n🏥 **ନିକଟସ୍ଥ ଡାକ୍ତର:**\n୧. **ଡାକ୍ତର ପି. କେ. ସ୍ୱାଇଁ** - ସନ୍ ହସ୍ପିଟାଲ୍ (୧.୨ କିମି)";
      } else {
        text = "📋 **Symptom Assessment:** Severe Abdominal Pain / Diarrhea\n👨‍⚕️ **Clinical Advice:** Do not take unprescribed antibiotics or painkillers for stomach aches. Consult a Physician immediately.\n🏥 **Recommended Nearby Doctors:**\n1. **Dr. P. K. Swain** (Physician) - Sun Hospital (1.2 km away)\n2. **Dr. Anita Mahapatra** - KIIMS Hospital (3.0 km away)";
      }
      actions = [
        { label: '🩺 Book Consultation', action: 'view_appointments' },
        { label: '🏥 Route to Hospital', action: 'hospitals' }
      ];
    }

    // D. COLD / COUGH / ALLERGY / SORE THROAT
    else if (
      lower.includes('cold') || lower.includes('cough') || lower.includes('sore throat') || lower.includes('allergy') || lower.includes('runny nose') ||
      lower.includes('sardi') || lower.includes('khansi') || lower.includes('gala kharab') || lower.includes('सर्दी') || lower.includes('खांसी') ||
      lower.includes('সর্দি') || lower.includes('কাশি') || lower.includes('গলা ব্যথা') ||
      lower.includes('ଥଣ୍ଡା') || lower.includes('କାଶ') || lower.includes('ଗଳା ବିନ୍ଧା')
    ) {
      if (activeLang === 'hi') {
        text = "📋 **लक्षण मूल्यांकन:** सर्दी, खांसी व गले में खराश\n👨‍⚕️ **सलाह:** पास के ईएनटी (नाक, कान, गला) विशेषज्ञ या फिजिशियन को दिखाएं।\n🏥 **निकटतम डॉक्टर:**\n1. **डॉ. आर. के. साहू** (ईएनटी विशेषज्ञ) - कैपिटल हॉस्पिटल (2.5 किमी दूर)\n2. **डॉ. एस. मलिक** - अपोलो क्लिनिक (2.0 किमी दूर)";
      } else if (activeLang === 'bn') {
        text = "📋 **লক্ষণ মূল্যায়ন:** সর্দি, কাশি ও গলা ব্যথা\n👨‍⚕️ **পরামর্শ:** নাক-কান-গলা (ENT) বিশেষজ্ঞ বা ডাক্তারের পরামর্শ নিন।\n🏥 **নিকটস্থ ডাক্তার:**\n১. **ডঃ আর. কে. সাহু** (ENT বিশেষজ্ঞ) - ক্যাপিটাল হাসপাতাল (২.৫ কিমি)";
      } else if (activeLang === 'or') {
        text = "📋 **ଲକ୍ଷଣ ମୂଲ୍ୟାଙ୍କନ:** ଥଣ୍ଡା, କାଶ ଓ ଗଳା ବିନ୍ଧା\n👨‍⚕️ **ପରାମର୍ଶ:** ନିକଟସ୍ଥ ENT ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।\n🏥 **ନିକଟସ୍ଥ ଡାକ୍ତର:**\n୧. **ଡାକ୍ତର ଆର. କେ. ସାହୁ** (ENT) - କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍ (୨.୫ କିମି)";
      } else {
        text = "📋 **Symptom Assessment:** Cold / Cough / Throat Infection\n👨‍⚕️ **Clinical Advice:** Consult an ENT Specialist or Pulmonologist for appropriate diagnosis.\n🏥 **Recommended Nearby Doctors:**\n1. **Dr. R. K. Sahoo** (ENT Specialist) - Capital Hospital (2.5 km away)\n2. **Dr. S. Mallick** - Apollo Clinic (2.0 km away)";
      }
      actions = [
        { label: '🩺 Book ENT Doctor', action: 'view_appointments' },
        { label: '🏥 View Nearby Hospitals', action: 'hospitals' }
      ];
    }

    // E. HEADACHE / MIGRAINE
    else if (
      lower.includes('headache') || lower.includes('head pain') || lower.includes('migraine') ||
      lower.includes('sir dard') || lower.includes('सिर दर्द') || lower.includes('মাথা ব্যথা') || lower.includes('ମୁଣ୍ଡ ବିନ୍ଧା')
    ) {
      if (activeLang === 'hi') {
        text = "📋 **लक्षण मूल्यांकन:** सिरदर्द व माइग्रेन\n👨‍⚕️ **सलाह:** लगातार सिरदर्द होने पर न्यूरोलॉजिस्ट या जनरल फिजिशियन से जांच करवाएं।\n🏥 **निकटतम डॉक्टर:**\n1. **डॉ. अनन्या सेन** (न्यूरोलॉजिस्ट/कार्डियोलॉजिस्ट) - SCB हॉस्पिटल (0.8 किमी दूर)\n2. **डॉ. एम. के. त्रिपाठी** - सन हॉस्पिटल (1.2 किमी दूर)";
      } else if (activeLang === 'bn') {
        text = "📋 **লক্ষণ মূল্যায়ন:** মাথা ব্যথা ও মাইগ্রেন\n👨‍⚕️ **পরামর্শ:** নিউরোলজিস্ট বা ডাক্তারের সাথে পরামর্শ করুন।\n🏥 **নিকটস্থ ডাক্তার:**\n১. **ডঃ অনন্যা সেন** - SCB হাসপাতাল (০.৮ কিমি দূরে)";
      } else if (activeLang === 'or') {
        text = "📋 **ଲକ୍ଷଣ ମୂଲ୍ୟାଙ୍କନ:** ମୁଣ୍ଡ ବିନ୍ଧା\n👨‍⚕️ **ପରାମର୍ଶ:** ନିଉରୋଲୋଜିଷ୍ଟ କିମ୍ବା ଡାକ୍ତରଙ୍କ ପାଖକୁ ଯାଆନ୍ତୁ।\n🏥 **ନିକଟସ୍ଥ ଡାକ୍ତର:**\n୧. **ଡାକ୍ତର ଅନନ୍ୟା ସେନ** - SCB ହସ୍ପିଟାଲ୍ (୦.୮ କିମି)";
      } else {
        text = "📋 **Symptom Assessment:** Headache / Migraine Symptoms\n👨‍⚕️ **Clinical Advice:** Persistent headaches should be clinically evaluated by a Neurologist or Physician.\n🏥 **Recommended Nearby Doctors:**\n1. **Dr. Ananya Sen** (Neurology / Cardiology) - SCB Medical College (0.8 km away)\n2. **Dr. M. K. Tripathi** - Sun Hospital (1.2 km away)";
      }
      actions = [
        { label: '🩺 Book Consultation with Dr. Sen', action: 'view_appointments' },
        { label: '🏥 View Nearby Hospitals', action: 'hospitals' }
      ];
    }

    // --- 3. CORE NAVIGATION INTENTS ---
    else if (
      lower.includes('emergency') || lower.includes('accident') || lower.includes('ambulance') || lower.includes('108') ||
      lower.includes('इमरजेंसी') || lower.includes('जरुरी') || lower.includes('জরুরি') || lower.includes('ଇମର୍ଜେନ୍ସି')
    ) {
      if (activeLang === 'hi') {
        text = "🚨 इमरजेंसी ट्रिगर सक्रिय! आपातकालीन 108 सहायता और इमरजेंसी हेल्थ कार्ड खोला जा रहा है।";
      } else if (activeLang === 'bn') {
        text = "🚨 ইমার্জেন্সি ট্রিগার সক্রিয়! অবিলম্বে ১০৮ সহায়তা এবং হেলথ কার্ড খোলা হচ্ছে।";
      } else if (activeLang === 'or') {
        text = "🚨 ଇମର୍ଜେନ୍ସି ଟ୍ରିଗର ସକ୍ରିୟ! ଜରୁରୀ ୧୦୮ ସହାୟତା ଓ ହେଲଥ୍ କାର୍ଡ ଖୋଲାଯାଉଛି।";
      } else {
        text = "Emergency trigger detected! Opening immediate 🚨 Emergency Assistance window. Connecting to 108 emergency call options and emergency medical card.";
      }
      actions = [
        { label: '🚨 Open Emergency Modal', action: 'emergency' }
      ];
    } else if (
      lower.includes('appointment') || lower.includes('doctor') || lower.includes('kab hai') ||
      lower.includes('अपॉइंटमेंट') || lower.includes('डॉक्टर') || lower.includes('অ্যাপয়েন্টমেন্ট') || lower.includes('ଡାକ୍ତର')
    ) {
      if (activeLang === 'hi') {
        text = "आपका अगला अपॉइंटमेंट डॉ. अनन्या सेन (हृदय रोग विशेषज्ञ) के साथ 22 अगस्त सुबह 10:30 बजे एससीबी मेडिकल कॉलेज में है। आप वेटिंग लाइन में #7 नंबर पर हैं।";
      } else if (activeLang === 'bn') {
        text = "আপনার পরবর্তী অ্যাপয়েন্টমেন্ট ডঃ অনন্যা সেনের (কার্ডিওলজিস্ট) সাথে ২২ আগস্ট সকাল ১০:৩০ টায়। আপনি লাইনে #৭ নম্বরে আছেন।";
      } else if (activeLang === 'or') {
        text = "ଆପଣଙ୍କର ପରବର୍ତ୍ତୀ ଆପଏଣ୍ଟମେଣ୍ଟ ଡାକ୍ତର ଅନନ୍ୟା ସେନଙ୍କ ସହ ୨୨ ଅଗଷ୍ଟ ସକାଳ ୧୦:୩୦ ରେ SCB ମେଡିକାଲ କଲେଜରେ ଅଛି।";
      } else {
        text = "Your next scheduled appointment is with Dr. Ananya Sen (Cardiologist) on 22 August at 10:30 AM at SCB Medical College. Your current estimated wait queue is #7 in line.";
      }
      actions = [
        { label: '📅 View All Appointments', action: 'view_appointments' }
      ];
    } else if (
      lower.includes('medicine') || lower.includes('dawa') || lower.includes('tablet') ||
      lower.includes('दवा') || lower.includes('ओষুধ') || lower.includes('ଔଷଧ')
    ) {
      if (activeLang === 'hi') {
        text = "आपकी अगली दवा मेटफॉर्मिन SR 500mg और एटोरवास्टैटिन 10mg आज रात 08:00 बजे निर्धारित है। क्या आप इसे लिया हुआ मार्क करना चाहते हैं?";
      } else if (activeLang === 'bn') {
        text = "আপনার পরবর্তী ওষুধ মেটফর্মিন SR 500mg রাত ০৮:০০ টায় নির্ধারিত। আপনি কি এটি নিয়েছেন বলে চিহ্নিত করতে চান?";
      } else if (activeLang === 'or') {
        text = "ଆପଣଙ୍କର ପରବର୍ତ୍ତୀ ଔଷଧ ମେଟଫର୍ମିନ୍ SR ୫୦୦ମିଗ୍ରା ଆଜି ରାତି ୦୮:୦୦ ରେ ଅଛି। ଆପଣ ଏହାକୁ ନେଇସାରିଛନ୍ତି ବୋଲି ଚିହ୍ନିତ କରିବେ କି?";
      } else {
        text = "Your next scheduled medication is Metformin SR 500 mg & Atorvastatin 10 mg scheduled for 08:00 PM tonight. Would you like to mark it as taken?";
      }
      actions = [
        { label: '✓ Mark Evening Dose Taken', action: 'mark_taken' },
        { label: '💊 View Medicine List', action: 'view_medicines' }
      ];
    } else if (
      lower.includes('claim') || lower.includes('insurance') || lower.includes('ayushman') ||
      lower.includes('बीमा') || lower.includes('বীমা') || lower.includes('ବିମା')
    ) {
      if (activeLang === 'hi') {
        text = "आपके आयुष्मान कार्ड (PM-JAY) में ₹5,00,000 में से ₹3,80,000 की शेष राशि बची है। आपका हालिया दावा #CLM-2026-8942 समीक्षाधीन है।";
      } else if (activeLang === 'bn') {
        text = "আপনার আয়ুষ্মান কার্ডে ₹৫,০০,০০০ এর মধ্যে ₹৩,৮০,০০০ অবশিষ্ট আছে। সাম্প্রতিক দাবি পর্যালোচনাধীন আছে।";
      } else if (activeLang === 'or') {
        text = "ଆପଣଙ୍କର ଆୟୁଷ୍ମାନ କାର୍ଡରେ ₹୫,୦୦,୦୦୦ ରୁ ₹୩,୮୦,୦୦୦ ବଳକା ଅଛି। ନିକଟତମ କ୍ଲେମ୍ ସମୀକ୍ଷାଧୀନ ଅଛି।";
      } else {
        text = "Your PM-JAY Ayushman Card policy has ₹3,80,000 remaining coverage out of ₹5,00,000. Your recent diagnostic claim #CLM-2026-8942 for ₹14,500 is currently 'Under Review'.";
      }
      actions = [
        { label: '💳 Open Insurance Hub', action: 'view_insurance' }
      ];
    } else {
      if (activeLang === 'hi') {
        text = `मैं आपकी सहायता कर सकता हूँ! आप पूछ सकते हैं: "बुखार के लिए पास का डॉक्टर बताएं", "मेरी अगली दवा कब है?", "अस्पताल खोजें", या "बीमा स्थिति जांचें"।`;
      } else if (activeLang === 'bn') {
        text = `আমি আপনাকে সাহায্য করতে পারি! আপনি জিজ্ঞাসা করতে পারেন: "জ্বরের জন্য নিকটস্থ ডাক্তার বলুন", "আমার পরের ওষুধ কখন?", বা "হাসপাতাল খুঁজুন"।`;
      } else if (activeLang === 'or') {
        text = `ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିପାରିବି! ଆପଣ ପଚାରିପାରିବେ: "ଜ୍ଵର ପାଇଁ ନିକଟସ୍ଥ ଡାକ୍ତର କହନ୍ତୁ", "ମୋର ପରବର୍ତ୍ତୀ ଔଷଧ କେବେ?" କିମ୍ବା "ହସ୍ପିଟାଲ୍ ଖୋଜନ୍ତୁ"।`;
      } else {
        text = `I can help you navigate SWASTYA and find nearby doctors! Ask me: "I have fever & body pain, recommend a doctor", "When is my next medicine?", "Find nearby hospitals", or "Check insurance claim".`;
      }
      actions = [
        { label: '🩺 Describe Symptoms', action: 'symptoms_help' },
        { label: '👨‍⚕️ Find Nearby Doctors', action: 'view_appointments' },
        { label: '🏥 View Hospitals', action: 'hospitals' }
      ];
    }

    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: actions
    };
  }

  static speakText(text: string, lang: string = 'en-IN'): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // Clean text of markdown asterisks, emojis, and formatting headers for natural speech
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/📋|💊|💧|🥗|☕|💤|🚨|🩺|📅|💳|✓|📄|🏥|👨‍⚕️/g, '')
        .replace(/---/g, '')
        .replace(/#/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      const langKey = lang.split('-')[0].toLowerCase(); // 'en', 'hi', 'bn', 'or'
      utterance.lang = lang;

      const executeSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          let selectedVoice = null;

          if (langKey === 'hi') {
            // Find Hindi voice
            selectedVoice = voices.find(v => 
              v.lang.toLowerCase().includes('hi') || 
              v.name.toLowerCase().includes('hindi') || 
              v.name.includes('हिन्दी') ||
              v.name.includes('Kalpana') ||
              v.name.includes('Hemant')
            );
          } else if (langKey === 'bn') {
            // Find Bengali / Bangla voice
            selectedVoice = voices.find(v => 
              v.lang.toLowerCase().includes('bn') || 
              v.name.toLowerCase().includes('bengali') || 
              v.name.toLowerCase().includes('bangla') ||
              v.name.includes('বাংলা')
            );
          } else if (langKey === 'or') {
            // Find Odia voice, or fallback to Indic/Hindi voice for phonetic clarity
            selectedVoice = voices.find(v => 
              v.lang.toLowerCase().includes('or') || 
              v.name.toLowerCase().includes('odia') || 
              v.name.toLowerCase().includes('oriya')
            ) || voices.find(v => v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi'));
          } else {
            // English (India/US) voice
            selectedVoice = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en'));
          }

          if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
          }
        }
        window.speechSynthesis.speak(utterance);
      };

      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices && availableVoices.length > 0) {
        executeSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          executeSpeak();
          window.speechSynthesis.onvoiceschanged = null;
        };
        executeSpeak();
      }
    }
  }
}
