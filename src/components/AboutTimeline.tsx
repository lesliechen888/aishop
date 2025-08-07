'use client';

const AboutTimeline = () => {
  const milestones = [
    {
      year: '2020',
      title: '公司成立',
      description: 'Global Fashion 在一个小型工作室中诞生，创始团队怀着改变时尚行业的梦想开始了这段旅程。',
      achievements: ['获得种子轮投资', '组建核心团队', '确立品牌理念'],
      isLeft: true
    },
    {
      year: '2021',
      title: '产品上线',
      description: '正式推出第一批产品线，专注于高品质的基础服装，获得了用户的积极反馈。',
      achievements: ['首批产品发布', '建立供应链', '获得1万用户'],
      isLeft: false
    },
    {
      year: '2022',
      title: '全球扩张',
      description: '开始国际化布局，将服务扩展到亚洲、欧洲和北美市场，建立了多个海外仓储中心。',
      achievements: ['进入20个国家', '建立海外仓储', '用户突破10万'],
      isLeft: true
    },
    {
      year: '2023',
      title: '技术创新',
      description: '引入AI技术优化用户体验，推出个性化推荐系统和虚拟试衣功能。',
      achievements: ['AI推荐系统', '虚拟试衣技术', '获得技术专利'],
      isLeft: false
    },
    {
      year: '2024',
      title: '可持续发展',
      description: '启动可持续发展计划，使用环保材料，建立循环经济模式，获得多项环保认证。',
      achievements: ['环保材料应用', '碳中和计划', '用户突破100万'],
      isLeft: true
    },
    {
      year: '2025',
      title: '未来愿景',
      description: '继续深化全球化战略，计划进入更多新兴市场，成为全球领先的可持续时尚品牌。',
      achievements: ['进入50个国家', '推出新产品线', '建立研发中心'],
      isLeft: false
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            发展历程
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            从初创公司到全球品牌，每一步都见证着我们的成长与蜕变
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-600 rounded-full hidden lg:block"></div>

          {/* Timeline Items */}
          <div className="space-y-12 lg:space-y-24">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex items-center ${
                  milestone.isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex-col lg:space-x-8`}
              >
                {/* Content */}
                <div className={`w-full lg:w-5/12 ${milestone.isLeft ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {/* Year Badge */}
                    <div className={`inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4`}>
                      {milestone.year}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {milestone.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {milestone.description}
                    </p>

                    {/* Achievements */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                        主要成就
                      </h4>
                      <ul className="space-y-1">
                        {milestone.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Center Point */}
                <div className="hidden lg:flex w-2/12 justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden lg:block w-5/12"></div>

                {/* Mobile Center Point */}
                <div className="lg:hidden absolute left-4 top-8">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Timeline Line */}
          <div className="absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-blue-400 to-purple-600 lg:hidden"></div>
        </div>

        {/* Future Vision */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              未来，我们将继续前行
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              我们的故事还在继续书写。每一天，我们都在为创造更美好的时尚未来而努力，
              感谢每一位用户与我们同行。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                探索产品
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;
