import qs from 'qs'
import request from '@/utils/request'

export const apiServer = process.env.VUE_APP_API
function sendPost({ title, author, desc, content }) {
  const stringifyData = qs.stringify({
    'data[title]': title,
    'data[author]': author,
    'data[desc]': desc,
    'data[content]': content
  })
  return request({
    method: 'post',
    url: '/post/ipfs',
    data: stringifyData,
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  })
}

function getIpfsByArticleId(id) {
  return request({
    method: 'get',
    url: `/p/${id}/ipfs/`
  })
}
// eslint-disable-next-line import/prefer-default-export
export { sendPost, getIpfsByArticleId }

// 图片上传接口
export const ifpsUpload = `${apiServer}/ipfs/upload`
