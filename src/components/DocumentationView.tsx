import React, { useState } from 'react';
import { Language } from '../types';
import {
  Database,
  ShieldCheck,
  Server,
  Terminal,
  FileText,
  Copy,
  Check,
  Scale,
  Layers,
  Cpu,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Coins,
  Trophy,
  Lock,
} from 'lucide-react';

interface DocumentationViewProps {
  lang: Language;
}

interface FAQItem {
  id: string;
  category: 'draw' | 'eligibility' | 'wallet' | 'security';
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
}

const FAQ_DATA: FAQItem[] = [
  // Category 1: Draw Process & Algorithmic Fairness
  {
    id: 'faq-draw-1',
    category: 'draw',
    question: 'How does the cryptographic draw engine guarantee fairness without replacement?',
    questionHi: 'क्रिप्टोग्राफिक ड्रॉ इंजन बिना दोहराव के निष्पक्षता की गारंटी कैसे देता है?',
    answer:
      'Luckyzilla utilizes an implementation of the Fisher-Yates shuffle algorithm seeded with cryptographically secure pseudo-random entropy (256-bit OS random bytes and block header nonce). Prior to draw execution, a snapshot of all registered participants is frozen into an immutable SHA-256 hash. The algorithm then iterates through the registry, selecting 100 distinct participants without replacement, preventing any user from winning multiple grand prizes in the same draw.',
    answerHi:
      'लकीज़िला एक सत्यापन योग्य फिशर-येट्स फेरबदल एल्गोरिथ्म का उपयोग करता है जिसे 256-बिट क्रिप्टोग्राफ़िक यादृच्छिक एन्ट्रापी के साथ संचालित किया जाता है। ड्रॉ निष्पादन से पहले, सभी प्रतिभागियों का एक अपरिवर्तनीय SHA-256 स्नैपशॉट फ्रीज किया जाता है। एल्गोरिथम 100 अलग-अलग विजेताओं का चयन करता है, जिससे कोई दोहराव नहीं होता।',
  },
  {
    id: 'faq-draw-2',
    category: 'draw',
    question: 'What is the 10,000,000 registration capacity rule?',
    questionHi: '10,000,000 पंजीकरण क्षमता नियम क्या है?',
    answer:
      'In accordance with Section 4 of the platform specifications, the official live prize draw is locked until the pre-configured target capacity of 10,000,000 eligible registrations is met. In the prototype simulation mode, administrators may test the draw engine using batch fast-forward controls or simulation bypasses to verify system integrity before production launch.',
    answerHi:
      'प्लेटफ़ॉर्म नियमों के अनुसार, आधिकारिक लाइव प्राइज ड्रॉ तब तक लॉक रहता है जब तक 10,000,000 पात्र पंजीकरण पूरे नहीं हो जाते। सिमुलेशन मोड में, व्यवस्थापक परीक्षण के लिए फास्ट-फॉरवर्ड नियंत्रण का उपयोग कर सकते हैं।',
  },
  {
    id: 'faq-draw-3',
    category: 'draw',
    question: 'Can system administrators alter or manipulate completed draw results?',
    questionHi: 'क्या व्यवस्थापक ड्रॉ परिणामों में फेरबदल या बदलाव कर सकते हैं?',
    answer:
      'Structurally impossible. All completed draw records are signed with dual-officer credentials (Primary Admin + Independent Compliance Key) and committed to an immutable ledger with published SHA-256 audit hashes. The backend API enforces read-only immutability for past draws, allowing independent forensic verification at any time.',
    answerHi:
      'यह तकनीकी रूप से असंभव है। सभी ड्रॉ परिणाम दोहरे-अधिकारी हस्ताक्षर और SHA-256 हैश के साथ सील किए जाते हैं। बैकएंड एपीआई पूरा होने के बाद किसी भी परिणाम को संपादित करने की अनुमति नहीं देता है।',
  },
  {
    id: 'faq-draw-4',
    category: 'draw',
    question: 'How can participants independently verify the draw results?',
    questionHi: 'प्रतिभागी ड्रॉ परिणामों को स्वतंत्र रूप से कैसे सत्यापित कर सकते हैं?',
    answer:
      'Every completed draw generates an Algorithmic Verification Certificate containing the participant snapshot hash, entropy seed, algorithm version (LZ-DRAW-v2.1), and execution signature. Anyone can recalculate the SHA-256 hashes against the published inputs to verify that zero alterations occurred.',
    answerHi:
      'प्रत्येक ड्रॉ एक एल्गोरिथमिक सत्यापन प्रमाणपत्र उत्पन्न करता है जिसमें स्नैपशॉट हैश, बीज और परिणाम हैश शामिल होते हैं। कोई भी इन हैश की स्वतंत्र रूप से पुनर्गणना और पुष्टि कर सकता है।',
  },

  // Category 2: Prize Eligibility & Handover
  {
    id: 'faq-elig-1',
    category: 'eligibility',
    question: 'Who is legally eligible to register and participate?',
    questionHi: 'पंजीकरण और भाग लेने के लिए कानूनी रूप से कौन पात्र है?',
    answer:
      'Participants must be Indian citizens residing in eligible states, aged 18 years or older at the time of registration. Age eligibility is verified through Date of Birth (DOB) and government photo ID (Aadhaar/Passport/Voter ID) during the KYC acceptance phase.',
    answerHi:
      'प्रतिभागियों को पात्र राज्यों में रहने वाले भारतीय नागरिक होना चाहिए, जिनकी आयु 18 वर्ष या उससे अधिक हो। आयु की पुष्टि जन्म तिथि और केवाईसी दस्तावेजों के माध्यम से की जाती है।',
  },
  {
    id: 'faq-elig-2',
    category: 'eligibility',
    question: 'Which Indian states are restricted or excluded from participation?',
    questionHi: 'किन भारतीय राज्यों को भागीदारी से बाहर या प्रतिबंधित रखा गया है?',
    answer:
      'Residents of Telangana, Andhra Pradesh, Assam, and Odisha are strictly prohibited from participating due to state gaming and prize competition statutes (e.g., Telangana Gaming Act 1974, AP Gaming Amendment 2020). The registration engine automatically enforces geo-blocking and KYC rejection for these jurisdictions.',
    answerHi:
      'तेलंगाना, आंध्र प्रदेश, असम और ओडिशा के निवासियों को संबंधित राज्य गेमिंग कानूनों के तहत भाग लेने से बाहर रखा गया है। प्लेटफ़ॉर्म इन क्षेत्रों के लिए स्वचालित रूप से पंजीकरण ब्लॉक करता है।',
  },
  {
    id: 'faq-elig-3',
    category: 'eligibility',
    question: 'How are vehicle tax deductions (Section 194B TDS) and delivery managed?',
    questionHi: 'वाहन कर कटौती (धारा 194B TDS) और डिलीवरी का प्रबंधन कैसे किया जाता है?',
    answer:
      'Under Section 194B of the Indian Income Tax Act 1961, winnings of prize draws are subject to 30% TDS (plus applicable cess/surcharge). Prior to vehicle registration at the Regional Transport Office (RTO), the statutory tax escrow must be settled. Delivery is facilitated via authorized manufacturer dealerships (e.g., Lamborghini Delhi/Mumbai, Rolls-Royce India, Toyota, Mahindra) with comprehensive transit insurance included.',
    answerHi:
      'आयकर अधिनियम 1961 की धारा 194B के तहत, 30% टीडीएस अनिवार्य है। आरटीओ में वाहन पंजीकरण से पहले कर का निपटान किया जाता है। डिलीवरी अधिकृत डीलरशिप के माध्यम से पूर्ण बीमा के साथ की जाती है।',
  },
  {
    id: 'faq-elig-4',
    category: 'eligibility',
    question: 'Is there an optional cash-alternative workflow for vehicle winners?',
    questionHi: 'क्या वाहन विजेताओं के लिए नकद विकल्प की सुविधा है?',
    answer:
      'Under the proposed scheme, if explicitly approved by commercial escrow terms and relevant tax authorities, a certified cash-alternative workflow may be offered in lieu of physical asset delivery, subject to equivalent 30% TDS net settlement.',
    answerHi:
      'प्रस्तावित योजना के तहत, यदि नियामक और एस्क्रो शर्तों द्वारा अनुमोदित किया जाता है, तो 30% टीडीएस कटौती के बाद भौतिक वाहन के स्थान पर नकद विकल्प प्रदान किया जा सकता है।',
  },

  // Category 3: Rewards & Coin Wallet Mechanics
  {
    id: 'faq-wall-1',
    category: 'wallet',
    question: 'What are Reward Coins and how are they awarded to non-winners?',
    questionHi: 'रिवार्ड सिक्के क्या हैं और गैर-विजेताओं को यह कैसे मिलते हैं?',
    answer:
      'Every eligible non-winning participant automatically receives 100 Reward Coins upon completion of an official draw. This guarantees that participation is credited with consolation value that is permanently tracked in the participant’s ledger.',
    answerHi:
      'प्रत्येक गैर-विजेता प्रतिभागी को ड्रॉ समाप्त होने पर स्वचालित रूप से 100 इनाम सिक्के दिए जाते हैं, जो उनके व्यक्तिगत लेजर में स्थायी रूप से जमा होते हैं।',
  },
  {
    id: 'faq-wall-2',
    category: 'wallet',
    question: 'What is the conversion valuation of Reward Coins?',
    questionHi: 'इनाम सिक्कों का मूल्य रूपांतरण दर क्या है?',
    answer:
      'The proposed conversion baseline is 100 Reward Coins = ₹100 INR (nominal valuation). In the current staging release, all balances and coin movements operate in test simulation mode.',
    answerHi:
      'प्रस्तावित रूपांतरण आधार 100 सिक्के = ₹100 सांकेतिक मूल्य है। वर्तमान प्रोटोटाइप में सभी लेनदेन सिमुलेशन मोड में संचालित होते हैं।',
  },
  {
    id: 'faq-wall-3',
    category: 'wallet',
    question: 'Why are cash withdrawals and entry discounts currently locked in the wallet?',
    questionHi: 'वॉलेट में नकद निकासी और छूट वर्तमान में लॉक क्यों हैं?',
    answer:
      'Statutory compliance safeguards under the Prevention of Money Laundering Act (PMLA 2002) and Reserve Bank of India (RBI) Pre-Paid Payment Instrument (PPI) Master Directions require formal banking escrow certification and gaming authority licensing before stored-value redemption can be enabled. Real payouts remain strictly disabled until these conditions are met.',
    answerHi:
      'PMLA 2002 और RBI प्रीपेड पेमेंट इंस्ट्रूमेंट (PPI) नियमों के तहत अनिवार्य कानूनी मंजूरी मिलने तक नकद निकासी पूरी तरह से लॉक रखी गई है।',
  },
  {
    id: 'faq-wall-4',
    category: 'wallet',
    question: 'Can wallet balances be modified client-side or tampered with?',
    questionHi: 'क्या वॉलेट बैलेंस को क्लाइंट-साइड से बदला जा सकता है?',
    answer:
      'Strictly prohibited. All wallet credits, debits, and balance transitions are validated server-side and recorded in an append-only double-entry ledger with cryptographic audit hashes. Client apps only hold a read-only mirror of the server ledger state.',
    answerHi:
      'बिल्कुल नहीं। सभी वॉलेट परिवर्तन सर्वर-साइड सत्यापित होते हैं और एक अपरिवर्तनीय लेजर में दर्ज किए जाते हैं। क्लाइंट-साइड से कोई बदलाव संभव नहीं है।',
  },

  // Category 4: Security & Privacy
  {
    id: 'faq-sec-1',
    category: 'security',
    question: 'How is user privacy protected on public winner announcements?',
    questionHi: 'सार्वजनिक विजेता घोषणाओं पर उपयोगकर्ता गोपनीयता कैसे सुरक्षित है?',
    answer:
      'Luckyzilla strictly enforces Zero PII Public Disclosure. Participant IDs are randomized (e.g. LZ-84920419) with no embedded personal data. Public winner tables display only masked identifiers (e.g. LZ-****0419) and regional state codes. Full names, phone numbers, and identity documents are never published.',
    answerHi:
      'शून्य व्यक्तिगत प्रकटीकरण नियम लागू है। प्रतिभागी आईडी यादृच्छिक होती हैं और सार्वजनिक सूचियों पर केवल मास्क की गई आईडी (उदा. LZ-****0419) प्रदर्शित की जाती हैं।',
  },
];

