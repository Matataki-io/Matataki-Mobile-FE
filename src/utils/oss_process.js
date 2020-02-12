import API from '@/api/API'
// oss process image
export default (src, {w, h} = {}) => {
  let process = '?x-oss-process=image/resize'
  w && (process += `,w_${w}`)
  h && (process += `,h_${h}`)
  return (w || h) ? API.getImg(src).concat(process) : API.getImg(src)
}