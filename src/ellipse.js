const MapUtils = require('./map-utils.js').default;
//@Max r:0.1 = 31blocks

const Ellipse = L.Circle.extend({
    _latlng: null,
    _mRadius: null,
    initialize: function (position, options) {
        if (!options || (isNaN(options.radius) && isNaN(options.blockRadius))) {
            throw new Error('Ellipse radius must be a number.');
        }
        L.Util.setOptions(this, options);
        this._latlng = L.latLng(MapUtils.getDimensionalLocation(position));
        if(options.blockRadius) {
            this._mRadius = (0.1/31) * options.blockRadius;
        }else {
           this._mRadius = options.radius; 
        }
        
    },
    setBlockRadius: function (radius) {
        this._mRadius = (0.1/31) * radius;
        return this.redraw();
    },
    _project: function () {
        L.Circle.prototype._project.call(this);
        this._radiusY = this._radius/2;
        this._updateBounds();
    }
});

export default Ellipse;