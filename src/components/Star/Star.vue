<template>
  <div class="star" :class="`star-${size}`">
    <span
      class="star-item"
      v-for="(sc, index) in starClasses"
      :key="index"
      :class="sc"
    ></span>
  </div>
</template>

<script>
  const CLASS_ON = 'on'
  const CLASS_HALF = 'half'
  const CLASS_OFF = 'off'
  export default {
    props: {
      score: Number,
      size: Number
    },
    computed: {
    //  由5个类名组成的数组，根据传递过来的分数，进行动态显示星星
      /*
      例：3.7: 3全星 + 1半星 + 1个灰心
       */
      starClasses () {
        const scs = []
        const {score} = this
        // score向下取整，得到全星个数
        const scoreInteger = Math.floor(score)
        for (let i = 0; i < scoreInteger; i++) scs.push(CLASS_ON)
        // 得到半星 >= 0.5（也可能没有）
        if ((score-scoreInteger) * 10 >= 5) scs.push(CLASS_HALF)
      //  最后以灰心补上，这个时候判断数组长度，为5，不用补，小于5，补
        if (scs.length < 5) scs.push(CLASS_OFF)
        return scs
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .star //2x图 3x图
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/stars/star48_on')
        &.half
          bg-image('./images/stars/star48_half')
        &.off
          bg-image('./images/stars/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/stars/star36_on')
        &.half
          bg-image('./images/stars/star36_half')
        &.off
          bg-image('./images/stars/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/stars/star24_on')
        &.half
          bg-image('./images/stars/star24_half')
        &.off
          bg-image('./images/stars/star24_off')
</style>
