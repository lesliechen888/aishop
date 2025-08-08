import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建超级管理员
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const superAdmin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: '超级管理员',
      password: hashedPassword,
      role: 'super_admin',
      permissions: JSON.stringify(['*']),
      status: 'active',
    },
  })

  // 创建普通管理员
  const managerPassword = await bcrypt.hash('manager123', 10)
  
  const manager = await prisma.adminUser.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      name: '商品管理员',
      password: managerPassword,
      role: 'admin',
      permissions: JSON.stringify(['products', 'orders', 'users']),
      status: 'active',
    },
  })

  // 创建权限模板
  const templates = [
    {
      name: '商品管理员',
      description: '负责商品相关的所有操作',
      permissions: JSON.stringify(['products', 'product_collection', 'image_processing'])
    },
    {
      name: '订单管理员',
      description: '负责订单处理和客户服务',
      permissions: JSON.stringify(['orders', 'users', 'analytics'])
    },
    {
      name: '内容管理员',
      description: '负责内容和营销相关工作',
      permissions: JSON.stringify(['content', 'analytics'])
    },
    {
      name: '系统管理员',
      description: '负责系统配置和维护',
      permissions: JSON.stringify(['settings', 'countries', 'analytics'])
    }
  ]

  for (const template of templates) {
    await prisma.permissionTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    })
  }

  console.log('Database seeded successfully!')
  console.log('Super Admin:', superAdmin)
  console.log('Manager:', manager)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
