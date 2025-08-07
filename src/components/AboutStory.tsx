'use client';

const AboutStory = () => {
  return (
    <section id="story" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                我们的故事
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8"></div>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Global Fashion 成立于2020年，源于一个简单而美好的愿景：
                让全世界的人们都能享受到高品质、时尚且价格合理的服装。
              </p>
              
              <p>
                我们的创始团队来自时尚、技术和可持续发展领域，
                深知传统服装行业面临的挑战。通过创新的商业模式和先进的技术，
                我们致力于打破地域界限，为全球消费者提供无缝的购物体验。
              </p>
              
              <p>
                从最初的小型工作室到如今服务全球数百万用户的平台，
                我们始终坚持"品质第一、用户至上"的核心理念，
                不断推动时尚行业向更加可持续和包容的方向发展。
              </p>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">2020</div>
                <div className="text-sm text-gray-600">公司成立</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">服务国家</div>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-32 h-32 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">我们的团队</h3>
                  <p className="text-gray-400">充满激情的时尚专家</p>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">可持续发展</div>
                  <div className="text-sm text-gray-600">环保材料</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">全球服务</div>
                  <div className="text-sm text-gray-600">24/7 支持</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
