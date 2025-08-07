import { NewsArticle } from '@/types';

// 新闻标题模板
const titleTemplates = {
  '时尚趋势': [
    '2024年{season}时尚趋势：{trend}成为主流',
    '{brand}发布{season}新品，{style}风格引领潮流',
    '时装周聚焦：{trend}将成为下一个时尚热点',
    '街头时尚观察：{style}穿搭正在全球流行',
    '设计师预测：{trend}将重新定义时尚美学',
    '时尚界新宠：{material}材质的创新应用',
    '复古回潮：{era}年代风格重新走红',
    '明星同款：{celebrity}的{style}穿搭引发模仿热潮',
    '时尚色彩趋势：{color}成为本季最受欢迎颜色',
    '配饰新风尚：{accessory}成为时尚达人必备单品'
  ],
  '行业动态': [
    '{brand}宣布进军{market}市场，预计投资{amount}亿元',
    '全球服装零售额{year}年预计增长{percentage}%',
    '{company}与{partner}达成战略合作，共同开拓{region}市场',
    '时尚科技：{technology}技术在服装行业的应用前景',
    '电商平台{platform}推出{feature}功能，提升购物体验',
    '供应链革新：{innovation}技术降低生产成本{percentage}%',
    '投资热点：{sector}领域获得{amount}亿元融资',
    '行业报告：{category}市场规模达到{amount}亿美元',
    '新零售模式：{model}成为服装行业发展新趋势',
    '国际贸易：{country}服装出口额同比增长{percentage}%'
  ],
  '可持续时尚': [
    '{brand}承诺{year}年实现碳中和目标',
    '环保材料突破：{material}在时尚行业的创新应用',
    '循环时尚：{brand}推出{program}回收计划',
    '可持续发展报告：时尚行业{metric}改善{percentage}%',
    '绿色生产：{technology}技术减少{pollutant}排放{percentage}%',
    '有机材料：{material}成为可持续时尚新选择',
    '零废料设计：{designer}的环保时尚理念',
    '消费者调研：{percentage}%的人愿意为环保服装付费',
    '政策支持：{country}出台{policy}促进可持续时尚发展',
    '创新回收：{technology}技术实现{material}100%回收利用'
  ],
  '品牌故事': [
    '{brand}创始人{founder}：从{background}到时尚帝国的传奇',
    '百年品牌{brand}的传承与创新之路',
    '{brand}如何在{crisis}中实现逆势增长',
    '新锐设计师{designer}：用{style}重新定义时尚',
    '{brand}的全球化战略：从{origin}走向世界',
    '时尚传奇：{brand}经典{product}的设计故事',
    '{brand}品牌重塑：如何在数字时代焕发新生',
    '家族企业{brand}的{generation}代传承故事',
    '{brand}的社会责任：用时尚改变世界',
    '创业故事：{founder}如何用{amount}元创建{brand}帝国'
  ],
  '搭配指南': [
    '{season}穿搭指南：{style}风格的完美演绎',
    '职场穿搭：如何用{pieces}打造专业形象',
    '约会穿搭：{style}风格让你成为焦点',
    '旅行穿搭：{destination}之旅的时尚行李清单',
    '身材穿搭：{bodytype}身材的显瘦搭配技巧',
    '色彩搭配：{color}系的高级穿搭法则',
    '配饰搭配：{accessory}如何提升整体造型',
    '预算穿搭：{budget}元打造时尚造型',
    '年龄穿搭：{age}岁女性的优雅搭配指南',
    '场合穿搭：{occasion}的得体着装建议'
  ],
  '科技创新': [
    'AI设计师：{technology}如何革命时尚设计',
    '智能面料：{fabric}的科技创新应用',
    '3D打印时尚：{technology}重新定义服装制造',
    '虚拟试衣：{technology}技术提升在线购物体验',
    '区块链溯源：{technology}确保时尚产品真实性',
    '可穿戴科技：{device}与时尚的完美融合',
    '数字化生产：{technology}提高制造效率{percentage}%',
    '智能零售：{technology}改变服装购物体验',
    '材料科学：{innovation}创造未来时尚面料',
    '自动化生产：{technology}降低人工成本{percentage}%'
  ]
};

