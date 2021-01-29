/**
 * @Author: Caven
 * @Date: 2020-03-19 22:36:19
 */

import Vue from 'vue'

import DC from '@/assets/libs/dvgis/dc-sdk/src/base'
import DcCore from '@/assets/libs/dvgis/dc-sdk/src/core'
import DcPlugins from '@/assets/libs/dvgis/dc-plugins/src'
import DcUI from '@/assets/libs/dvgis/dc-ui/src'
import '@/assets/libs/dvgis/dc-sdk/dist/dc.core.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

const hub = new Vue()
console.log(DC, DcCore, DcPlugins)
class AppLoader {
  constructor() {
    Vue.config.productionTip = false
    // DC.use(DcCore)
    // DC.use(DcPlugins)
    Vue.use(ElementUI)
    // Vue.use(DcUI)
    Vue.use({
      install(Vue) {
        Vue.prototype.$hub = hub
      }
    })
  }

  install() {
    global.Vue = Vue
    // global.DC = DC
    // global.Cesium = DC.Namespace['cesium']
    return Promise.all([
      import('@/components'),
      import('@/loader/HttpLoader'),
      import('@/loader/ConfigLoader')
    ])
  }
}

const appLoader = new AppLoader()
export default appLoader
