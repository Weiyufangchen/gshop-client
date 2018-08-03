## shopGoods组件
1. 滑动右侧列表，左侧会同步更新当前分类
  1). 设计一个计算属性：currentIndex代表当前分类的下标
  2). 相关数据
    滚动的y坐标：scrollY ---> 给右侧列表绑定一个滚动的监听
    右侧所有分类<li>的top数组：tops：[]  ---> 列表第一次显示之后统计
  3). 计算的逻辑
    scrollY >= currentTop && scrollY < nextTop
2. 点击左侧分类项，右侧列表滑动到对应位置
  1). 绑定点击监听
  2). 通过rightScroll滚动到对应的位置
  3). 立即更新scrollY（让左侧当前的分类项能立即更新）

