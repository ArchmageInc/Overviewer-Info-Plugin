const Grave = require('./grave.js').default;

export default class OptionManager{
    _params = null;
    _options = {
        grave: Grave
    };
    _active = null;
    constructor() {
        this._params = new URLSearchParams(window.location.search);
        overviewer.util.ready(this.initialize.bind(this));
    };

    initialize() {
        if(this._params.get('option')) {
            let option = this._params.get('option');
            if(this._options[option]){
                this._active = new this._options[option](this);
            }
        }
    };

    getParams() {
        return this._params;
    }
}