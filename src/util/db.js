/* eslint-disable no-undef */
/* eslint-disable quotes */
// eslint-disable-next-line quotes
let prefix = "scuplus.dev."
// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV == "production") {
  prefix = "scuplus.production."
}

const Set = (key, value) => {
  wx.setStorageSync(prefix + key, value)
}

const Get = (key) => {
  return wx.getStorageSync(prefix + key)
}

const remove = (key) =>{
  wx.removeStorageSync(prefix + key);
}
module.exports = {
  Set,
  Get,
  remove
}
