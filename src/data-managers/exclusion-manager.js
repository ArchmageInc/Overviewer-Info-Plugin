const _ = require('lodash');
const Ellipse = require('../leaflet-extensions/ellipse.js').default;
const MapUtils = require('../utils/map-utils.js').default;

export default class ExclusionManager{
    _options = {
        debug: false
    };
    _client = null;
    _control = null;
    _exclusions = [];
    _layers = {};

    constructor(socketClient, options) {
        this._client = socketClient;
        this.setupLayers();
        this._client.addHandler(this._onMessage.bind(this));
        overviewer.util.ready(this.initialize.bind(this));
    }
    setupLayers() {
        this._layers["minecraft:overworld"] = L.layerGroup();
        this._layers["minecraft:nether"] = L.layerGroup();
        this._layers["minecraft:the_end"] = L.layerGroup();

        this._layers["minecraft:overworld"].markers = {};
        this._layers["minecraft:nether"].markers = {};
        this._layers["minecraft:the_end"].markers = {};
    }

    initialize(){
        _.each(overviewerConfig.tilesets, (tileset) => {
            let dimension = MapUtils.worldNameToDimension(tileset.name);
            if(!tileset.marker_groups){
                this._control = L.control.layers().addOverlay(this._layers[dimension], "Exclusions");
            } else {
                tileset.marker_groups["Exclusions"] = this._layers[dimension];
                if(tileset.markerCtrl) {
                    tileset.markerCtrl.addOverlay(this._layers[dimension], "Exclusions");
                }
            }
            
        });
        overviewer.map.on('baselayerchange', this._update.bind(this));
    }

    _update() {
        this._removeUnusedExclusions();
        this._exclusions.forEach((exclusion) => {
            let dimension = exclusion.position.dimension;
            let marker = this._layers[dimension].markers[exclusion.id];
            if(!marker) {
                marker = new Ellipse(exclusion.position, {
                    blockRadius: exclusion.radius,
                    weight: 1.5,
                    fillOpacity: 0.1
                });
                marker.exclusion = exclusion;
                marker.exclusionId = exclusion.id;
                marker.bindPopup(function(l) {
                    let str='';
                    l.exclusion.creatures.forEach((creature)=>{
                        str += creature.toLowerCase() + ", "
                    });
                    return str.slice(0,-2) + "</br>"+exclusion.id;
                });
                this._layers[dimension].markers[exclusion.id] = marker;
                this._layers[dimension].addLayer(marker);
            }else if(!exclusion.latLng.equals(marker.getLatLng()) || exclusion.radius != marker.getBlockRadius()){
                marker.setData({
                    blockRadius: exclusion.radius,
                    latLng: exclusion.latLng
                });
            }
        });
    }

    _removeUnusedExclusions() {
        _.each(this._layers, (layer)=>{
            _.each(layer.markers, (marker)=>{
                if(!_.find(this._exclusions, ['id', marker.exclusionId])){
                    marker.remove();
                    delete layer.markers[marker.exclusionId];
                }
            })
        });
    }

    _onMessage(data) {
        if(data && data.exclusions){
            this._exclusions = _.reverse(_.sortBy(data.exclusions,'radius'));
            this._exclusions.forEach((exclusion) => {
                exclusion.latLng = MapUtils.getDimensionalLocation(exclusion.position);
            });
            this._update();
        }
    }
}