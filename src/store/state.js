/*
vuex最核心的管理模块
 */
export default {
  latitude: 31.38098,  // 纬度
  longitude: 121.50146, // 经度
  address: {},  // 地址信息对象
  categorys: [], // 分类数组
  shops: [],  //商家数组
  user: {}, // 用来保存用户信息
  goods: [], // 商家的食物数组
  info: {},  // 商家信息
  ratings: [], // 评价
  cartFoods: []  // 购物车数据,一个goods中选定的foods中一些food数组
}
