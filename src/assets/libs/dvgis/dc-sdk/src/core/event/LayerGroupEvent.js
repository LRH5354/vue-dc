/**
 * @Author: Caven
 * @Date: 2020-08-28 20:18:04
 */

import { LayerGroupEventType } from './EventType'
import Event from './Event'

const { Cesium } = DC.Namespace

class LayerGroupEvent extends Event {
  constructor() {
    super()
  }

  /**
   * Register event for layer group
   * @private
   */
  _registerEvent() {
    Object.keys(LayerGroupEventType).forEach(key => {
      let type = LayerGroupEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}

export default LayerGroupEvent
