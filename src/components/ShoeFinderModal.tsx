import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { QUIZ_QUESTIONS, calculateQuizMatches } from '../data/quizQuestions';
import { QuizAnswers, QuizResultProduct } from '../types';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Eye,
  Footprints,
  Zap,
  Dumbbell,
  Trophy,
  Flame,
  Compass,
  Shield,
  Feather,
  Cloud,
  Anchor,
  CheckCircle2,
  Tag,
  HelpCircle,
  Coins,
  BadgeCheck,
  Crown,
} from 'lucide-react';

interface ShoeFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon mapper component
const OptionIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Footprints': return <Footprints className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Dumbbell': return <Dumbbell className={className} />;
    case 'Trophy': return <Trophy className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Feather': return <Feather className={className} />;
    case 'Cloud': return <Cloud className={className} />;
    case 'Anchor': return <Anchor className={className} />;
    case 'CheckCircle2': return <CheckCircle2 className={className} />;
    case 'Tag': return <Tag className={className} />;
    case 'HelpCircle': return <HelpCircle className={className} />;
    case 'Coins': return <Coins className={className} />;
    case 'BadgeCheck': return <BadgeCheck className={className} />;
    case 'Crown': return <Crown className={className} />;
    default: return <Sparkles className={className} />;
  }
};

const DEFAULT_ANSWERS: QuizAnswers = {
  activity: 'Lifestyle',
  style: 'minimal',
  feature: 'cushion',
  size: 42,
  budget: 'all',
};

