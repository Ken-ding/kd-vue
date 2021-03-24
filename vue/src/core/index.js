import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'
//全局组件相关
initGlobalAPI(Vue)
//服务器渲染相关
Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
})
//服务器渲染相关
Object.defineProperty(Vue.prototype, '$ssrContext', {
    get() {
        /* istanbul ignore next */
        return this.$vnode && this.$vnode.ssrContext
    }
})

// 为服务器渲染提供函数式组件支持
Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
})
//定义vue版本
Vue.version = '__VERSION__'
//导出vue构造函数
export default Vue
