/**
 * @Author: Caven
 * @Date: 2020-07-17 22:15:56
 */

const { Cesium } = DC.Namespace

class PolylineImageTrailMaterialProperty {
  constructor(options) {
    options = options || {}
    this._definitionChanged = new Cesium.Event()
    this._color = undefined
    this._colorSubscription = undefined
    this._speed = undefined
    this._speedSubscription = undefined
    this._image = undefined
    this._imageSubscription = undefined
    this._repeat = undefined
    this._repeatSubscription = undefined
    this.color = options.color || Cesium.Color.fromBytes(0, 255, 255, 255)
    this.speed = options.speed || 1
    this.image = options.image
    this.repeat = new Cesium.Cartesian2(
      options.repeat?.x || 1,
      options.repeat?.y || 1
    )
  }

  get isConstant() {
    return false
  }

  get definitionChanged() {
    return this._definitionChanged
  }

  getType(time) {
    return Cesium.Material.PolylineImageTrailType
  }

  getValue(time, result) {
    if (!result) {
      result = {}
    }
    result.color = Cesium.Property.getValueOrUndefined(this._color, time)
    result.image = Cesium.Property.getValueOrUndefined(this._image, time)
    result.repeat = Cesium.Property.getValueOrUndefined(this._repeat, time)
    result.speed = this._speed
    return result
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof PolylineImageTrailMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed))
    )
  }
}

Object.defineProperties(PolylineImageTrailMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  image: Cesium.createPropertyDescriptor('image'),
  repeat: Cesium.createPropertyDescriptor('repeat')
})

export default PolylineImageTrailMaterialProperty