// 内容模板
const contentTemplates = {
  intro: [
    '在快速变化的时尚世界中，{topic}正在成为行业关注的焦点。',
    '随着消费者需求的不断演变，{topic}展现出了巨大的发展潜力。',
    '最新的行业报告显示，{topic}将在未来几年内迎来重大变革。',
    '业内专家普遍认为，{topic}是推动时尚行业发展的关键因素。',
    '从全球视角来看，{topic}正在重新塑造时尚产业的格局。'
  ],
  body: [
    '## 市场分析\n\n根据最新数据，相关市场规模已达到{amount}亿美元，同比增长{percentage}%。这一增长主要得益于消费者对{feature}的日益重视。\n\n## 技术创新\n\n{technology}技术的应用为行业带来了革命性的变化。通过{method}，企业能够{benefit}，从而提升整体竞争力。\n\n## 消费趋势\n\n调研显示，{percentage}%的消费者表示{preference}。这一趋势反映了市场需求的深刻变化。',
    '## 行业现状\n\n当前，{sector}领域正经历着前所未有的变革。{trend}已成为推动发展的主要动力，预计将在{timeframe}内产生显著影响。\n\n## 发展机遇\n\n随着{factor}的不断完善，行业迎来了新的发展机遇。{opportunity}为企业提供了{benefit}的可能性。\n\n## 挑战与应对\n\n尽管前景乐观，但行业仍面临{challenge}等挑战。企业需要通过{solution}来应对这些问题。',
    '## 全球视野\n\n从国际市场来看，{region}地区在{aspect}方面表现突出，增长率达到{percentage}%。{country}市场的{feature}尤其值得关注。\n\n## 创新实践\n\n{company}通过{innovation}实现了{achievement}。这一成功案例为其他企业提供了宝贵的经验。\n\n## 未来展望\n\n专家预测，到{year}年，{metric}将达到{target}。这一目标的实现需要{requirement}的共同努力。'
  ],
  conclusion: [
    '总的来说，{topic}的发展前景十分广阔。随着技术的不断进步和消费者需求的持续演变，我们有理由相信这一领域将迎来更加辉煌的未来。',
    '展望未来，{topic}将继续发挥重要作用。企业需要保持创新精神，积极拥抱变化，才能在激烈的市场竞争中立于不败之地。',
    '综上所述，{topic}不仅是当前的热点，更是未来发展的趋势。只有深入理解并积极参与，才能把握住这一历史性机遇。'
  ]
};

// 作者信息
const authors = [
  { name: '李雅文', bio: '资深时尚编辑，专注可持续时尚领域研究10年' },
  { name: '张明华', bio: '电商行业分析师，专注时尚零售市场研究' },
  { name: '王绿萍', bio: '可持续发展专家，关注时尚行业环保转型' },
  { name: '陈时尚', bio: '时尚趋势分析师，拥有15年行业经验' },
  { name: '刘设计', bio: '知名时装设计师，多次获得国际设计大奖' },
  { name: '赵科技', bio: '时尚科技专家，专注智能制造和数字化转型' },
  { name: '孙品牌', bio: '品牌营销专家，服务过多个国际知名品牌' },
  { name: '周市场', bio: '市场研究专家，专注亚太地区时尚市场分析' },
  { name: '吴创新', bio: '创新管理专家，关注时尚行业商业模式创新' },
  { name: '郑全球', bio: '国际贸易专家，专注全球时尚供应链研究' }
];

// 标签库
const tagLibrary = {
  '时尚趋势': ['时尚趋势', '流行色彩', '设计风格', '时装周', '潮流预测', '街头时尚', '高级定制', '成衣设计'],
  '行业动态': ['市场分析', '行业报告', '投资并购', '企业动态', '财务数据', '战略合作', '新零售', '供应链'],
  '可持续时尚': ['可持续发展', '环保材料', '循环经济', '绿色生产', '碳中和', '有机棉', '回收利用', '社会责任'],
  '品牌故事': ['品牌历史', '创始人', '企业文化', '品牌价值', '传承创新', '品牌重塑', '国际化', '家族企业'],
  '搭配指南': ['穿搭技巧', '风格指南', '色彩搭配', '配饰选择', '身材管理', '场合着装', '预算穿搭', '季节搭配'],
  '科技创新': ['人工智能', '智能制造', '数字化', '3D打印', '虚拟现实', '区块链', '物联网', '自动化']
};

