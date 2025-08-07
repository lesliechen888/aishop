// 社交登录配置和工具函数

export interface SocialAuthConfig {
  google: {
    clientId: string;
    redirectUri: string;
  };
  facebook: {
    appId: string;
    redirectUri: string;
  };
}

// 配置信息（实际项目中应该从环境变量读取）
export const socialAuthConfig: SocialAuthConfig = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'your-facebook-app-id',
    redirectUri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback',
  },
};

// Google OAuth URL 生成
export const getGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: socialAuthConfig.google.clientId,
    redirect_uri: socialAuthConfig.google.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Facebook OAuth URL 生成
export const getFacebookAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: socialAuthConfig.facebook.appId,
    redirect_uri: socialAuthConfig.facebook.redirectUri,
    response_type: 'code',
    scope: 'email,public_profile',
  });

  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
};

// 社交登录用户信息接口
export interface SocialUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'facebook';
}

// Google 用户信息获取
export const getGoogleUserInfo = async (accessToken: string): Promise<SocialUser | null> => {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    const data = await response.json();

    if (response.ok) {
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar: data.picture,
        provider: 'google',
      };
    }
    return null;
  } catch (error) {
    console.error('获取Google用户信息失败:', error);
    return null;
  }
};

// Facebook 用户信息获取
export const getFacebookUserInfo = async (accessToken: string): Promise<SocialUser | null> => {
  try {
    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
    const data = await response.json();

    if (response.ok) {
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar: data.picture?.data?.url,
        provider: 'facebook',
      };
    }
    return null;
  } catch (error) {
    console.error('获取Facebook用户信息失败:', error);
    return null;
  }
};

// 社交登录处理函数
export const handleSocialLogin = (provider: 'google' | 'facebook') => {
  let authUrl: string;

  switch (provider) {
    case 'google':
      authUrl = getGoogleAuthUrl();
      break;
    case 'facebook':
      authUrl = getFacebookAuthUrl();
      break;
    default:
      console.error('不支持的社交登录提供商:', provider);
      return;
  }

  // 保存当前页面URL，登录成功后重定向
  const currentUrl = window.location.pathname + window.location.search;
  localStorage.setItem('socialLoginRedirect', currentUrl);

  // 跳转到社交登录页面
  window.location.href = authUrl;
};

// 检查是否为社交登录回调
export const isSocialLoginCallback = (): boolean => {
  const path = window.location.pathname;
  return path.includes('/auth/google/callback') || path.includes('/auth/facebook/callback');
};

// 获取URL参数
export const getUrlParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};
