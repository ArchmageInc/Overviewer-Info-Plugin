const MapUtils = {
    getCurrentTitleSet: () => {
        return overviewerConfig.tilesets.filter((tileset) => {return tileset.world === overviewer.current_world;})[0];
    },
    getDimensionalLocation: (location) => {
        let worldName = overviewer.current_layer[overviewer.current_world].tileSetConfig.name.toLowerCase();
        let dimension = location.dimension.split(':')[1].toLowerCase();
        let position = {
            x: location.x,
            y: location.y,
            z: location.z
        };

        if ((/nether/i).test(worldName) && (/overworld/i).test(dimension)) {
            position.x = position.x / 8;
            position.z = position.z / 8;
        }

        if ((/overworld/i).test(worldName) && (/nether/i).test(dimension)) {
            position.x = position.x * 8;
            position.z = position.z * 8;
        }

        return overviewer.util.fromWorldToLatLng(position.x, position.y, position.z, MapUtils.getCurrentTitleSet());
    }
};

export default MapUtils;