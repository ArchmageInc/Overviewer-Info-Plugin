const MapUtils = require('../utils/map-utils.js').default;

const Ellipse = L.Circle.extend({
    _latlng: null,
    _mRadius: null,
    _bRadius: null,
    initialize: function (position, options) {
        if (!options || (isNaN(options.radius) && isNaN(options.blockRadius))) {
            throw new Error('Ellipse radius must be a number.');
        }
        L.Util.setOptions(this, options);
        this._latlng = L.latLng(MapUtils.getDimensionalLocation(position));
        if(options.blockRadius) {
            this._bRadius = options.blockRadius;
            this._mRadius = this.convertBlockRadius(options.blockRadius);//(0.1/31) * options.blockRadius;
        }else {
           this._mRadius = options.radius; 
        }
        
    },
    convertBlockRadius: function(radius) {
        return radius * 0.033203125;
    },
    updatePosition: function(position) {
        this._latlng = MapUtils.getDimensionalLocation(position);
        return this.redraw();
    },
    setBlockRadius: function (radius) {
        this._bRadius = radius;
        this._mRadius = this.convertBlockRadius(radius);
        return this.redraw();
    },
    setData: function(data) {
        if(data.position) {
            this._latlng = MapUtils.getDimensionalLocation(data.position);
        }
        if(data.latLng) {
            this._latlng = data.latLng;
        }
        if(data.radius) {
            this._mRadius = data.radius;
        }
        if(data.blockRadius) {
            this._bRadius = data.blockRadius;
            this._mRadius = this.convertBlockRadius(data.blockRadius);
        }
        return this.redraw();
    },
    getBlockRadius: function() {
        return this._bRadius;
    },
    _project: function () {
        L.Circle.prototype._project.call(this);
        this._radiusY = this._radius/2;
        this._updateBounds();
    }
});

export default Ellipse;