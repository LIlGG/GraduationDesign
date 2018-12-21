const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const domains = {
  dev: 'http://localhost:8080', // 测试api接口
  prod: 'https://4e14ccec-abcc-46a7-a4fa-d99bd2a0cdd9.mock.pstmn.io' // api接口
}
export const domain = domains[env]
export const version = '0.8.0' // 版本号

export const COSConf = {
  key: {
    SecretId: 'xxx',
    SecretKey: 'xxx'
  },
  bucket: 'xxx',
  region: 'xxx'
}
