export default {
//  购物车food总数量
  /*
  food在goods中foods，goods在state上，所以不需要再发送ajax请求
  去找goods来计算，看food.count是否大于0
   */
  cartFoodCount(state) {
    return state.cartFoods.reduce((preCount, food) => preCount + food.count, 0)
  },
//  购物车food总价格
  cartFoodPrice(state) {
    return state.cartFoods.reduce((prePrice, food) => prePrice + food.count * food.price, 0)
  },

//  商家评价的总数量
  ratingsTotalCount(state) {
    return state.ratings.length
  },
//  商家满意评价的总数量
  ratingsPositiveCount(state) {
    return state.ratings.reduce((preCount, rating) => preCount + (rating.rateType === 0 ? 1 : 0), 0)
  }
}
