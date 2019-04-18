// 判断是否为空数组
export const isEmptyArray = arr => Array.isArray(arr) && arr.length !== 0;
// 睡眠方法 可以不用在setTimeout里面写逻辑
export const sleep = time => new Promise(resolve => setTimeout(resolve, time));
