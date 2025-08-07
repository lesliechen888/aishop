'use client';

import { useState } from 'react';

const ContactFAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData = [
    {
      id: 1,
      category: '订单相关',
      question: '如何查看我的订单状态？',
      answer: '您可以通过以下方式查看订单状态：1. 登录您的账户，在"我的订单"中查看；2. 使用订单号在"订单查询"页面查询；3. 查看我们发送到您邮箱的订单更新邮件。'
    },
    {
      id: 2,
      category: '配送相关',
      question: '配送需要多长时间？',
      answer: '配送时间取决于您的地址：国内配送通常需要3-7个工作日；国际配送需要7-15个工作日。我们提供多种配送选项，包括标准配送和加急配送。'
    },
    {
      id: 3,
      category: '退换货',
      question: '如何申请退换货？',
      answer: '我们支持7天无理由退换货。请确保商品未使用且包装完整。您可以在"我的订单"中申请退换货，或联系客服协助处理。退货运费由我们承担。'
    },
    {
      id: 4,
      category: '支付相关',
      question: '支持哪些支付方式？',
      answer: '我们支持多种支付方式：信用卡（Visa、MasterCard、American Express）、PayPal、Apple Pay、Google Pay，以及各地区的本地支付方式。'
    },
    {
      id: 5,
      category: '产品相关',
      question: '如何选择合适的尺码？',
      answer: '每个产品页面都有详细的尺码表。建议您测量自己的身体尺寸并对照尺码表选择。如果您不确定，可以联系客服获得专业建议。'
    },
    {
      id: 6,
      category: '账户相关',
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入您的邮箱地址，我们会发送重置密码的链接到您的邮箱。如果没有收到邮件，请检查垃圾邮件文件夹。'
    },
    {
      id: 7,
      category: '优惠活动',
      question: '如何获得优惠码？',
      answer: '您可以通过以下方式获得优惠码：1. 订阅我们的邮件通讯；2. 关注我们的社交媒体；3. 参与我们的活动；4. 生日当月会收到专属优惠码。'
    },
    {
      id: 8,
      category: '技术支持',
      question: '网站使用遇到问题怎么办？',
      answer: '如果遇到技术问题，请尝试：1. 清除浏览器缓存；2. 使用其他浏览器；3. 检查网络连接。如果问题仍然存在，请联系技术支持团队。'
    }
  ];

  const categories = [...new Set(faqData.map(item => item.category))];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            常见问题
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            在这里您可以找到最常见问题的答案，如果没有找到您需要的信息，
            请随时联系我们的客服团队
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      {item.question}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openItems.includes(item.id) ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {openItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              还没找到答案？
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              我们的客服团队随时为您提供帮助，无论您有任何问题都可以联系我们
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact-form"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                发送消息
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
