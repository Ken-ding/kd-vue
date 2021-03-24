import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue(options) {
    //开发环境下判断Vue构造函数
    if (process.env.NODE_ENV !== 'production' &&
        !(this instanceof Vue)
    ) {
        warn('Vue is a constructor and should be called with the `new` keyword')
    }
    //初始化
    this._init(options)
}
//初始化方法添加到vue原型
initMixin(Vue)
//$data,$props,$get,$set添加到vue原型
stateMixin(Vue)
//$on,$off,$once,$emit添加到vue原型
eventsMixin(Vue)
//_update,$forceUpdate,$destroy添加到vue原型
lifecycleMixin(Vue)
//定义一系列渲染时工具方法,$nextTick,_render添加到vue原型
renderMixin(Vue)
//导出Vue构造函数
export default Vue
