import qiniu from 'qiniu'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filenameNew = fileURLToPath(import.meta.url)
const PUBLIC_PATH = path.dirname(__filenameNew) + '/'
// 上传凭证
const accessKey = 'gSvZYr5W9-wy4siZ_op15481nalvINlq4lM4Rh-C';
const secretKey = 'kRayvAvEUYAiAJ9PlXqDlw8jImn8WR79ox0DFK50';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const options = {
  scope: 'zaomeng-chat',
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;
// 是否使用https域名
config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;

/**
 * 遍历文件夹递归上传
 * @param {path} src 本地路径
 * @param {string} dist oos文件夹名
 * @param {boolean} isDir 是否为文件夹下文件
 */

async function addFileToOSSSync(src, dist, isDir) {
  let docs = fs.readdirSync(src);
  docs.forEach(function (doc) {
    let _src = src + '/' + doc,
      _dist = dist + '/' + doc;
    let st = fs.statSync(_src);
    // 判断是否为文件
    if (st.isFile() && dist !== "LICENSES`") {
      putOSS(_src, !isDir ? doc : `${src.split('/').pop()}/${doc}`);//如果是文件夹下文件，文件名为 fonts/文件名
    }
    // 如果是目录则递归调用自身
    else if (st.isDirectory()) {
      addFileToOSSSync(_src, _dist, true);
    }
  });
}
/**
 *单个文件上传至oss
 */
async function putOSS(src, dist) {
  try {
    const localFile = src;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = dist;
    // 文件上传
    await formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        console.log(key + "上传oss成功");
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });
  } catch (e) {
    console.log("上传失败".e);
  }
}
/**
 *上传文件启动
 */
async function upFile() {
  try {
    let src = PUBLIC_PATH + "dist";
    let docs = fs.readdirSync(src);
    await addFileToOSSSync(src, docs);
  } catch (err) {
    console.log("上传oss失败", err);
  }
}
upFile();