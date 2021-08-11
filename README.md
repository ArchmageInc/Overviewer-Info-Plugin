# Overviewer Info Plugin

This JavaScript plugin is designed to integrate with an [Overviewer](http://docs.overviewer.org/en/latest/) map to layer in additional information.
Most importantly, player location information. 
It uses a Web Socket to receive data, and has been developed in tandem with [PlayerLocations](https://github.com/ArchmageInc/PlayerLocations), a server plugin to send this data over a Web Socket.
It has been a tinker project and I have added other features, some specific to my implementation.

- Player Information
  - Location, including dimension*
  - Health
  - Air
  - Hunger
  - Level
- Server Information
  - Current world time
- Navigation
  - Collapsible list of current players
  - Selectable players with zoom to location

**NOTE**
Dimensions are not as straight forward as Minecraft players might think. 
Overviewer does not exactly provide the dimension information in the tilesets it outputs.
Instead, this has to rely on the [worlds dictionary](https://docs.overviewer.org/en/latest/config/#general) or [title](https://docs.overviewer.org/en/latest/config/#id1) display name in the configuration to contain specific cues.

Also, the conversion values between dimensions is hard-coded (i.e. 8:1 overworld:nether). 

## Usage
Download the Overviewer-Info-Plugin.zip from the [Releases](https://github.com/ArchmageInc/Overviewer-Info-Plugin/releases) and extract the files into the directory serving your Overviwer map.
In the `index.html` file insert the following in the `<head>` section.

```HTML
<script type="text/javascript" src="overviewer-info-plugin.js"></script>
<script type="text/javascript">OverviewerInfoPlugin.start()</script>
```

Alternatively, the extracted files and a modified [index.html](overviewer_assets/index.html) can be placed in an assets directory referenced in the configuration for [Custom Web Assets](http://docs.overviewer.org/en/latest/config/#custom-web-assets). 

## Contributing
IDK, create a fork, create a PR, maybe write some unit tests because I sure didn't. I'll probably forget that this repo exists until I finally look at my email after three years and see people arguing about exposing an RCON port over the web to JavaScript clients. *SHEESH* I can't believe people thought that would be a good idea. 

## Bugs & Issues
Sure, log an issue in the [Issues](https://github.com/ArchmageInc/Overviewer-Info-Plugin/issues) tracker. Maybe I'll get to it, but I'd recomend first reading the [Contributing](#Contributing) section. 