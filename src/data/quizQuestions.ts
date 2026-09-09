import { Product, QuizAnswers, QuizResultProduct } from '../types';

export interface QuizOption {
  id: string;
  label: string;
  sublabel: string;
  iconName: string;
  badge?: string;
}

export interface QuizQuestion {
  step: number;
  id: keyof QuizAnswers;
  title: string;
  description: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    step: 1,
    id: 'activity',
    title: 'คุณต้องการรองเท้าไปใช้ทำกิจกรรมอะไรเป็นหลัก?',
    description: 'เลือกการใช้งานหลักเพื่อให้เราคัดกรองหมวดหมู่ที่เหมาะสมที่สุด',
    options: [
      {
        id: 'Lifestyle',
        label: 'ใส่เที่ยว / ไลฟ์สไตล์ประจำวัน',
        sublabel: 'ใส่ไปทำงาน คาเฟ่ เดินเล่น แมตช์ได้กับทุกชุดในสไตล์มินิมอล',
        iconName: 'Footprints',
        badge: 'ยอดนิยม',
      },
      {
        id: 'Running',
        label: 'วิ่ง & ออกกำลังกายคาร์ดิโอ',
        sublabel: 'เน้นความเบา ยืดหยุ่น เด้งส่งแรง วิ่งถนนหรือวิ่งลู่',
        iconName: 'Zap',
        badge: 'สายสุขภาพ',
      },
      {
        id: 'Training',
        label: 'เข้ายิม / ฟิตเนส / ยกเวท',
        sublabel: 'ฐานรองเท้ากว้าง มั่นคง ล็อกทรงเท้า ปลอดภัยเมื่อลงน้ำหนัก',
        iconName: 'Dumbbell',
      },
      {
        id: 'Basketball',
        label: 'บาสเกตบอล / คอร์ทสปอร์ต',
        sublabel: 'หุ้มข้อพรีเมียม ซัพพอร์ตข้อเท้า ยึดเกาะคอร์ทได้ดีเยี่ยม',
        iconName: 'Trophy',
      },
    ],
  },
  {
    step: 2,
    id: 'style',
    title: 'สไตล์หรือรูปทรงรองเท้าที่คุณชื่นชอบมากที่สุด?',
    description: 'บอกดีไซน์และเอกลักษณ์ที่คุณอยากใส่เพื่อเพิ่มความมั่นใจ',
    options: [
      {
        id: 'minimal',
        label: 'Clean & Minimal (เรียบหรู คลาสสิก)',
        sublabel: 'ทรง Low-Profile เส้นสายคลีน สีขาว-ดำ ใส่ได้ไม่เบื่อ',
        iconName: 'Sparkles',
        badge: 'คลาสสิก',
      },
      {
        id: 'sporty',
        label: 'Sporty & Dynamic (สปอร์ต ปราดเปรียว)',
        sublabel: 'ดีไซน์ลู่ลม ทันสมัย ดูแอคทีฟ ผ้าถักระบายอากาศ',
        iconName: 'Flame',
      },
      {
        id: 'urban',
        label: 'Urban & Chunky (สตรีทแวร์ ตัวตึง)',
        sublabel: 'พื้นหนา Midsole โดดเด่น มีเลเยอร์ สไตล์โมเดิร์นสตรีท',
        iconName: 'Compass',
      },
      {
        id: 'hightop',
        label: 'High-Top Support (หุ้มข้อ เท่สไตล์บาสเกตบอล)',
        sublabel: 'ข้อสูง ป้องกันข้อเท้า กระชับมั่นใจ ลุคโดดเด่นสะดุดตา',
        iconName: 'Shield',
      },
    ],
  },
  {
    step: 3,
    id: 'feature',
    title: 'คุณสมบัติพิเศษที่คุณให้ความสำคัญเป็นอันดับ 1?',
    description: 'เลือกจุดเด่นของเทคโนโลยีรองเท้าที่คุณต้องการมากที่สุด',
    options: [
      {
        id: 'lightweight',
        label: 'เบาสบาย คล่องตัว เหมือนลอยได้',
        sublabel: 'ผ้าตาข่าย Knit ระบายอากาศ น้ำหนักเบาพิเศษ ไม่อับชื้น',
        iconName: 'Feather',
        badge: 'ใส่สบาย',
      },
      {
        id: 'cushion',
        label: 'นุ่มซัพพอร์ต ลดแรงกระแทกทั้งวัน',
        sublabel: 'พื้น Air หรือโฟมนุ่มพิเศษ เหมาะสำหรับคนยืนหรือเดินเยอะ',
        iconName: 'Cloud',
        badge: 'เซฟข้อเข่า',
      },
      {
        id: 'stability',
        label: 'มั่นคง ไม่ลื่น ทรงตัวยอดเยี่ยม',
        sublabel: 'พื้นยางทนทาน ยึดเกาะหนึบ ล็อกเท้ากระชับมั่นใจทุกก้าว',
        iconName: 'Anchor',
      },
      {
        id: 'durable',
        label: 'ทนทาน ดูแลรักษาง่าย ลุยได้ทุกสถานการณ์',
        sublabel: 'วัสดุพรีเมียม หนังกันละอองน้ำ เช็ดทำความสะอาดง่าย',
        iconName: 'CheckCircle2',
      },
    ],
  },
  {
    step: 4,
    id: 'size',
    title: 'ไซส์รองเท้าที่คุณสวมใส่ (EU Size)?',
    description: 'เพื่อให้เราแนะนำรุ่นที่มีสต็อกไซส์ของคุณพร้อมส่งทันที',
    options: [
      { id: '38', label: 'EU 38', sublabel: 'ความยาวเท้า ~24 cm', iconName: 'Tag' },
      { id: '39', label: 'EU 39', sublabel: 'ความยาวเท้า ~24.5 cm', iconName: 'Tag' },
      { id: '40', label: 'EU 40', sublabel: 'ความยาวเท้า ~25 cm', iconName: 'Tag' },
      { id: '41', label: 'EU 41', sublabel: 'ความยาวเท้า ~26 cm', iconName: 'Tag' },
      { id: '42', label: 'EU 42', sublabel: 'ความยาวเท้า ~26.5 cm', iconName: 'Tag', badge: 'ไซส์มาตรฐาน' },
      { id: '43', label: 'EU 43', sublabel: 'ความยาวเท้า ~27.5 cm', iconName: 'Tag' },
      { id: '44', label: 'EU 44', sublabel: 'ความยาวเท้า ~28 cm', iconName: 'Tag' },
      { id: 'all', label: 'ยังไม่แน่ใจ (ดูทุกไซส์)', sublabel: 'ต้องการดูรุ่นที่เหมาะที่สุดก่อนเลือกไซส์ภายหลัง', iconName: 'HelpCircle' },
    ],
  },
  {
    step: 5,
    id: 'budget',
    title: 'ช่วงงบประมาณที่คุณตั้งไว้?',
    description: 'เลือกระดับราคาที่คุณสะดวกในการสั่งซื้อ',
    options: [
      {
        id: 'all',
        label: 'ไม่จำกัดงบประมาณ',
        sublabel: 'แนะนำคู่ที่ตรงใจที่สุดเป็นอันดับแรก ไม่ว่าราคาใด',
        iconName: 'Sparkles',
        badge: 'แนะนำ',
      },
      {
        id: 'budget',
        label: 'ต่ำกว่า 2,600 บาท',
        sublabel: 'เน้นความคุ้มค่า ราคาสบายกระเป๋า คุณภาพมาตรฐาน',
        iconName: 'Coins',
      },
      {
        id: 'mid',
        label: '2,600 – 3,200 บาท',
        sublabel: 'สเปกยอดนิยม คุ้มราคา ฟังก์ชันครบครัน',
        iconName: 'BadgeCheck',
      },
      {
        id: 'premium',
        label: '3,200 บาทขึ้นไป',
        sublabel: 'รุ่นไฮเอนด์ เทคโนโลยีสูงสุด เช่น แอร์ซับแรง หรือคาร์บอนเพลท',
        iconName: 'Crown',
      },
    ],
  },
];

