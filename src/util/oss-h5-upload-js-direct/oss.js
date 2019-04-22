import base64 from './lib/base64'
import './lib/hmac'
import './lib/sha1'
import Crypto from './lib/crypto'
import {
    OSSConf
  } from '../../config/index.example'
import dayjs from 'dayjs'
import {
    GET
} from '../http'

/**
 * 图片检查，调用小程序接口
 * @param {string} filepath 图片路径
 */
export async function ImageCheck(filepath) {
    const res = await GET('/wechat/token')
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://api.weixin.qq.com/wxa/img_sec_check?access_token=' + res.data,
        filePath: filepath,
        name: 'media',
        success: resp => {
          const data = JSON.parse(resp.data)
          if (data === 0) {
            resolve(true)
          } else if (data === 87014) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('图片包含违法违规内容')
          } else {
            resolve(data)
          }
        },
        fail: err => {
          reject(err)
        }
      })
    })
}

export function Upload(filePath, prefix = ''){
    const filename = prefix + dayjs().format('/YYYY/M/D/') + new Date().getTime() + '.' + `${filePath}`.substr(`${filePath}`.lastIndexOf('.') + 1)
    const aliyunServerURL = OSSConf.uploadImageUrl;
    const accessid = OSSConf.key.accessKeyId;
    const policyBase64 = getPolicyBase64();
    const signature = getSignature(policyBase64);
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url : aliyunServerURL,
            filePath: filePath,
            name: 'file',
            formData: {
             'key': filename,
             'policy': policyBase64,
             'OSSAccessKeyId': accessid,
             'signature': signature,
             'success_action_status': '200',
            },
            success: function (res) {
                if (res.statusCode != 200) {
                  reject('上传错误')
                }
                resolve(aliyunServerURL+'/'+filename)
             },
            fail: function (err) {
              reject(err)
            }
        })
    })
}

function getPolicyBase64(){
    let date = new Date();
    date.setHours(date.getHours() + OSSConf.timeout);
    let srcT = date.toISOString();
    const policyText = {
       "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
       "conditions": [
          ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
       ]
    };
  
    const policyBase64 = base64.encode(JSON.stringify(policyText));
    return policyBase64;
}

function getSignature(policyBase64){
    const accesskey = OSSConf.key.accessKeySecret;
   const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
      asBytes: true
   });
   const signature = Crypto.util.bytesToBase64(bytes);
   return signature;
}