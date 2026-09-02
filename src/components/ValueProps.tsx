import React from 'react';
import { Truck, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const perks = [
    {
      icon: <Truck className="w-6 h-6 text-black stroke-[1.5]" />,
      title: 'Free Express Shipping',
      desc: 'Complimentary on orders over ฿2,500 across Thailand',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-black stroke-[1.5]" />,
      title: '30-Day Hassle-Free Returns',
      desc: 'Try on at home. Return or exchange seamlessly',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-black stroke-[1.5]" />,
      title: '100% Authentic Guarantee',
      desc: 'Precision crafted with premium grade materials',
    },
    {
      icon: <Zap className="w-6 h-6 text-black stroke-[1.5]" />,
      title: 'Engineered Ergonomics',
      desc: 'All-day cushioning designed for continuous movement',
    },
  ];

  return (
    <section className="bg-white border-b border-[#E5E5E5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {perks.map((perk, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 transition-all hover:bg-[#F5F5F5] rounded-none border border-transparent hover:border-[#E5E5E5]"
            >
              <div className="p-3 bg-[#F5F5F5] shrink-0">{perk.icon}</div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-black mb-1">
                  {perk.title}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
