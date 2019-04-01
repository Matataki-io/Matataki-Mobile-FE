// 仅用于 import && export
// 使用例子
// 之前: `import { xxx } from '@/api/backend'`
// 之后: `import { xxx } from '@/api/'`
import defaultImagesUploader from './imagesUploader';

// This line below is exports

export {
  getArticlesList, publishArticle, auth, getAuth,
  getArticleData, getArticleInfo,
  Follow, Unfollow, getUser,
  getSharesbysignid, sendComment, addReadAmount,
} from './backend';
export { defaultImagesUploader };
