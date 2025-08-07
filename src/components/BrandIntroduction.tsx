'use client';

import { useLocalization } from '@/contexts/LocalizationContext';
import { brandInfo } from '@/data/mockData';

const BrandIntroduction = () => {
  const { t } = useLocalization();

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('brand.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('brand.description')}
          </p>
        </div>

        {/* Brand Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text Content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('brand.story.title')}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('brand.description')}
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('brand.story.description')}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
                {t('brand.tags.established')}
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium">
                {t('brand.tags.sustainable')}
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium">
                {t('brand.tags.global')}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🌍</div>
                  <div className="text-xl font-semibold">{t('brand.heroImage.title')}</div>
                  <div className="text-sm opacity-80">{t('brand.heroImage.subtitle')}</div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {brandInfo.values.map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t(value.title)}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t(value.description)}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('brand.cta.title')}
            </h3>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              {t('brand.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                {t('brand.cta.explore')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                {t('brand.cta.learn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandIntroduction;
