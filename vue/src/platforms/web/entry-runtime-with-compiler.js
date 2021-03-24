/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'
//导入runtime处理后的Vue
import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

//模板相关方法
const idToTemplate = cached(id => {
    const el = query(id)
    return el && el.innerHTML
})

//利用函数劫持,扩展$mount功能
const mount = Vue.prototype.$mount
//扩展后的$mount 
Vue.prototype.$mount = function (
    el?: string | Element,
    hydrating?: boolean
): Component {
    //搜索el节点对象
    el = el && query(el)

    //不能以body和document作为节点对象
    if (el === document.body || el === document.documentElement) {
        process.env.NODE_ENV !== 'production' && warn(
            `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
        )
        return this
    }

    const options = this.$options
    //判断是否有渲染函数
    if (!options.render) {
        let template = options.template
        //没有判断是否有template选项
        if (template) {
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                    template = idToTemplate(template)
                    /* istanbul ignore if */
                    if (process.env.NODE_ENV !== 'production' && !template) {
                        warn(
                            `Template element not found or is empty: ${options.template}`,
                            this
                        )
                    }
                }
            } else if (template.nodeType) {
                template = template.innerHTML
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    warn('invalid template option:' + template, this)
                }
                return this
            }
        } else if (el) {
            //没有使用el节点对象作为模板
            template = getOuterHTML(el)
        }
        if (template) {
            /* istanbul ignore if */
            if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                mark('compile')
            }
            //编译模板对象,生产渲染函数和静态渲染函数
            const { render, staticRenderFns } = compileToFunctions(template, {
                outputSourceRange: process.env.NODE_ENV !== 'production',
                shouldDecodeNewlines,
                shouldDecodeNewlinesForHref,
                delimiters: options.delimiters,
                comments: options.comments
            }, this)
            options.render = render
            options.staticRenderFns = staticRenderFns

            /* istanbul ignore if */
            if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                mark('compile end')
                measure(`vue ${this._name} compile`, 'compile', 'compile end')
            }
        }
    }
    //调用真正的$mount函数
    return mount.call(this, el, hydrating)
}
/**
 * 定义获取元素节点方法
 */
function getOuterHTML(el: Element): string {
    if (el.outerHTML) {
        return el.outerHTML
    } else {
        const container = document.createElement('div')
        container.appendChild(el.cloneNode(true))
        return container.innerHTML
    }
}
//定义vue全局属性compile
Vue.compile = compileToFunctions

//导出vue构造函数
export default Vue
