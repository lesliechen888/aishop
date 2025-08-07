'use client';

const AboutTeam = () => {
  const teamMembers = [
    {
      id: 1,
      name: '张明',
      position: '创始人 & CEO',
      description: '拥有15年时尚行业经验，曾在多家知名时尚品牌担任高管职位，致力于推动时尚行业的数字化转型。',
      expertise: ['战略规划', '品牌建设', '团队管理'],
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: '李雅',
      position: '首席设计官',
      description: '毕业于巴黎时装学院，拥有丰富的国际时尚设计经验，擅长将传统工艺与现代设计理念相结合。',
      expertise: ['产品设计', '趋势分析', '创意指导'],
      avatar: '👩‍🎨'
    },
    {
      id: 3,
      name: '王强',
      position: '首席技术官',
      description: '前谷歌工程师，专注于AI和机器学习技术在电商领域的应用，推动公司技术创新。',
      expertise: ['AI技术', '系统架构', '产品开发'],
      avatar: '👨‍💻'
    },
    {
      id: 4,
      name: '陈美',
      position: '运营总监',
      description: '拥有丰富的全球化运营经验，负责公司的国际市场拓展和供应链管理。',
      expertise: ['全球运营', '供应链', '市场拓展'],
      avatar: '👩‍💼'
    },
    {
      id: 5,
      name: '刘浩',
      position: '市场总监',
      description: '数字营销专家，擅长品牌推广和用户增长，曾帮助多个品牌实现快速增长。',
      expertise: ['数字营销', '品牌推广', '用户增长'],
      avatar: '👨‍🚀'
    },
    {
      id: 6,
      name: '赵琳',
      position: '可持续发展总监',
      description: '环境科学博士，致力于推动时尚行业的可持续发展，建立环保供应链体系。',
      expertise: ['可持续发展', '环保材料', '供应链优化'],
      avatar: '👩‍🔬'
    }
  ];

  const departments = [
    {
      name: '设计团队',
      count: 25,
      description: '来自全球的优秀设计师',
      icon: '🎨'
    },
    {
      name: '技术团队',
      count: 40,
      description: '经验丰富的工程师',
      icon: '💻'
    },
    {
      name: '运营团队',
      count: 30,
      description: '专业的运营专家',
      icon: '📊'
    },
    {
      name: '客服团队',
      count: 20,
      description: '24/7 客户服务',
      icon: '🎧'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            我们的团队
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            来自全球的优秀人才汇聚在这里，共同为创造更美好的时尚体验而努力
          </p>
        </div>

        {/* Leadership Team */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">核心团队</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-4xl mb-4">
                    {member.avatar}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h4>
                  <p className="text-blue-600 font-medium">
                    {member.position}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {member.description}
                </p>

                {/* Expertise */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">专业领域</h5>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Stats */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">团队规模</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors"
              >
                <div className="text-4xl mb-4">{dept.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {dept.name}
                </h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {dept.count}+
                </div>
                <p className="text-sm text-gray-600">
                  {dept.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Culture & Values */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              我们的文化
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              我们相信多元化和包容性是创新的源泉，每个人的独特视角都能为团队带来价值
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">多元包容</h4>
              <p className="text-gray-600 text-sm">
                来自不同背景的团队成员，共同创造多元化的工作环境
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">持续学习</h4>
              <p className="text-gray-600 text-sm">
                鼓励团队成员不断学习新技能，跟上行业发展趋势
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">工作生活平衡</h4>
              <p className="text-gray-600 text-sm">
                关注员工福祉，提供灵活的工作安排和丰富的福利
              </p>
            </div>
          </div>
        </div>

        {/* Join Us */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            加入我们的团队
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            我们正在寻找有才华、有激情的人才加入我们的团队，
            一起创造时尚行业的美好未来。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/careers"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              查看职位
            </a>
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              联系HR
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;
