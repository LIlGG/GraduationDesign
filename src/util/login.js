/* eslint-disable no-undef */
import db from './db'
import Http from './http'

export default class Login {
  /** 验证用户授权是否过期 */
  checkSession() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: () => resolve(),
        // eslint-disable-next-line prefer-promise-reject-errors
        fail: () => reject()
      })
    })
  }
  /** 获取登录之后的Token */
  async getToken() {
    let token = db.Get('token')
    if (!token) {
      await this.login()
    } else {
      try {
        await this.checkSession()
      } catch (error) {
        await this.login()
      }
    }
  }
  /** 执行登录操作 */
  async login() {
    try {
      // 微信登录
      const code = await this.wxLogin()
      // 登录服务器
      const resp = await Http.Post('/login', {
        code: code
      })
      if (resp.status === 0) {
        const data = resp.data
        // 缓存登录之后的数据
        for (const key in data) {
          db.Set(key, data[key])
        }
        //判断登录的账号是否绑定教务处
        if (data.jwc_verify === 0 && data.verify === 0) {
          wx.showModal({
            title: '账号绑定', // 提示的标题,
            content: '同学您好，您暂时未绑定教务处或统一认证中心账号\r\n如果您是研究生同学可以点击首页研究生按钮设置用户类型，再绑定统一认证中心账号\r\n若为本科同学请绑定教务处账号', // 提示的内容,
            confirmColor: '#3CC51F', // 确定按钮的文字颜色,
            success: res => {}
          })
        }
      } else {
        // eslint-disable-next-line no-throw-literal
        throw '登录失败！'
      }
    } catch (err) {
      this.showErr()
      console.log('err', err)
    }
  }
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.code) {
            resolve(res.code)
          } else {
            reject(res.errMsg)
          }
        },
        fail: err => reject(err)
      })
    })
  }
  showErr() {
    const self = this
    wx.showModal({
      title: '登录失败', // 提示的标题,
      content: '点击确认重试，或者后台关闭小程序重新进入再试', // 提示的内容,
      confirmColor: '#3CC51F', // 确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {
          self.getToken()
        }
      }
    })
  }
}
