/*
使用mockjs提供模拟数据接口
 */
import Mock from 'mockjs'
import data from './data'

// 提供goods数据接口
Mock.mock('/goods', {code: 0, data: data.goods})
// 提供ratings数据接口
Mock.mock('/ratings', {code: 0, data: data.ratings})
// 提供info数据借口
Mock.mock('/info', {code: 0, data: data.info})


// export default ??? 这个文件不需要暴露，只需要入口文件引入执行一次，后面就可以访问
