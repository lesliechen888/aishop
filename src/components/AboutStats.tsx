'use client';

import { useState, useEffect } from 'react';

const AboutStats = () => {
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      id: 1,
      number: 1000000,
      suffix: '+',
      label: '全球用户',
      description: '遍布50多个国家的忠实用户',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 2,
      number: 50000,
      suffix: '+',
      label: '产品种类',
      description: '涵盖各类时尚服装',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h7a.5.5 0 000-1h-7z" clipRule="evenodd" />
        </svg>
      ),
      color: 'purple'
    },
    {
      id: 3,
      number: 50,
      suffix: '+',
      label: '服务国家',
      description: '覆盖全球主要市场',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
        </svg>
      ),
      color: 'green'
    },
    {
      id: 4,
      number: 99,
      suffix: '%',
      label: '客户满意度',
      description: '基于真实用户反馈',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      color: 'red'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const AnimatedNumber = ({ number, suffix, isVisible }: { number: number; suffix: string; isVisible: boolean }) => {
    const [displayNumber, setDisplayNumber] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = number / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
          setDisplayNumber(number);
          clearInterval(timer);
        } else {
          setDisplayNumber(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isVisible, number]);

    return (
      <span>
        {displayNumber.toLocaleString()}{suffix}
      </span>
    );
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  return (
    <section id="stats-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            数字说话
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            这些数字展现了我们的成长历程和用户的信任
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${getColorClasses(stat.color)}`}>
                {stat.icon}
              </div>

              {/* Number */}
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                <AnimatedNumber 
                  number={stat.number} 
                  suffix={stat.suffix} 
                  isVisible={isVisible} 
                />
              </div>

              {/* Label */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-gray-600">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              加入我们的全球社区
            </h3>
            <p className="text-xl mb-6 opacity-90">
              成为百万用户中的一员，享受优质的购物体验
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                立即注册
              </a>
              <a
                href="/products"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                开始购物
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
