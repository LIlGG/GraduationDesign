const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const domains = {
  dev: 'http://localhost:8080', // 测试api接口
  prod: 'https://wx.lixingyong.com' // api接口
}
export const domain = domains[env]
export const version = '1.0.1' // 版本号

export const OSSConf = {
  key: {
    accessKeyId: 'LTAI6klXkZynQctv',
    accessKeySecret: 'SvyCnqMThmPUJBbOGziWxS9Atyspm7'
  },
  timeout: 87600,
  uploadImageUrl: 'https://me-neusoft.oss-cn-beijing.aliyuncs.com'
}
