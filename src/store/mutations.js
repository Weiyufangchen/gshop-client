import Vue from 'vue'
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT
} from './mutation_type'

export default {
  [RECEIVE_ADDRESS](state, {address}) {
    state.address = address
  },
  [RECEIVE_CATEGORYS](state, {categorys}) {
    state.categorys = categorys
  },
  [RECEIVE_SHOPS](state, {shops}) {
    state.shops = shops
  },
  [RECEIVE_USER](state, {user}) {
    state.user = user
  },
  [RESET_USER](state) {
    state.user = {}
  },
  [RECEIVE_GOODS](state, {goods}) {
    state.goods = goods
  },
  [RECEIVE_RATINGS](state, {ratings}) {
    state.ratings = ratings
  },
  [RECEIVE_INFO](state, {info}) {
    state.info = info
  },
  [INCREMENT_FOOD_COUNT](state, {food}) {
    /* 判断food中有没有count属性，有不用管；没有，添加count属性，并设置默认值 */
    /*
      注意：直接写法food.count = 1， 新加的属性，没有数据绑定，也就不会更新页面
      调用Vue.set() 方法，添加属性，有数据绑定，属性名：应该是字符串（而不应该写为变量）
    */
    // 指定为1, 0不显示，并且将这个大于0的food添加到购物车里
    food.count ? food.count++ : (Vue.set(food, 'count', 1) && state.cartFoods.push(food))
  },
  [DECREMENT_FOOD_COUNT](state, {food}) {
    food.count ? (food.count-- && (food.count ===0 ? state.cartFoods.splice(state.cartFoods.indexOf(food), 1) : food.count )) : food.count
    // 首先，不存在或者为0，页面标签会隐藏，大于1才会显示，然后操作数据
    /*if (food.count) {
      food.count--
      if (food.count === 0) {
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
    }*/
  }
}