export function calculateQuizMatches(
  products: Product[],
  answers: QuizAnswers
): QuizResultProduct[] {
  return products.map((product) => {
    let score = 50; // Base score
    const reasons: string[] = [];
    const tags: string[] = [];

    // 1. Category Matching (Max +35)
    if (answers.activity !== 'all') {
      if (product.category.toLowerCase() === answers.activity.toLowerCase()) {
        score += 35;
        reasons.push(`ออกแบบตรงกับกิจกรรม "${answers.activity}" ที่คุณต้องการ`);
        tags.push(`ตรงสาย ${answers.activity}`);
      } else {
        score -= 15;
      }
    } else {
      score += 20;
    }

    // 2. Style Matching (Max +20)
    const nameLower = product.name.toLowerCase();
    const descLower = product.description.toLowerCase();

    if (answers.style === 'minimal') {
      if (nameLower.includes('classic') || descLower.includes('minimal') || descLower.includes('clean')) {
        score += 20;
        reasons.push('ดีไซน์มินิมอล คลีนตา แมตช์ง่ายตามสไตล์ที่คุณชอบ');
        tags.push('สไตล์มินิมอล');
      }
    } else if (answers.style === 'sporty') {
      if (nameLower.includes('speed') || nameLower.includes('runner') || descLower.includes('performance') || descLower.includes('velocity')) {
        score += 20;
        reasons.push('รูปทรงสปอร์ต ปราดเปรียว ลู่ลมตามที่คุณต้องการ');
        tags.push('สปอร์ตลู่ลม');
      }
    } else if (answers.style === 'urban') {
      if (nameLower.includes('urban') || nameLower.includes('street') || descLower.includes('chunky') || descLower.includes('streetwear')) {
        score += 20;
        reasons.push('ทรงชังกี้ สตรีทแวร์ทันสมัย เข้ากับลุคในเมือง');
        tags.push('ทรงชังกี้สตรีท');
      }
    } else if (answers.style === 'hightop') {
      if (nameLower.includes('court') || descLower.includes('ankle') || descLower.includes('high-top')) {
        score += 20;
        reasons.push('ทรงหุ้มข้อ ซัพพอร์ตข้อเท้าและเพิ่มความมั่นใจ');
        tags.push('ทรงหุ้มข้อกระชับ');
      }
    }

    // 3. Feature Matching (Max +20)
    if (answers.feature === 'lightweight') {
      if (descLower.includes('lightweight') || descLower.includes('mesh') || descLower.includes('featherlight')) {
        score += 20;
        reasons.push('มีน้ำหนักเบาและผ้าตาข่ายระบายอากาศได้ดีเยี่ยม');
        tags.push('น้ำหนักเบาพิเศษ');
      }
    } else if (answers.feature === 'cushion') {
      if (descLower.includes('cushioning') || descLower.includes('foam') || descLower.includes('shock-absorbing') || nameLower.includes('air')) {
        score += 20;
        reasons.push('เทคโนโลยีซับแรงกระแทกและโฟมนุ่ม รองรับการเดินนานๆ');
        tags.push('นุ่มซับแรงกระแทก');
      }
    } else if (answers.feature === 'stability') {
      if (descLower.includes('stable') || descLower.includes('traction') || descLower.includes('support') || descLower.includes('sidewalls')) {
        score += 20;
        reasons.push('โครงสร้างฐานมั่นคงและยึดเกาะพื้นได้ดีเยี่ยม');
        tags.push('เกาะหนึบทรงตัวดี');
      }
    } else if (answers.feature === 'durable') {
      if (descLower.includes('durable') || descLower.includes('rubber') || descLower.includes('leather') || descLower.includes('reinforced')) {
        score += 20;
        reasons.push('วัสดุพรีเมียม ทนทาน และดูแลทำความสะอาดง่าย');
        tags.push('ทนทานดูแลรักษาง่าย');
      }
    }

    // 4. Size Availability (Max +15)
    if (answers.size !== null) {
      if (product.sizes.includes(answers.size)) {
        score += 15;
        reasons.push(`มีไซส์ EU ${answers.size} พร้อมจัดส่งทันที`);
        tags.push(`มีไซส์ ${answers.size}`);
      } else {
        score -= 20;
      }
    }

    // 5. Budget Match (Max +10)
    if (answers.budget === 'budget') {
      if (product.price < 2600) {
        score += 10;
        reasons.push('ราคาอยู่ในช่วงงบคุ้มค่าที่คุณตั้งไว้');
        tags.push('งบคุ้มค่า');
      } else if (product.price > 3200) {
        score -= 15;
      }
    } else if (answers.budget === 'mid') {
      if (product.price >= 2600 && product.price <= 3200) {
        score += 10;
        reasons.push('ตรงกับช่วงงบประมาณ 2,600 - 3,200 บาท');
        tags.push('งบประมาณพอดี');
      }
    } else if (answers.budget === 'premium') {
      if (product.price >= 3200) {
        score += 10;
        reasons.push('รุ่นพรีเมียม สเปกสูงสุดของทางร้าน');
        tags.push('พรีเมียมสเปกท็อป');
      }
    } else {
      score += 5;
    }

    // Ensure score is capped nicely between 40% and 99%
    const finalScore = Math.max(45, Math.min(99, score));

    return {
      ...product,
      matchScore: finalScore,
      matchReasons: reasons.length > 0 ? reasons : ['รองเท้าโมเดิร์นที่สวมใส่สบายในทุกๆ วัน'],
      matchedTags: tags.length > 0 ? tags : ['Shoes Shop Pick'],
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
