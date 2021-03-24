
//从core引入Vue构造实例
import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser } from 'core/util/index'

import {
    query,
    mustUseProp,
    isReservedTag,
    isReservedAttr,
    getTagNamespace,
    isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// 安装web相关的特殊处理工具方法
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// 安装web平台的全局指令和组件
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// 在vue原型中添加__patch__属性,指向patch函数
Vue.prototype.__patch__ = inBrowser ? patch : noop

// 添加原型属性$mount
Vue.prototype.$mount = function (
    el?: string | Element,
    hydrating?: boolean
): Component {
    //获取el元素节点
    el = el && inBrowser ? query(el) : undefined
    //调用mountComponent
    return mountComponent(this, el, hydrating)
}

if (inBrowser) {
    setTimeout(() => {
        if (config.devtools) {
            if (devtools) {
                devtools.emit('init', Vue)
            } else if (
                process.env.NODE_ENV !== 'production' &&
                process.env.NODE_ENV !== 'test'
            ) {
                console[console.info ? 'info' : 'log'](
                    'Download the Vue Devtools extension for a better development experience:\n' +
                    'https://github.com/vuejs/vue-devtools'
                )
            }
        }
        if (process.env.NODE_ENV !== 'production' &&
            process.env.NODE_ENV !== 'test' &&
            config.productionTip !== false &&
            typeof console !== 'undefined'
        ) {
            console[console.info ? 'info' : 'log'](
                `You are running Vue in development mode.\n` +
                `Make sure to turn on production mode when deploying for production.\n` +
                `See more tips at https://vuejs.org/guide/deployment.html`
            )
        }
    }, 0)
}
//导出构造函数Vue
export default Vue
