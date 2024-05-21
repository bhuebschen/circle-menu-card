class CircleMenuCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  setConfig(config) {
    if (
      !config.items ||
      !Array.isArray(config.items) ||
      config.items.length === 0
    ) {
      throw new Error("You need to define an array of items");
    }

    this._config = config;
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    const { _config } = this;
    const leftMenuEnabled = _config.left ? ' circular-menu-left' : '';

    this.shadowRoot.innerHTML = `
      <style>
        .circular-menu {
          position: fixed;
          bottom: 1em;
          right: 1em;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .circular-menu .floating-btn {
          display: block;
          width: 3.5em;
          height: 3.5em;
          border-radius: 50%;
          background-color: ${_config.button_color || "#03A9F4"};
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
          color: ${_config.icon_color || "white"} !important;
          text-align: center;
          line-height: 2.6;
          cursor: pointer;
          outline: 0;
        }
        .circular-menu.active .floating-btn {
          box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
        }
        .circular-menu .floating-btn:active {
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
        .circular-menu menu ha-icon, .circular-menu menu ha-icon ha-svg-icon {
          fill: ${_config.icon_color || "white"};
        }
        .circular-menu .floating-btn ha-icon {
          font-size: 1.3em;
          transition: transform .2s;
        }
        .circular-menu.active .floating-btn a {
          transform: rotate(-45deg);
        }
        .circular-menu:after {
          display: block;
          content: ' ';
          width: 3.5em;
          height: 3.5em;
          border-radius: 50%;
          position: absolute;
          top: 0;
          right: 0;
          z-index: -2;
          background-color: ${_config.menu_background_color || "#03A9F4"};
          transition: all .3s ease;
        }
        .circular-menu.active:after {
          transform: scale3d(5.5, 5.5, 1);
          transition-timing-function: cubic-bezier(0.68, 1.55, 0.265, 1);
        }
        .circular-menu .items-wrapper {
          padding: 0;
          margin: 0;
        }
        .circular-menu .menu-item {
          position: absolute;
          top: .2em;
          right: .2em;
          z-index: -1;
          display: block;
          text-decoration: none;
          color: white;
          font-size: 1em;
          width: 3em;
          height: 3em;
          border-radius: 50%;
          text-align: center;
          line-height: 2.8;
          background-color: rgba(0, 0, 0, 0.1);
          transition: transform .3s ease, background .2s ease;
        }
        .circular-menu .menu-item:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
        .circular-menu.active .menu-item {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .circular-menu.active .menu-item:nth-child(1) {
          transform: translate3d(1em, -7em, 0);
        }
        .circular-menu.active .menu-item:nth-child(2) {
          transform: translate3d(-3.5em, -6.3em, 0);
        }
        .circular-menu.active .menu-item:nth-child(3) {
          transform: translate3d(-6.5em, -3.2em, 0);
        }
        .circular-menu.active .menu-item:nth-child(4) {
          transform: translate3d(-7em, 1em, 0);
        }
        .circular-menu.circular-menu-left {
          right: auto;
          left: 1em;
        }
        .circular-menu.circular-menu-left .floating-btn, .circular-menu.circular-menu-left:after {
          background-color: ${_config.menu_background_color || "#03A9F4"};
        }
        .circular-menu.circular-menu-left.active .floating-btn a {
          transform: rotate(45deg);
        }
        .circular-menu.circular-menu-left.active .menu-item:nth-child(1) {
          transform: translate3d(-1em, -7em, 0);
        }
        .circular-menu.circular-menu-left.active .menu-item:nth-child(2) {
          transform: translate3d(3.5em, -6.3em, 0);
        }
        .circular-menu.circular-menu-left.active .menu-item:nth-child(3) {
          transform: translate3d(6.5em, -3.2em, 0);
        }
        .circular-menu.circular-menu-left.active .menu-item:nth-child(4) {
          transform: translate3d(7em, 1em, 0);
        }
      </style>
      <div id="circularMenu" class="circular-menu${leftMenuEnabled}">
        <a class="floating-btn">
        <ha-icon icon="${_config.icon}"></ha-icon>
        </a>
        <menu class="items-wrapper hidden"></menu>
      </div>
    `;

    const container = this.shadowRoot.querySelector('.items-wrapper');
    const floatingBtn = this.shadowRoot.querySelector('.floating-btn');
    const circularMenu = this.shadowRoot.querySelector('#circularMenu');

    _config.items.slice(0, 4).forEach((itemConfig, index) => {
      const item = document.createElement('div');
      item.classList.add('menu-item');
      item.innerHTML = `<ha-icon icon="${itemConfig.icon}"></ha-icon>`;
      item.title = itemConfig.alt || `Item ${index + 1}`;
      item.addEventListener('click', () => this._handleAction(itemConfig.action));
      container.appendChild(item);
    });

    floatingBtn.addEventListener('click', () => {
      circularMenu.classList.toggle('active');
      container.classList.toggle('hidden');
    });
  }

  _handleAction(actionConfig) {
    if (!actionConfig) return;

    if (actionConfig.action === 'navigate' && actionConfig.navigation_path) {
      window.location.href = actionConfig.navigation_path;
    } else if (actionConfig.action === 'call-service' && actionConfig.service) {
      const [domain, service] = actionConfig.service.split('.', 2);
      this._hass.callService(domain, service, actionConfig.service_data);
    }
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    return 0; // This card doesn't occupy any space
  }
}

customElements.define('circle-menu-card', CircleMenuCard);