export const DocumentationView: React.FC<DocumentationViewProps> = ({ lang }) => {
  const [activeDocTab, setActiveDocTab] = useState<'schema' | 'security' | 'compliance' | 'deploy' | 'faq'>('faq');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // FAQ state
  const [faqCategory, setFaqCategory] = useState<'all' | 'draw' | 'eligibility' | 'wallet' | 'security'>('all');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-draw-1');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = FAQ_DATA.filter(item => {
    const matchesCategory = faqCategory === 'all' || item.category === faqCategory;
    const query = faqSearch.toLowerCase().trim();
    const qText = (lang === 'hi' ? item.questionHi : item.question).toLowerCase();
    const aText = (lang === 'hi' ? item.answerHi : item.answer).toLowerCase();
    const matchesSearch = !query || qText.includes(query) || aText.includes(query);
    return matchesCategory && matchesSearch;
  });

  const postgresSchema = `-- LUCKYZILLA POSTGRESQL PRODUCTION DDL & MIGRATIONS SCHEMA
-- Engine: PostgreSQL 15+ with pgcrypto extension

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS & IDENTITY (Zero PII Public Identifier)
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY DEFAULT ('LZ-' || floor(10000000 + random() * 90000000)::text),
    mobile_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 encrypted mobile
    masked_mobile VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    age INT NOT NULL CHECK (age >= 18),
    state_code VARCHAR(4) NOT NULL,
    kyc_status VARCHAR(32) DEFAULT 'PENDING_DOCUMENTATION',
    status VARCHAR(32) DEFAULT 'ACTIVE_SIMULATED',
    device_fingerprint VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRIZE REGISTRATION ENTRIES / TICKETS
CREATE TABLE tickets (
    ticket_id VARCHAR(40) PRIMARY KEY, -- e.g. TKT-2026-9041-A8F2
    user_id VARCHAR(32) REFERENCES users(id) ON DELETE CASCADE,
    amount_paid_inr NUMERIC(10, 2) NOT NULL DEFAULT 1000.00,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_reference VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'ELIGIBLE_FOR_DRAW',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- 3. PARTICIPANT SNAPSHOTS (Pre-Draw Frozen State)
CREATE TABLE draw_snapshots (
    snapshot_id VARCHAR(40) PRIMARY KEY,
    total_eligible_count INT NOT NULL,
    snapshot_sha256 VARCHAR(64) NOT NULL,
    frozen_by VARCHAR(64) NOT NULL,
    algorithm_version VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OFFICIAL IMMUTABLE DRAWS
CREATE TABLE draw_records (
    draw_id VARCHAR(40) PRIMARY KEY,
    snapshot_id VARCHAR(40) REFERENCES draw_snapshots(snapshot_id),
    snapshot_sha256 VARCHAR(64) NOT NULL,
    draw_seed_hash VARCHAR(64) NOT NULL,
    execution_result_sha256 VARCHAR(64) NOT NULL,
    algorithm_version VARCHAR(64) NOT NULL,
    total_winners INT NOT NULL DEFAULT 100,
    officer_1_signature VARCHAR(128) NOT NULL,
    officer_2_signature VARCHAR(128) NOT NULL,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WINNERS ALLOCATION (100 Distinct Ranks, No Replacement)
CREATE TABLE draw_winners (
    draw_id VARCHAR(40) REFERENCES draw_records(draw_id),
    rank INT NOT NULL CHECK (rank BETWEEN 1 AND 100),
    prize_id VARCHAR(32) NOT NULL,
    prize_title VARCHAR(128) NOT NULL,
    estimated_value_inr NUMERIC(14, 2) NOT NULL,
    ticket_id VARCHAR(40) REFERENCES tickets(ticket_id),
    user_id VARCHAR(32) REFERENCES users(id),
    state_code VARCHAR(4) NOT NULL,
    claim_status VARCHAR(32) DEFAULT 'PENDING_DOCUMENTATION',
    tds_deducted_inr NUMERIC(14, 2) NOT NULL,
    delivery_docket_number VARCHAR(64),
    PRIMARY KEY (draw_id, rank)
);

-- 6. IMMUTABLE WALLET REWARD LEDGER (Double-Entry Bookkeeping)
CREATE TABLE wallet_ledger (
    id VARCHAR(40) PRIMARY KEY,
    user_id VARCHAR(32) REFERENCES users(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    entry_type VARCHAR(32) NOT NULL,
    amount_coins INT NOT NULL,
    value_inr NUMERIC(10, 2) NOT NULL,
    balance_after INT NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'SETTLED',
    audit_hash VARCHAR(64) NOT NULL
);
CREATE INDEX idx_wallet_user ON wallet_ledger(user_id);

-- 7. AUDIT TRAIL LOGS
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    action VARCHAR(64) NOT NULL,
    actor VARCHAR(64) NOT NULL,
    details TEXT NOT NULL,
    sha256_seal VARCHAR(64) NOT NULL
);`;

  return (
    <section id="docs" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
          {lang === 'hi' ? 'तकनीकी विनिर्देश एवं एफएक्यू' : 'TECHNICAL SPECIFICATION & FAQ'}
        </div>
        <h2 className="text-2xl lg:text-3xl font-luxury font-black text-slate-100">
          {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न एवं विनिर्देश' : 'Frequently Asked Questions & Architecture'}
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          {lang === 'hi'
            ? 'ड्रॉ प्रक्रिया, पात्रता, कॉइन वॉलेट और कानूनी अनुपालन से संबंधित सभी सामान्य प्रश्नों के उत्तर।'
            : 'Detailed answers on the draw engine, prize eligibility, wallet mechanics, and complete system blueprints.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveDocTab('faq')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeDocTab === 'faq'
              ? 'bg-amber-400 text-black shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'hi' ? 'सामान्य प्रश्न (FAQ)' : 'Common Questions (FAQ)'}</span>
        </button>

        <button
          onClick={() => setActiveDocTab('schema')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeDocTab === 'schema'
              ? 'bg-amber-400 text-black shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PostgreSQL Schema (DDL)</span>
        </button>

        <button
          onClick={() => setActiveDocTab('security')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeDocTab === 'security'
              ? 'bg-amber-400 text-black shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Audit Checklist</span>
        </button>

        <button
          onClick={() => setActiveDocTab('compliance')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeDocTab === 'compliance'
              ? 'bg-amber-400 text-black shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Statutory Compliance Matrix</span>
        </button>

        <button
          onClick={() => setActiveDocTab('deploy')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeDocTab === 'deploy'
              ? 'bg-amber-400 text-black shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Deployment Runbook & Env</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* TAB: FAQ */}
        {activeDocTab === 'faq' && (
          <div className="space-y-6">
            {/* Search & Category Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              {/* Category Segmented Control */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setFaqCategory('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    faqCategory === 'all'
                      ? 'bg-amber-400 text-black font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'hi' ? 'सभी प्रश्न' : 'All Topics'}
                </button>
                <button
                  onClick={() => setFaqCategory('draw')}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    faqCategory === 'draw'
                      ? 'bg-amber-400 text-black font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'ड्रॉ प्रक्रिया' : 'Draw Process'}</span>
                </button>
                <button
                  onClick={() => setFaqCategory('eligibility')}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    faqCategory === 'eligibility'
                      ? 'bg-amber-400 text-black font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'इनाम एवं पात्रता' : 'Prize & Eligibility'}</span>
                </button>
                <button
                  onClick={() => setFaqCategory('wallet')}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    faqCategory === 'wallet'
                      ? 'bg-amber-400 text-black font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'कॉइन वॉलेट' : 'Wallet Mechanics'}</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'प्रश्नों में खोजें...' : 'Search questions or keywords...'}
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  {lang === 'hi'
                    ? 'आपकी खोज से मेल खाने वाला कोई प्रश्न नहीं मिला।'
                    : 'No matching questions found. Try adjusting your query or selecting "All Topics".'}
                </div>
              ) : (
                filteredFaqs.map(item => {
                  const isOpen = expandedFaqId === item.id;
                  const question = lang === 'hi' ? item.questionHi : item.question;
                  const answer = lang === 'hi' ? item.answerHi : item.answer;

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-700"
                    >
                      <button
                        onClick={() => toggleFaq(item.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-bold text-slate-200 hover:text-amber-300 transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            {item.category.toUpperCase()}
                          </span>
                          <span className="text-sm font-semibold">{question}</span>
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/50 animate-fadeIn">
                          <p>{answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Summary Pill Notice */}
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">
                  {lang === 'hi' ? 'महत्वपूर्ण सूचना: ' : 'Official Compliance Guarantee: '}
                </span>
                {lang === 'hi'
                  ? 'लकीज़िला एक प्रस्तावित सिमुलेशन प्लेटफॉर्म है। पूर्ण कानूनी मंजूरी और एस्क्रो सत्यापन के बिना वास्तविक धन स्वीकार नहीं किया जाता है।'
                  : 'Luckyzilla is currently provisioned in strict simulation mode. Real-money participation and cash payouts remain locked until state-wise legal licenses, bank escrow deeds, and payment provider clearances are finalized.'}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Schema */}
        {activeDocTab === 'schema' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono">
                migrations/001_create_luckyzilla_schema.sql
              </span>
              <button
                onClick={() => copyToClipboard(postgresSchema, 'schema')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
              >
                {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'schema' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {postgresSchema}
            </pre>
          </div>
        )}

        {/* TAB: Security */}
        {activeDocTab === 'security' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100">
              Section 11 Security & Integrity Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-semibold block">Cryptographic PRNG Nonce & Seed</span>
                <p className="text-slate-400 leading-relaxed">
                  Draw runs using Fisher-Yates with Mersenne / OS cryptographic entropy (crypto.randomBytes 256-bit). Seed and snapshot hashes are published immediately, preventing retroactive modification.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-semibold block">Zero PII Leakage Architecture</span>
                <p className="text-slate-400 leading-relaxed">
                  Public identifiers (e.g. LZ-84920419) are randomized and contain no phone number, birth year, or names. Masks public displays to LZ-****0419.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-semibold block">Anti-Sybil Device Fingerprinting</span>
                <p className="text-slate-400 leading-relaxed">
                  Device hashes and carrier metadata are analyzed for rapid multi-account generation. Automated rate-limiting locks OTP requests exceeding 5 per 10 minutes.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-semibold block">Two-Person Authorization Principle</span>
                <p className="text-slate-400 leading-relaxed">
                  No single administrator can execute a live draw or modify financial balances. Draw execution requires both Primary Admin token and Compliance Officer Key.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Compliance */}
        {activeDocTab === 'compliance' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100">
              Section 10 Legal & Jurisdictional Configuration
            </h3>
            <p className="text-slate-400 leading-relaxed">
              India operates under federal and state gaming statutes. State exemptions, promotional contest laws, and tax deductions must be rigorously observed.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200">1. Section 194B Tax Deducted at Source (TDS):</span>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Under the Income Tax Act 1961, winnings exceeding ₹10,000 are subject to mandatory 30% TDS (plus applicable cess/surcharge). For physical motor vehicles, the TDS amount must be deposited into the government tax account before registration certificate (RC) is transferred to the winner.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200">2. Prohibited State Exclusions:</span>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Telangana, Andhra Pradesh, Assam, and Odisha strictly prohibit paid consideration prize competitions under their respective state enactments. The platform automatically blocks IP ranges and address KYC originating from these regions.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200">3. Prevention of Money Laundering Act (PMLA 2002):</span>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  Cash redemption and stored-value coin transfers are locked. Real-money operations cannot be launched until full escrow trust accounts with a scheduled commercial bank are certified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Deployment Runbook */}
        {activeDocTab === 'deploy' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100">
              Environment Template & Production Deployment
            </h3>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-amber-400 font-bold mb-2">.env.example</div>
              <div>PORT=3000</div>
              <div>NODE_ENV=production</div>
              <div>SIMULATION_MODE=true</div>
              <div>APP_URL=https://luckyzilla.example.com</div>
              <div>DATABASE_URL=postgresql://lz_user:password@localhost:5432/luckyzilla</div>
              <div>SECONDARY_OFFICER_KEY=LEGAL-GOV-2026-VERIFIED</div>
              <div>ESCROW_BANK_ACCOUNT=SCHEDULED_BANK_ESCROW_ID</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200">Run Instructions:</span>
              <div className="font-mono text-slate-400 space-y-1">
                <div>npm install</div>
                <div>npm run dev (Runs Express full-stack API + Vite on port 3000)</div>
                <div>npm run build (Compiles production client bundle into dist/)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