// 生成随机数据的辅助函数
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTags(tagArray: string[], count: number): string[] {
  const shuffled = [...tagArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, tagArray.length));
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// 替换模板变量
function replaceTemplateVars(template: string, vars: Record<string, string>): string {
  let result = template;
  Object.entries(vars).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return result;
}

// 生成单篇新闻文章
function generateNewsArticle(id: number, category: string): NewsArticle {
  const categoryTemplates = titleTemplates[category as keyof typeof titleTemplates];
  const titleTemplate = getRandomItem(categoryTemplates);
  
  // 模板变量
  const templateVars = {
    season: getRandomItem(['春夏', '秋冬', '春季', '夏季', '秋季', '冬季']),
    trend: getRandomItem(['可持续材料', '极简主义', '复古风格', '未来主义', '民族风情', '运动休闲']),
    brand: getRandomItem(['Zara', 'H&M', 'Uniqlo', 'Nike', 'Adidas', 'Gucci', 'Prada', 'Chanel']),
    style: getRandomItem(['简约', '复古', '街头', '优雅', '运动', '朋克', '波西米亚', '极简']),
    material: getRandomItem(['有机棉', '再生聚酯', '天丝', '亚麻', '竹纤维', '海藻纤维']),
    era: getRandomItem(['70', '80', '90', '2000']),
    celebrity: getRandomItem(['杨幂', '刘诗诗', '赵丽颖', '迪丽热巴', '古力娜扎']),
    color: getRandomItem(['薄荷绿', '珊瑚橙', '经典蓝', '紫外光', '草木绿', '玫瑰粉']),
    accessory: getRandomItem(['丝巾', '帽子', '包包', '首饰', '腰带', '墨镜']),
    market: getRandomItem(['中国', '东南亚', '欧洲', '北美', '南美', '非洲']),
    amount: getRandomItem(['10', '50', '100', '200', '500', '1000']),
    percentage: getRandomItem(['5', '10', '15', '20', '25', '30']),
    year: getRandomItem(['2024', '2025', '2026', '2027', '2028']),
    company: getRandomItem(['阿里巴巴', '腾讯', '京东', '拼多多', '美团', '字节跳动']),
    partner: getRandomItem(['微软', '谷歌', '亚马逊', 'Meta', '苹果', '三星']),
    region: getRandomItem(['亚太', '欧洲', '北美', '拉美', '中东', '非洲']),
    technology: getRandomItem(['人工智能', '区块链', '物联网', '5G', '云计算', '大数据']),
    platform: getRandomItem(['淘宝', '天猫', '京东', '拼多多', '抖音', '小红书']),
    feature: getRandomItem(['AR试衣', '个性化推荐', '智能客服', '虚拟导购', '社交购物']),
    innovation: getRandomItem(['智能制造', '柔性生产', '数字化设计', '自动化物流']),
    sector: getRandomItem(['快时尚', '奢侈品', '运动服饰', '童装', '内衣', '鞋履']),
    category: getRandomItem(['女装', '男装', '童装', '运动装', '内衣', '配饰']),
    model: getRandomItem(['O2O', 'C2M', 'DTC', 'B2C', 'C2C', 'B2B']),
    country: getRandomItem(['中国', '美国', '德国', '意大利', '法国', '日本']),
    program: getRandomItem(['回收', '租赁', '二手', '修复', '升级改造']),
    metric: getRandomItem(['碳排放', '水资源利用', '废料产生', '能源消耗']),
    pollutant: getRandomItem(['二氧化碳', '废水', '化学物质', '固体废料']),
    designer: getRandomItem(['Stella McCartney', 'Gabriela Hearst', 'Eileen Fisher']),
    policy: getRandomItem(['环保法规', '税收优惠', '补贴政策', '标准制定']),
    founder: getRandomItem(['张三', '李四', '王五', '赵六', '钱七']),
    background: getRandomItem(['工程师', '设计师', '销售员', '学生', '教师']),
    crisis: getRandomItem(['疫情', '经济危机', '供应链中断', '市场变化']),
    origin: getRandomItem(['小作坊', '网店', '实体店', '工厂', '设计工作室']),
    product: getRandomItem(['T恤', '牛仔裤', '连衣裙', '外套', '鞋子', '包包']),
    generation: getRandomItem(['二', '三', '四', '五']),
    pieces: getRandomItem(['西装', '衬衫', '裙装', '套装', '单品']),
    destination: getRandomItem(['巴黎', '东京', '纽约', '伦敦', '米兰', '首尔']),
    bodytype: getRandomItem(['梨形', '苹果形', '沙漏形', '矩形', '倒三角形']),
    budget: getRandomItem(['500', '1000', '2000', '5000', '10000']),
    age: getRandomItem(['20', '30', '40', '50', '60']),
    occasion: getRandomItem(['商务会议', '晚宴', '婚礼', '度假', '日常']),
    fabric: getRandomItem(['智能纤维', '变色面料', '抗菌材料', '温控面料']),
    device: getRandomItem(['智能手表', '健身追踪器', '智能眼镜', '智能服装']),
    topic: category,
    factor: getRandomItem(['政策支持', '技术进步', '消费升级', '市场需求']),
    timeframe: getRandomItem(['未来三年', '五年内', '十年内', '短期内']),
    opportunity: getRandomItem(['数字化转型', '绿色发展', '国际合作', '创新突破']),
    benefit: getRandomItem(['降低成本', '提高效率', '增强竞争力', '扩大市场']),
    challenge: getRandomItem(['成本压力', '技术壁垒', '人才短缺', '市场竞争']),
    solution: getRandomItem(['技术创新', '模式创新', '合作共赢', '人才培养']),
    aspect: getRandomItem(['创新能力', '市场规模', '增长速度', '技术水平']),
    achievement: getRandomItem(['市场突破', '技术领先', '成本优化', '效率提升']),
    requirement: getRandomItem(['政府', '企业', '消费者', '全社会']),
    target: getRandomItem(['新高度', '新水平', '新突破', '新台阶']),
    preference: getRandomItem(['更注重品质', '关注环保', '追求个性', '重视体验'])
  };
  
  const title = replaceTemplateVars(titleTemplate, templateVars);
  const slug = generateSlug(title) + '-' + id;
  
  // 生成摘要
  const excerpt = `${replaceTemplateVars(getRandomItem(contentTemplates.intro), templateVars)}本文将深入分析相关趋势和影响。`;
  
  // 生成内容
  const intro = replaceTemplateVars(getRandomItem(contentTemplates.intro), templateVars);
  const body = replaceTemplateVars(getRandomItem(contentTemplates.body), templateVars);
  const conclusion = replaceTemplateVars(getRandomItem(contentTemplates.conclusion), templateVars);
  
  const content = `# ${title}\n\n${intro}\n\n${body}\n\n## 总结\n\n${conclusion}`;
  
  const author = getRandomItem(authors);
  const publishDate = getRandomDate(new Date('2023-01-01'), new Date('2024-12-31'));
  
  return {
    id: id.toString(),
    title,
    slug,
    excerpt,
    content,
    featuredImage: `/images/news/${category.replace(/\s+/g, '-').toLowerCase()}-${id}.jpg`,
    category,
    tags: getRandomTags(tagLibrary[category as keyof typeof tagLibrary], getRandomNumber(3, 6)),
    author: {
      name: author.name,
      avatar: `/images/authors/${author.name.toLowerCase()}.jpg`,
      bio: author.bio
    },
    publishedAt: publishDate,
    updatedAt: publishDate,
    readTime: getRandomNumber(3, 12),
    views: getRandomNumber(100, 50000),
    likes: getRandomNumber(10, 2000),
    seoTitle: `${title} - Global Fashion`,
    seoDescription: excerpt.substring(0, 160),
    seoKeywords: getRandomItem(tagLibrary[category as keyof typeof tagLibrary]).slice(0, 5),
    language: 'zh-CN',
    isAIGenerated: true,
    sourceUrl: Math.random() > 0.7 ? `https://example.com/source-${id}` : undefined
  };
}

// 生成大量新闻数据的主函数
export function generateLargeNewsDataset(): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const categories = ['时尚趋势', '行业动态', '可持续时尚', '品牌故事', '搭配指南', '科技创新'];
  
  for (let i = 1; i <= 5000; i++) {
    const category = categories[(i - 1) % categories.length];
    articles.push(generateNewsArticle(i, category));
  }
  
  return articles;
}
