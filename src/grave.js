import graveImage from '../assets/grave.png';

const MapUtils = require('./map-utils.js').default;


export default class Grave {
    _optionManager = null;
    _latlng = null;
    constructor(optionManager) {
        let params = optionManager.getParams();
        this._optionManager = optionManager;
        this._name = params.get('name');
        this._latlng = overviewer.util.fromWorldToLatLng(params.get('x'),64,params.get('z'),MapUtils.getCurrentTitleSet());
        if(!overviewer || !overviewer.collections || !overviewer.collections.locationMarker){
            return;
        }

        overviewer.collections.locationMarker.setIcon(
            L.icon({
                iconUrl: graveImage,
                iconSize: [32,37],
                iconAnchor: [15,33]
            })
        )
        .bindPopup(
            L.popup({
                closeButton: false,
                className: 'player-location-popup',
                offset:[2,-25]
            })
            .setContent(
                `Here lies ${this._name}`
            )
        )
        .setLatLng(this._latlng)
        .openPopup();

    }
}