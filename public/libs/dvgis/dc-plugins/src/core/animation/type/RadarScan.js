/**
 * @Author: Caven
 * @Date: 2020-12-01 20:40:02
 */

import Animation from '../Animation'

const { Transform, Position, Parse, Util } = DC

const { Cesium } = DC.Namespace

const RadarScanShader = require('../../shader/RadarScanShader.glsl')

class RadarScan extends Animation {
  constructor(viewer, position, radius, options = {}) {
    super(viewer)
    this._position = Parse.parsePosition(position)
    this._radius = radius || 0
    this._color = Cesium.defaultValue(options.color, Cesium.Color.BLUE)
    this._duration = Cesium.defaultValue(options.duration, 1) * 1e3
    this._delegate = undefined
    this.type = 'radar_scan'
  }

  /**
   *
   * @private
   */
  _mountContent() {
    let cartesian3Center = Transform.transformWGS84ToCartesian(this._position)
    let cartesian4Center = new Cesium.Cartesian4(
      cartesian3Center.x,
      cartesian3Center.y,
      cartesian3Center.z,
      1
    )
    let cartesian3Center1 = Transform.transformWGS84ToCartesian(
      new Position(
        this._position.lng,
        this._position.lat,
        this._position.alt + 500
      )
    )
    let cartesian4Center1 = new Cesium.Cartesian4(
      cartesian3Center1.x,
      cartesian3Center1.y,
      cartesian3Center1.z,
      1
    )

    let cartesian3Center2 = Transform.transformWGS84ToCartesian(
      new Position(
        this._position.lng + 0.001,
        this._position.lat,
        this._position.alt
      )
    )
    let cartesian4Center2 = new Cesium.Cartesian4(
      cartesian3Center2.x,
      cartesian3Center2.y,
      cartesian3Center2.z,
      1
    )
    let _time = new Date().getTime()
    let _RotateQ = new Cesium.Quaternion()
    let _RotateM = new Cesium.Matrix3()
    let _scratchCartesian4Center = new Cesium.Cartesian4()
    let _scratchCartesian4Center1 = new Cesium.Cartesian4()
    let _scratchCartesian4Center2 = new Cesium.Cartesian4()
    let _scratchCartesian3Normal = new Cesium.Cartesian3()
    let _scratchCartesian3Normal1 = new Cesium.Cartesian3()
    this._delegate = new Cesium.PostProcessStage({
      name: Util.uuid(),
      fragmentShader: RadarScanShader,
      uniforms: {
        u_scanCenterEC: () => {
          return Cesium.Matrix4.multiplyByVector(
            this._viewer.camera._viewMatrix,
            cartesian4Center,
            _scratchCartesian4Center
          )
        },
        u_scanPlaneNormalEC: () => {
          let temp = Cesium.Matrix4.multiplyByVector(
            this._viewer.camera._viewMatrix,
            cartesian4Center,
            _scratchCartesian4Center
          )
          let temp1 = Cesium.Matrix4.multiplyByVector(
            this._viewer.camera._viewMatrix,
            cartesian4Center1,
            _scratchCartesian4Center1
          )
          _scratchCartesian3Normal.x = temp1.x - temp.x
          _scratchCartesian3Normal.y = temp1.y - temp.y
          _scratchCartesian3Normal.z = temp1.z - temp.z
          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          )
          return _scratchCartesian3Normal
        },

        u_scanLineNormalEC: () => {
          let temp = Cesium.Matrix4.multiplyByVector(
            this._viewer.camera._viewMatrix,
            cartesian4Center,
            _scratchCartesian4Center
          )
          let temp1 = Cesium.Matrix4.multiplyByVector(
            this._viewer.camera._viewMatrix,
            cartesian4Center1,
            _scratchCartesian4Center1
          )
          let temp2 = Cesium.Matrix4.multiplyByVector(
            this._viewer.camera._viewMatrix,
            cartesian4Center2,
            _scratchCartesian4Center2
          )

          _scratchCartesian3Normal.x = temp1.x - temp.x
          _scratchCartesian3Normal.y = temp1.y - temp.y
          _scratchCartesian3Normal.z = temp1.z - temp.z

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          )

          _scratchCartesian3Normal1.x = temp2.x - temp.x
          _scratchCartesian3Normal1.y = temp2.y - temp.y
          _scratchCartesian3Normal1.z = temp2.z - temp.z

          let tempTime =
            ((new Date().getTime() - _time) % this._duration) / this._duration
          Cesium.Quaternion.fromAxisAngle(
            _scratchCartesian3Normal,
            tempTime * Cesium.Math.PI * 2,
            _RotateQ
          )
          Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM)
          Cesium.Matrix3.multiplyByVector(
            _RotateM,
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          )
          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          )
          return _scratchCartesian3Normal1
        },
        u_radius: this._radius,
        u_scanColor: this._color
      }
    })
  }

  /**
   *
   * @returns {RadarScan}
   */
  start() {
    !this._delegate && this._mountContent()
    this._delegate && this._viewer.scene.postProcessStages.add(this._delegate)
    return this
  }

  /**
   *
   * @returns {RadarScan}
   */
  stop() {
    this._delegate &&
      this._viewer.scene.postProcessStages.remove(this._delegate)
    this._delegate = undefined
    return this
  }
}

export default RadarScan
