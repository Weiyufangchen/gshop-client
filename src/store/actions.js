import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_GOODS,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT
} from './mutation_type'
import {
  reqAddress,
  reqCategorys,
  reqLogout,
  reqShops,
  reqUserInfo,
  reqInfo,
  reqGoods,
  reqRatings
} from '../api'

export default {
//  异步获取当前地址信息
  async getAddress({commit, state}) {
    //  调用接口请求函数从后台获取数据
    const {latitude, longitude} = state
    const geohash = `${latitude},${longitude}`
    const result = await reqAddress(geohash)  // {code: 0, data: address}
    if (result.code === 0) {
      const address = result.data
      commit(RECEIVE_ADDRESS, {address})
    }
  },
//  异步获取商品分类信息
  async getCategorys({commit, state}) {
    const result = await reqCategorys()
    if (result.code === 0) {
      const categorys = result.data
      commit(RECEIVE_CATEGORYS, {categorys})
    }
  },
//  异步获取商家列表
  async getShops({commit, state}) {
    const {latitude, longitude} = state
    const result = await reqShops(latitude, longitude)
    if (result.code === 0) {
      const shops = result.data
      commit(RECEIVE_SHOPS, {shops})
    }
  },
//  同步保存用户信息
  saveUser({commit}, user) {
    commit(RECEIVE_USER, {user})
  },
//  异步获取用户信息
  async getUser({commit}) {
    const result = await reqUserInfo()
    if (result.code === 0) {
      const user = result.data
      commit(RECEIVE_USER, {user})
    }
  },
//  异步退出登陆
  async loginOut({commit}) {
    const result = await reqLogout()
    if (result.code === 0) {
      commit(RESET_USER)
    }
  },
//  异步获取商家信息info
  async getInfo ({commit}) {
    const result = await reqInfo()
    if (result.code === 0) {
      const info = result.data
      commit(RECEIVE_INFO, {info})
    }
  },
//  异步获取商家评分
  async getRatings({commit}) {
    const result = await reqRatings()
    if (result.code === 0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})
    }
  },
//  异步获取goods
  async getGoods({commit}, callback) {
    const result = await reqGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
    //  如果组件中传递了接收消息的回调函数，数据更新后，调用回调函数通知调用的组件
    //  相当于，数据更新后，可以给组件添加动画效果，在回调函数里面写
      callback && callback()
    }
  },
  /* 更新goods中某一个food的数量 */
  updateFoodCount({commit, state}, {food, isIncrement}) {

  //  根据isIncrement值判断foodCount是否加1
    isIncrement ? commit(INCREMENT_FOOD_COUNT, {food}) : commit(DECREMENT_FOOD_COUNT, {food})
  }
}