export const ShoeFinderModal: React.FC<ShoeFinderModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { products, addToCart, setQuickViewProduct, showToast } = useStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_ANSWERS);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [selectedResultSize, setSelectedResultSize] = useState<number | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const totalSteps = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentStep - 1];

  // Calculated matches
  const matchResults: QuizResultProduct[] = useMemo(() => {
    if (!isCompleted) return [];
    return calculateQuizMatches(products, answers);
  }, [products, answers, isCompleted]);

  const topMatch = matchResults[0];
  const otherMatches = matchResults.slice(1, 4);

  if (!isOpen) return null;

  const handleSelectOption = (questionId: keyof QuizAnswers, optionId: string) => {
    if (questionId === 'size') {
      const sizeValue = optionId === 'all' ? null : parseInt(optionId, 10);
      setAnswers((prev) => ({ ...prev, size: sizeValue }));
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step submit: trigger brief calculating animation
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setIsCompleted(true);
        if (answers.size) {
          setSelectedResultSize(answers.size);
        }
      }, 700);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers(DEFAULT_ANSWERS);
    setCurrentStep(1);
    setIsCompleted(false);
    setIsCalculating(false);
    setSelectedResultSize(null);
  };

  const handleAddToCart = (product: QuizResultProduct, sizeToUse?: number) => {
    const size = sizeToUse || selectedResultSize || (answers.size && product.sizes.includes(answers.size) ? answers.size : product.sizes[0]);

    if (!currentUser) {
      showToast('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงในตะกร้า', 'info');
      onClose();
      navigate('/login', {
        state: {
          from: { pathname: window.location.pathname },
          message: 'กรุณาเข้าสู่ระบบเพื่อเลือกซื้อสินค้าที่แนะนำ',
        },
      });
      return;
    }

    addToCart(product, size, 1);
    setAddedProductId(product.id);
    showToast(`เพิ่ม ${product.name} (ไซส์ ${size}) ลงในตะกร้าแล้ว`, 'success');
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const isCurrentOptionSelected = (questionId: keyof QuizAnswers, optionId: string) => {
    if (questionId === 'size') {
      if (optionId === 'all') return answers.size === null;
      return answers.size === parseInt(optionId, 10);
    }
    return answers[questionId] === optionId;
  };

  return (
    <div
      id="shoe-finder-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
    >
      <div
        id="shoe-finder-modal-container"
        className="relative bg-white w-full max-w-3xl rounded-none border border-black shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar */}
        <div className="bg-black text-white px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center rounded-full">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider">
                Shoe Finder • ค้นหารองเท้าคู่ที่ใช่
              </h2>
              <p className="text-[11px] text-neutral-400 font-normal">
                ระบบวิเคราะห์และจับคู่รองเท้าตามการใช้งานและสไตล์ของคุณ
              </p>
            </div>
          </div>
          <button
            id="shoe-finder-close-btn"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 transition-colors"
            aria-label="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculating State */}
        {isCalculating && (
          <div className="py-20 px-6 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-200 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
              <Sparkles className="w-6 h-6 absolute inset-0 m-auto text-black" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-lg font-black uppercase tracking-wider text-black">
                กำลังวิเคราะห์และคัดเลือกรองเท้า...
              </h3>
              <p className="text-xs text-neutral-500">
                ประมวลผลคำตอบเทียบกับคุณสมบัติของรองเท้าทุกรุ่นในคอลเลกชัน Shoes Shop
              </p>
            </div>
          </div>
        )}

        {/* Step-by-Step Questions Mode */}
        {!isCalculating && !isCompleted && currentQuestion && (
          <div className="p-5 sm:p-8">
            {/* Progress Bar & Counter */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                <span>คำถามที่ {currentStep} จาก {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Title & Description */}
            <div className="mb-6 text-left">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-black tracking-tight font-display mb-1.5">
                {currentQuestion.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                {currentQuestion.description}
              </p>
            </div>

            {/* Question Options Grid */}
            {currentQuestion.id === 'size' ? (
              // Specialized Grid for Shoe Sizing
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {currentQuestion.options.map((opt) => {
                  const selected = isCurrentOptionSelected('size', opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption('size', opt.id)}
                      className={`p-3.5 text-left border transition-all duration-150 relative flex flex-col justify-between ${
                        selected
                          ? 'border-black bg-black text-white shadow-md'
                          : 'border-neutral-200 bg-white hover:border-black text-black'
                      }`}
                    >
                      <div>
                        {opt.badge && (
                          <span
                            className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 mb-1.5 ${
                              selected ? 'bg-white text-black' : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        )}
                        <div className="text-sm font-black tracking-tight">{opt.label}</div>
                      </div>
                      <div
                        className={`text-[11px] mt-2 ${
                          selected ? 'text-neutral-300' : 'text-neutral-400'
                        }`}
                      >
                        {opt.sublabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              // Standard Options Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                {currentQuestion.options.map((opt) => {
                  const selected = isCurrentOptionSelected(currentQuestion.id, opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`p-4 text-left border transition-all duration-150 relative flex items-start gap-3.5 ${
                        selected
                          ? 'border-black bg-black text-white shadow-md'
                          : 'border-neutral-200 bg-white hover:border-black text-black'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-none border ${
                          selected
                            ? 'bg-white text-black border-white'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        <OptionIcon name={opt.iconName} className="w-4 h-4" />
                      </div>

                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black tracking-tight">{opt.label}</span>
                          {opt.badge && (
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 ${
                                selected ? 'bg-white text-black' : 'bg-neutral-100 text-neutral-700'
                              }`}
                            >
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            selected ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                        >
                          {opt.sublabel}
                        </p>
                      </div>

                      {selected && (
                        <div className="w-5 h-5 bg-white text-black flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions Toolbar */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`text-xs uppercase font-bold tracking-widest px-4 py-2.5 inline-flex items-center gap-2 transition-colors ${
                  currentStep === 1
                    ? 'text-neutral-300 cursor-not-allowed'
                    : 'text-black hover:bg-neutral-100'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ย้อนกลับ</span>
              </button>

              <button
                type="button"
                id="shoe-finder-next-btn"
                onClick={handleNext}
                className="bg-black text-white text-xs uppercase font-bold tracking-widest px-7 py-3 hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>{currentStep === totalSteps ? 'ดูผลลัพธ์ที่ตรงใจ' : 'ถัดไป'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {!isCalculating && isCompleted && topMatch && (
          <div className="p-5 sm:p-8 max-h-[80vh] overflow-y-auto">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-200">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-neutral-100 text-black px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>ผลการจับคู่อัจฉริยะ</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-black tracking-tight">
                  รองเท้าที่ตรงกับความต้องการของคุณ
                </h3>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black self-start sm:self-auto py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ทำแบบสอบถามใหม่</span>
              </button>
            </div>

            {/* Top Match Spotlight Card */}
            <div className="my-6 bg-[#FAFAFA] border-2 border-black p-5 sm:p-6 relative">
              <div className="absolute top-0 right-0 bg-black text-white px-3.5 py-1 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>MATCH {topMatch.matchScore}%</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Product Image */}
                <div className="md:col-span-5 aspect-square bg-white border border-neutral-200 p-4 flex items-center justify-center relative overflow-hidden group">
                  <img
                    src={topMatch.image}
                    alt={topMatch.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(topMatch)}
                    className="absolute bottom-2 right-2 bg-black text-white p-2 text-xs opacity-90 hover:opacity-100 shadow-sm"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Details & Action */}
                <div className="md:col-span-7 space-y-4 text-left">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                      {topMatch.category} • SKU: {topMatch.sku}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                      {topMatch.name}
                    </h4>
                    <div className="text-lg font-black text-black mt-1">
                      ฿{topMatch.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Why this shoe matches */}
                  <div className="bg-white border border-neutral-200 p-3.5 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
                      ทำไมคู่นี้ถึงเหมาะกับคุณ:
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-600">
                      {topMatch.matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Size Selector */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-600 mb-1.5">
                      <span>เลือกไซส์ (EU):</span>
                      <span className="text-neutral-400 font-normal">สต็อกคงเหลือ {topMatch.stock} คู่</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {topMatch.sizes.map((s) => {
                        const isCurrentSelected =
                          selectedResultSize === s || (!selectedResultSize && answers.size === s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedResultSize(s)}
                            className={`w-9 h-8 text-xs font-bold border transition-colors ${
                              isCurrentSelected
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-neutral-300 hover:border-black'
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      id="shoe-finder-add-to-cart-btn"
                      onClick={() => handleAddToCart(topMatch)}
                      className={`flex-1 py-3 px-6 text-xs uppercase font-black tracking-widest inline-flex items-center justify-center gap-2 transition-all ${
                        addedProductId === topMatch.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      {addedProductId === topMatch.id ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>เพิ่มลงในตะกร้าแล้ว!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>เพิ่มลงตะกร้าทันที</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(`/product/${topMatch.id}`);
                      }}
                      className="py-3 px-4 border border-black text-black text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Matches */}
            {otherMatches.length > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <div className="text-left mb-4">
                  <h4 className="text-sm font-black uppercase tracking-wider text-black">
                    รุ่นทางเลือกอื่นที่คุณอาจชอบ (Alternative Picks)
                  </h4>
                  <p className="text-xs text-neutral-400">
                    รุ่นที่ได้คะแนนความแมตช์ใกล้เคียงตามเงื่อนไขของคุณ
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {otherMatches.map((item) => (
                    <div
                      key={item.id}
                      className="border border-neutral-200 bg-white p-3.5 flex flex-col justify-between hover:border-black transition-colors text-left group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                          <span>{item.category}</span>
                          <span className="text-black font-extrabold">{item.matchScore}% MATCH</span>
                        </div>
                        <div className="aspect-square bg-neutral-50 p-2 mb-3 overflow-hidden flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <h5 className="text-xs font-black uppercase text-black line-clamp-1">{item.name}</h5>
                        <div className="text-xs font-bold text-neutral-800 mt-0.5">
                          ฿{item.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-black text-white text-[10px] uppercase font-bold tracking-wider py-2 hover:bg-neutral-800 transition-colors text-center"
                        >
                          ใส่ตะกร้า
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate(`/product/${item.id}`);
                          }}
                          className="px-2 py-2 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-[10px] font-bold uppercase"
                          title="ดูสินค้า"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Footer in Results */}
            <div className="mt-8 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 font-bold uppercase text-neutral-500 hover:text-black"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>เปลี่ยนคำตอบและค้นหาใหม่</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                className="bg-neutral-100 hover:bg-black hover:text-white text-black font-bold uppercase tracking-widest px-4 py-2 transition-colors"
              >
                ดูสินค้าทั้งหมดในร้าน
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
