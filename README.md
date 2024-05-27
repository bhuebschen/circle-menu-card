# Circle Menu Card

[![hacs][hacs-image]][hacs-url]
[![GitHub Sponsors][gh-sponsors-image]][gh-sponsors-url]

![preview]

The Circle Menu Card is a custom Lovelace card for Home Assistant that allows you to create a circular menu of actions or shortcuts. This card provides a visually appealing way to access common actions or navigate to different parts of your Home Assistant dashboard.

### Features:
- **Customization:** Configure the icons, colors, and positions of the floating button and menu items to match your dashboard's theme.
- **Multiple Actions:** Each menu item can perform various actions, such as toggling lights, controlling media players, or navigating to specific dashboards.
- **Responsive Design:** The circular menu adjusts its position based on the configuration, ensuring compatibility with different screen sizes and layouts.

### Installation:

### [HACS](hacs) (Home Assistant Community Store)

1. Go to HACS page on your Home Assistant instance
1. Add this repository (https://github.com/bhuebschen/circle-menu-card) via HACS Custom repositories [How to add Custom Repositories](https://hacs.xyz/docs/faq/custom_repositories/)
1. Select `Frontend`
1. Press add icon and search for `Circle Menu Card`
1. Select Circle Menu Card repo and install
1. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>F5</kbd> / (<kbd>Shift</kbd> +) <kbd>⌘</kbd> + <kbd>R</kbd>)
1. Add circle-menu-card to your page

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=bhuebschen&repository=circle-menu-card&category=plugin)

### Manual

1. Download the 'circle-menu-card.js' from the latest [release][release-url] (with right click, save link as)
1. Place the downloaded file on your Home Assistant machine in the `config/www` folder (when there is no `www` folder in the folder where your `configuration.yaml` file is, create it and place the file there)
1. In Home Assistant go to `Configuration->Lovelace Dashboards->Resources` (When there is no `resources` tag on the `Lovelace Dashboard` page, enable advanced mode in your account settings, and retry this step)
1. Add a new resource
   1. Url = `/local/circle-menu-card.js.js`
   1. Resource type = `module`
1. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>F5</kbd> / (<kbd>Shift</kbd> +) <kbd>⌘</kbd> + <kbd>R</kbd>)
1. Add circle-menu-card to your page

### Configuration:
Here's an example configuration for the Circle Menu Card:

```yaml
type: 'custom:circle-menu-card'
left: false # Position the menu on the left
icon: 'mdi:menu' # Floating button icon
button_color: '#3498db' # Button background color
icon_color: 'white' # Icon color
menu_background_color: '#3498db' # Menu background color
items:
  - icon: mdi:lightbulb
    alt: Lights on...
    action:
      action: call-service
      service: light.turn_on
      service_data:
        entity_id: light.living_room
  - icon: mdi:thermometer
    alt: Default Dashboard
    action:
      action: navigate
      navigation_path: /lovelace/0
  - icon: mdi:music
    alt: Music Control
    action:
      action: call-service
      service: media_player.media_play_pause
      service_data:
        entity_id: media_player.living_room
  - icon: mdi:fan
    alt: Fan Control
    action:
      action: call-service
      service: fan.turn_on
      service_data:
        entity_id: fan.living_room
  # Up to 4 menu items...
```
### Options:

| Name                   | Description                                                                                           | Default Value                |
|------------------------|-------------------------------------------------------------------------------------------------------|------------------------------|
| `left`                 | Whether to position the menu on the left side of the screen                                           | `false`                      |
| `icon`                 | The icon to be displayed on the floating button                                                       | `'mdi:menu'`                 |
| `button_color`         | Background color of the floating button                                                               | var(--primary-color)         |
| `icon_color`           | Color of the icon on the floating button                                                              | var(--text-primary-color)    |
| `menu_background_color`| Background color of the menu                                                                          | var(--primary-color)         |
| `auto_close`           | Closes the menu after a timeout in milliseconds                                                       | ``                           |
| `json_config`          | Load an external json-file with the menu and items configuration                                      | ``                           |
| `item_active_color`    | When using call_service, this defines the background color of a menu item whose destination entity is 'positive'. | var(--accent-color)                           |
| `positive_states`      | Defines an array of 'positive' states for entities to be highlighted. | 'true', 'on', 'open', 'active', 'detected', 'occupied', 'unlocked', 'home', 'above_horizon', 'ready' |
| `json_config`          | Load an external json-file with the menu and items configuration                                      | ``                           |
| `items`                | Array of menu items. Each item should contain `icon`, `alt`, and `action` properties.                 | `[]`                         |
| `items[].icon`         | Icon for the menu item                                                                                | `''`                         |
| `items[].alt`          | Alt text for the menu item                                                                            | `''`                         |
| `items[].action`       | Action to be performed when the menu item is clicked. Can be either `'navigate'` or `'call-service'`. | `''`                         |
| `items[].action.navigation_path` | Path to navigate to if `action` is `'navigate'`                                                   | `''`                         |
| `items[].action.service`         | Service to call if `action` is `'call-service'`                                                   | `''`                         |
| `items[].action.service_data`    | Service data to pass if `action` is `'call-service'`                                              | `{}`                         |

### Usage:
1. Clicking the floating button toggles the visibility of the circular menu.
2. Each menu item performs a predefined action, such as controlling devices or navigating to other dashboards.

### Global configuration:
You can store the configuration in a JSON file to provide a global setup for all menus. Use json_config to load the configuration into the circle-menu-card instance.

Any additional parameters provided will override the parameters from the JSON configuration.

### Credits:
- The Circle Menu Card is inspired by various circular menu implementations and is built as a custom Lovelace card for Home Assistant.

### Issues & Contributions:
If you encounter any issues or have suggestions for improvements, feel free to [open an issue](https://github.com/bhuebschen/circle-menu-card/issues) or submit a pull request.

## License

MIT © [Benedikt Hübschen][bhuebschen]

<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-image]: https://img.shields.io/badge/hacs-custom-orange.svg?style=flat-square
[gh-sponsors-url]: https://github.com/sponsors/bhuebschen
[gh-sponsors-image]: https://img.shields.io/github/sponsors/bhuebschen?style=flat-square

<!-- References -->

[preview]: https://github.com/bhuebschen/circle-menu-card/assets/1864448/39352877-43fa-49ce-a517-079e3783a95d
[home-assistant]: https://www.home-assistant.io/
[hacs]: https://hacs.xyz
[latest-release]: https://github.com/bhuebschen/circle-menu-card/releases/latest
[ha-scripts]: https://www.home-assistant.io/docs/scripts/
[edit-readme]: https://github.com/bhuebschen/circle-menu-card/edit/master/README.md
