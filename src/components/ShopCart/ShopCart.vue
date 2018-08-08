<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: cartFoodCount}">
              <i class="iconfont icon-shopping_cart" :class="{highlight: cartFoodCount > 0}"></i>
            </div>
            <div class="num" v-show="cartFoodCount">{{cartFoodCount}}</div>
          </div>
          <div class="price" :class="{highlight: cartFoodCount>0}">￥{{cartFoodPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass">
            {{payText}}
          </div>
        </div>
      </div>
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty">清空</span>
        </div>
        <div class="list-content" ref="cartList">
          <ul>
            <li class="food" v-for="(food, index) in cartFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price"><span>￥{{food.price}}</span></div>
              <div class="cartcontrol-wrapper">
                <CartControl :food="food"/>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--遮罩层-->
    <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import BScorll from 'better-scroll'
  import CartControl from '../../components/CartControl/CartControl'
  export default {
    data () {
      return {
        isShow: false   // 是否显示购物车列表
      }
    },

    computed: {
      ...mapState(['cartFoods', 'info']),
      ...mapGetters(['cartFoodCount', 'cartFoodPrice']),
      payClass () {  // 购物价是否达到20元，添加对应类名
        const {cartFoodPrice} = this
        const {minPrice} = this.info
        return cartFoodPrice >= minPrice ? 'enough' : 'not-enough'
      },
      // 根据购物总价是否达到20元，显示对应文本
      payText () {
        const {cartFoodPrice} = this
        const {minPrice} = this.info  // 取出商家信息中最小价格20元
      //  20元起送，判断购物价是否符合要求，显示对应文本
        if (cartFoodPrice === 0) {
          return `￥${minPrice}起送`;
        } else if (cartFoodPrice >= minPrice) {
          return '去结算';
        } else {
          return `还差￥${minPrice - cartFoodPrice}起送`
        }
      },
    //  购物车列表是否显示
      /*
        两个决定因素： *****
          1. isShow
          2. 购物车数量
      */
      listShow () {
        // 如果数量为0，直接隐藏
        if (this.cartFoodCount === 0) {
          this.isShow = false  // 这个时候防止toggleShow切换失败
          return false
        }
        if (this.isShow) {
        //  列表显示，添加滚动BScroll
          /*
          这里有坑，BScroll会被调用多次，这样就一直在创建BScroll
          实现单例对象：
            1. 创建之前，先判断是否存在，不存在才创建
            2. 创建对象之后，保存对象，this上
           */
          this.$nextTick(() => {
            if (!this.scroll) {
              console.log('-----');
              this.scroll = new BScorll(this.$refs.cartList, {
                click: true
              });
            } else {
              this.scroll.refresh()  // 新的food添加，需要通知scroll去刷新，重新进行计算
            }
          })
        }
      //  如果数量大于0，看isShow即可
        return this.isShow;
      }
    },

    methods: {
      toggleShow () {
        if (this.cartFoodCount) {
          // 只有当有数量时才切换
          this.isShow = !this.isShow;
        }
      },
    },
    components:{
      CartControl
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: $green
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #ffffff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          color: #fff
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform translateY(-100%)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
</style>
