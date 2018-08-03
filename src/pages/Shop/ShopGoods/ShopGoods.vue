<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul ref="menuUl">
          <!--current-->
          <li class="menu-item"
              :class="{current: index===currentIndex}"
              v-for="(good, index) in goods"
              :key="index"
              @click="clickItem(index)"
          >
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-show="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="foodsUL">
          <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" :key="index">
                <div class="icon">
                  <img width="57" height="57"
                       :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span></div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    CartControl组件
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScorll from 'better-scroll'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        scrollY: 0,  // 右侧滚动的y坐标
        tops: []  // 右侧滚动的累加top，也就是滚动的总高度
      }
    },
    mounted() {
      this.$store.dispatch('getGoods', () => {  // 传入一个回调函数，监听goods是否更新，但此时不代表页面是否更新
        //  利用$nextTick()方法来实现dom更新之后再添加回弹滚动功能
        this.$nextTick(() => { // 保证页面dom元素更新之后，再来设计滚动功能
          // 初始化tops
          this._initTops()
          // 初始化滚动
          this._initScroll()
        })
      })
    },
    computed: {
      // 拿到state状态中goods
      ...mapState(['goods']),
      //  当前分类的下标
      currentIndex() {  // 根据上下滑动的y轴坐标来确定下标
        const {scrollY, tops} = this
        // 将查找到的当前下标，用变量保存
        let i = tops.findIndex((top, index) => scrollY >= top && scrollY < tops[index + 1])
        this._initFollowScroll(i)  // 调用跟随滚动的函数，使两个滚动对象产生联动效果
        return i
      }
    },
    methods: {
      // 计算tops，遍历li，累加top，逐一统计
      _initTops() {
        const tops = []
        let top = 0
        tops.push(top)  // 初始加入tops，为0
        // 遍历li
        const lis = this.$refs.foodsUL.getElementsByClassName('food-list-hook')  // 类数组
        // 也可以this.$refs.foodsUL.children(所有子元素)，childNodes（所有子节点，包括换行符）
        Array.prototype.slice.call(lis).forEach(li => {  // 真数组
          top += li.clientHeight   // 累加li的高度
          tops.push(top)
        })
      //  更新状态
        this.tops = tops
      },
      // 滑动2种类型：手指触摸滑动  惯性/编码滑动
      _initScroll() {
        // 给左侧menu分类菜单创建scroll对象
        this.menuScroll = new BScorll('.menu-wrapper', {
          click: true,  // better-scroll派发点击事件，插件禁用了原生dom事件，默认false，true表示派发事件
          probeType: 1
        })
        // 给右侧foods食品列表创建scroll对象，挂载到this上，方便查找
        this.foodsScroll = new BScorll('.foods-wrapper', {
          click: true,
          probeType: 1  // 只有手指触摸滑动（一定时间或者距离后才会触发，编码方式添加的滑动不实现） 默认0， 1 2 3
        })
      //  给foodsScroll绑定scroll事件监听
        this.foodsScroll.on('scroll', ({x, y}) => {
          console.log('scroll', x, y)
          this.scrollY = Math.abs(y)
        })
      //  绑定scrollEnd监听 解决惯性滑动问题
        this.foodsScroll.on('scrollEnd', ({x, y}) => {
          console.log('scrollEnd', x, y)
          this.scrollY = Math.abs(y)
        })
      },
      // 给左侧单个li添加点击事件，传入当前元素的下标
      clickItem (index) {
      //  获取index对应的top
        const top = this.tops[index]
      //  立即更新scrollY
        this.scrollY = top
      //  右侧列表滚动到top处 scrollTo(x, y, time(ms), easing)
        this.foodsScroll.scrollTo(0, -top, 300)
      },
    //  给左侧ul添加跟随右侧的滚动
      _initFollowScroll (index) {
        let el = this.$refs.menuUl.children[index]
        console.log(this, this.menuScroll)   // 调用这个函数前，需要判断menuScroll是否存在
        this.menuScroll && this.menuScroll.scrollToElement(el, 300)
      }
    }
  }
  /*
  let tempY = 0, direction = 1  //  定义一个变量保存y，通过2次y的比较判断上下的滑动方向,direction表示方向,1表示向上

  // 判断相邻两次滑动的Y值
  (y - tempY) > 0 ? direction = 1 : direction = -1
  this.scrollY = tempY = Math.abs(y)  // y是负值

  if (this.$refs.menuList[index]) {
    this.$refs.menuUl.style.transform = 'translateY(' + (139 * direction) + 'px)'
  }
   */
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"

  .goods
    display: flex
    position: absolute
    top: 275px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
