import './plugin.css';

const InfoPlugin = require('./info-plugin.js').default;
const MapUtils = require('./map-utils.js').default;

window.OverviewerInfoPlugin = {
    plugin: null,
    MapUtils: MapUtils,
    start: function(options) {
        options = options || {};
        if(this.plugin) {
            throw 'OverviewerInfoPlugin already initialized'
        }
        this.plugin = new InfoPlugin(options);
        return this.plugin;
    }
};
