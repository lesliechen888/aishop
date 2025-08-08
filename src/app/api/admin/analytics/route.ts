import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start') || ''
    const endDate = searchParams.get('end') || ''

    // 模拟分析数据
    const analyticsData = {
      sales: {
        totalRevenue: 125678.90,
        totalOrders: 1234,
        averageOrderValue: 101.85,
        conversionRate: 0.0325,
        dailySales: [
          { date: '2024-01-01', revenue: 2500.00, orders: 25 },
          { date: '2024-01-02', revenue: 3200.00, orders: 32 },
          { date: '2024-01-03', revenue: 2800.00, orders: 28 },
          { date: '2024-01-04', revenue: 3500.00, orders: 35 },
          { date: '2024-01-05', revenue: 4100.00, orders: 41 },
          { date: '2024-01-06', revenue: 3800.00, orders: 38 },
          { date: '2024-01-07', revenue: 4200.00, orders: 42 },
          { date: '2024-01-08', revenue: 3600.00, orders: 36 },
          { date: '2024-01-09', revenue: 3900.00, orders: 39 },
          { date: '2024-01-10', revenue: 4500.00, orders: 45 },
          { date: '2024-01-11', revenue: 4800.00, orders: 48 },
          { date: '2024-01-12', revenue: 5200.00, orders: 52 },
          { date: '2024-01-13', revenue: 4900.00, orders: 49 },
          { date: '2024-01-14', revenue: 5500.00, orders: 55 }
        ],
        monthlySales: [
          { month: '2023-10', revenue: 85000.00, orders: 850 },
          { month: '2023-11', revenue: 92000.00, orders: 920 },
          { month: '2023-12', revenue: 105000.00, orders: 1050 },
          { month: '2024-01', revenue: 125678.90, orders: 1234 }
        ]
      },
      traffic: {
        totalVisitors: 45678,
        uniqueVisitors: 38901,
        pageViews: 156789,
        bounceRate: 0.42,
        averageSessionDuration: 185,
        topPages: [
          { page: '/', views: 25678, uniqueViews: 21234 },
          { page: '/products', views: 18456, uniqueViews: 15678 },
          { page: '/categories/t-shirts', views: 12345, uniqueViews: 10234 },
          { page: '/categories/jeans', views: 9876, uniqueViews: 8234 },
          { page: '/about', views: 5432, uniqueViews: 4567 }
        ],
        trafficSources: [
          { source: 'Google', visitors: 18234, percentage: 40 },
          { source: 'TikTok', visitors: 13678, percentage: 30 },
          { source: 'Direct', visitors: 9123, percentage: 20 },
          { source: 'Facebook', visitors: 2734, percentage: 6 },
          { source: 'Others', visitors: 1909, percentage: 4 }
        ]
      },
      products: {
        totalProducts: 156,
        topSellingProducts: [
          {
            id: 'p1',
            name: '经典白色T恤',
            sales: 234,
            revenue: 7020.00,
            image: '/images/products/tshirt-white.jpg'
          },
          {
            id: 'p2',
            name: '牛仔裤',
            sales: 189,
            revenue: 15108.00,
            image: '/images/products/jeans-blue.jpg'
          },
          {
            id: 'p3',
            name: '运动鞋',
            sales: 156,
            revenue: 12480.00,
            image: '/images/products/sneakers.jpg'
          },
          {
            id: 'p4',
            name: '连帽衫',
            sales: 134,
            revenue: 8040.00,
            image: '/images/products/hoodie.jpg'
          },
          {
            id: 'p5',
            name: '短裤',
            sales: 123,
            revenue: 4920.00,
            image: '/images/products/shorts.jpg'
          }
        ],
        categoryPerformance: [
          { category: 'T恤', sales: 456, revenue: 13680.00, products: 25 },
          { category: '牛仔裤', sales: 234, revenue: 18720.00, products: 15 },
          { category: '鞋子', sales: 189, revenue: 15120.00, products: 20 },
          { category: '外套', sales: 167, revenue: 16700.00, products: 18 },
          { category: '配饰', sales: 145, revenue: 7250.00, products: 30 }
        ]
      },
      customers: {
        totalCustomers: 8901,
        newCustomers: 1234,
        returningCustomers: 7667,
        customerLifetimeValue: 156.78,
        topCustomers: [
          {
            id: 'c1',
            name: 'John Smith',
            email: 'john@example.com',
            totalOrders: 15,
            totalSpent: 1567.89
          },
          {
            id: 'c2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            totalOrders: 12,
            totalSpent: 1234.56
          },
          {
            id: 'c3',
            name: 'Mike Wilson',
            email: 'mike@example.com',
            totalOrders: 10,
            totalSpent: 987.65
          }
        ]
      },
      geography: {
        countryStats: [
          { country: 'United States', countryCode: '🇺🇸', visitors: 18234, orders: 567, revenue: 56789.00 },
          { country: 'United Kingdom', countryCode: '🇬🇧', visitors: 8901, orders: 234, revenue: 23456.00 },
          { country: 'Canada', countryCode: '🇨🇦', visitors: 5678, orders: 156, revenue: 15678.00 },
          { country: 'Australia', countryCode: '🇦🇺', visitors: 4567, orders: 123, revenue: 12345.00 },
          { country: 'Germany', countryCode: '🇩🇪', visitors: 3456, orders: 89, revenue: 8901.00 },
          { country: 'France', countryCode: '🇫🇷', visitors: 2345, orders: 67, revenue: 6789.00 }
        ],
        cityStats: [
          { city: 'New York', country: 'United States', visitors: 5678, orders: 178 },
          { city: 'London', country: 'United Kingdom', visitors: 4567, orders: 134 },
          { city: 'Los Angeles', country: 'United States', visitors: 3456, orders: 98 },
          { city: 'Toronto', country: 'Canada', visitors: 2345, orders: 67 },
          { city: 'Sydney', country: 'Australia', visitors: 1234, orders: 45 },
          { city: 'Berlin', country: 'Germany', visitors: 987, orders: 23 },
          { city: 'Paris', country: 'France', visitors: 876, orders: 19 },
          { city: 'Chicago', country: 'United States', visitors: 765, orders: 21 },
          { city: 'Vancouver', country: 'Canada', visitors: 654, orders: 18 }
        ]
      }
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    })
  } catch (error) {
    console.error('获取分析数据失败:', error)
    return NextResponse.json(
      { success: false, message: '获取分析数据失败' },
      { status: 500 }
    )
  }
}
