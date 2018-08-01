<template>
  <div class="msite">
    <!--首页头部-->
    <HeaderTop :title="address.name">
      <router-link slot="left" to="/search" class="header_search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <router-link slot="right" to="/login" class="header_login">
        <span class="header_login_text">登录|注册</span>
      </router-link>
    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav border-1px">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(smallArr, index) in categorysArr"
            :key="index"
          >
            <a
              href="javascript:"
              class="link_to_food"
              v-for="(category, index) in smallArr"
              :key="index"
            >
              <div class="food_container">
                <img :src="baseImgPath + category.image_url">
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list border-1px">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList/>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'

  import HeaderTop from '../../components/HeaderTop/HeaderTop'
  import ShopList from '../../components/ShopList/ShopList'

  export default {
    data() {
      return {
        baseImgPath: 'https://fuss10.elemecdn.com'
      }
    },
    computed: {
      ...mapState(['address', 'categorys']),
    //  将categorys拆分成二维数组categorysArr
      categorysArr () {
        const arr = []  // 存放smallArr数组
        let smallArr = []  // 8个为一组，塞到arr中
      //  遍历categorys
        this.categorys.forEach(category => {
          // 将空的或者每次更新的smallArr添加到arr中
          if (smallArr.length === 0) {
            arr.push(smallArr)
          }
          // 小数组放category，放满8个清空
          smallArr.push(category)
          if (smallArr.length === 8) {
            smallArr = []
          }
        })
        return arr
      }
    },
    mounted() {
      // 请求后台获取shops
      this.$store.dispatch('getShops')
      // 请求后台获取categorys
      this.$store.dispatch('getCategorys')
    },
    watch: {
      categorys() {
        // 调用vm.$nextTick(callback) 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        // 用定时器，不知道数据什么时候全部拿到，不稳妥
        this.$nextTick(() => {
            //  创建swiper实例对象，实现轮播(必须要在拿到数据，更新页面之后，再轮播)
            new Swiper('.swiper-container', { // 参数1：选择器，参数2：配置对象
              pagination: { // 是否需要分页器
                el: '.swiper-pagination',
              },
              loop: true
            })
          }
        )
      }
    },
    components: {
      HeaderTop,
      ShopList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite
    width 100%
    .header
      background-color #02a774
      position fixed
      z-index 100
      left 0
      top 0
      width 100%
      height 45px
      .header_search
        position absolute
        left 15px
        top 50%
        transform translateY(-50%)
        width 10%
        height 50%
        .icon-sousuo
          font-size 25px
          color #fff
      .header_title
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        width 50%
        color #fff
        text-align center
        .header_title_text
          font-size 20px
          color #fff
          display block
      .header_login
        font-size 14px
        color #fff
        position absolute
        right 15px
        top 50%
        transform translateY(-50%)
        .header_login_text
          color #fff
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          > span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0 10px
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>
