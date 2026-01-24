// 阿里云AI验证码类型声明
interface AliyunCaptchaConfig {
  region: string;
  prefix: string;
}

interface AliyunCaptchaVerifyParam {
  [key: string]: any;
}

interface AliyunCaptcha {
  show?: () => void;
  hide?: () => void;
  reset?: () => void;
}

interface AliyunCaptchaOptions {
  SceneId: string;
  mode: 'popup' | 'embed';
  element?: string;
  button?: string;
  success: (captchaVerifyParam: AliyunCaptchaVerifyParam) => void;
  fail: (errorCode: string) => void;
  error: (errorCode: string, errorMsg: string) => void;
}

interface Window {
  AliyunCaptchaConfig: AliyunCaptchaConfig;
  initAliyunCaptcha: (options: AliyunCaptchaOptions) => AliyunCaptcha;
}