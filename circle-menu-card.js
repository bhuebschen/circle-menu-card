class CircleMenuCard extends HTMLElement {
  static get properties() {
    return {
      _config: {},
      _hass: {},
    };
  }

  _localConfig = {};
  _data = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._menuListenersAttached = false;
    this.positiveStates = [
      true,
      'true',
      'on',
      'open',
      'active',
      'detected',
      'occupied',
      'unlocked',
      'home',
      'above_horizon',
      'ready',
    ];
    this._localConfig = {};
  }

  connectedCallback() {
    this.render();
    if (!this._menuListenersAttached && this.shadowRoot) {
      this.setupMenuListener();
      this._menuListenersAttached = true;
    }
  }

  disconnectedCallback() {
    this.removeMenuListener();
    this._menuListenersAttached = false;
  }

  jsonConcat(o1, o2) {
    return Object.assign({}, o1, o2);
  }

  setConfig(config) {
    this._config = config;
    this._localConfig = this._config;
    this.render();
  }

  render() {
    this.removeMenuListener();
    if (!this.shadowRoot) return;

    if (this._config.json_config && this._data) {
      this._localConfig = this.jsonConcat(this._data, this._config);
    }

    const leftMenuEnabled = this._localConfig.left ? ' circular-menu-left' : '';
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim();
    const textPrimaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-primary-color')
      .trim();
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-color')
      .trim();

    this.shadowRoot.innerHTML = `
      <style>
        .circular-menu {
          position: fixed;
          bottom: 1em;
          right: 1em;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1024;
        }
        .circular-menu .floating-btn {
          display: block;
          width: 3.5em;
          height: 3.5em;
          border-radius: 50%;
          background-color: ${this._localConfig.button_color || primaryColor};
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
          color: ${this._localConfig.icon_color || textPrimaryColor} !important;
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
          fill: ${this._localConfig.icon_color || textPrimaryColor};
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
          background-color: ${this._localConfig.menu_background_color || primaryColor};
          transition: all .3s ease;
        }
        .circular-menu.active:after {
          transform: scale(5.5, 5.5);
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
          cursor: pointer;
        }
        .circular-menu .menu-item:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
        .circular-menu .menu-item.active {
          background-color: ${this._localConfig.item_active_color || accentColor};
        }
        .circular-menu.active .menu-item {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .circular-menu.circular-menu-left {
          right: auto;
          left: 1em;
        }
        .circular-menu.circular-menu-left.active .floating-btn a {
          transform: rotate(45deg);
        }
        .circular-menu.active ha-icon {
          transition: all 3s ease;
        }
        .circular-menu.active ha-icon.icon {
          display: none;
        }
        .circular-menu.active ha-icon.close {
          display: block;
        }
        .circular-menu.active .menu-item { transform: translate(var(--x), var(--y)); }
      </style>
      <div id="circularMenu" class="circular-menu${leftMenuEnabled}">
        <a class="floating-btn">
        <ha-icon class="icon" icon="${this._localConfig.icon}"></ha-icon>
        <ha-icon class="close" icon="mdi:close"></ha-icon>
        </a>
        <menu class="items-wrapper hidden"></menu>
      </div>
    `;

    if (this._localConfig.positive_states) {
      this.positiveStates = this._localConfig.positive_states;
    }

    if (this._config.json_config) {
      if (Object.keys(this._data).length == 0 && this._config.json_config) {
        fetch(this._config.json_config)
          .then((res) => res.json())
          .then((data) => {
            this._data = data;
            this.render();
          });
      }
      if (this._localConfig.items) {
        this.loadMenuItems();
      }
    } else {
      if (this._localConfig.items) {
        this.loadMenuItems();
      }
    }
    this.setupMenuListener();
  }

  loadMenuItems() {
    const container = this.shadowRoot.querySelector('.items-wrapper');
    container.innerHTML = '';
    const itemAngle = 140 / this._localConfig.items.length;
    const angleOffset = [47, 6, -1, -7][this._localConfig.items.length - 1];

    this._localConfig.items.slice(0, 4).forEach((itemConfig, index) => {
      const angle = itemAngle * index - 90 + angleOffset;

      const item = document.createElement('div');
      item.classList.add('menu-item');
      item.innerHTML = `<ha-icon icon="${itemConfig.icon}"></ha-icon>`;
      item.title = itemConfig.alt || `Item ${index + 1}`;
      if (
        itemConfig.action.action === 'call-service' &&
        itemConfig.action.service_data &&
        itemConfig.action.service_data.entity_id
      ) {
        item.setAttribute(
          'data-entity-id',
          itemConfig.action.service_data.entity_id,
        );
        setTimeout(() => {
          this.updateActiveClass(itemConfig.action.service_data.entity_id);
        }, 100);
      }
      const radius = 7;
      let x = radius * Math.cos((angle * Math.PI) / 180);
      let y = radius * Math.sin((angle * Math.PI) / 180);
      if (!this._localConfig.left) x = -x;
      item.style.setProperty('--x', `${x}em`);
      item.style.setProperty('--y', `${y}em`);

      item.addEventListener('click', () => {
        if (
          itemConfig.action.action === 'navigate' &&
          itemConfig.action.navigation_path
        ) {
          history.pushState(null, '', itemConfig.action.navigation_path);
          const event = new Event('location-changed', {
            bubbles: true,
            composed: true,
          });
          window.dispatchEvent(event);
        } else if (
          itemConfig.action.action === 'call-service' &&
          itemConfig.action.service
        ) {
          this._hass.callService(
            itemConfig.action.service.split('.')[0],
            itemConfig.action.service.split('.')[1],
            itemConfig.action.service_data || {},
          );
        }
      });

      container.appendChild(item);
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

  setupMenuListener() {
    this.removeMenuListener();
    const container = this.shadowRoot.querySelector('.items-wrapper');
    const floatingBtn = this.shadowRoot.querySelector('.floating-btn');
    const circularMenu = this.shadowRoot.querySelector('#circularMenu');
    let timeoutId;

    const closeMenu = () => {
      circularMenu.classList.remove('active');
      container.classList.add('hidden');
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const startCloseTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(closeMenu, this._localConfig.auto_close);
    };

    this._floatingBtnClickListener = (event) => {
      event.stopPropagation();

      const isActive = circularMenu.classList.contains('active');
      closeMenu();

      if (!isActive) {
        circularMenu.classList.add('active');
        container.classList.remove('hidden');
        if ('auto_close' in this._localConfig) {
          startCloseTimer();
        }
      }
    };

    this._containerClickListener = (event) => {
      event.stopPropagation();
      clearTimeout(timeoutId);
      timeoutId = null;
    };

    this._containerMouseEnterListener = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    this._containerMouseLeaveListener = () => {
      container.classList.remove('hidden');
      if ('auto_close' in this._localConfig) {
        startCloseTimer();
      }
    };

    this._documentClickListener = (event) => {
      if (!circularMenu.contains(event.target)) {
        closeMenu();
      }
    };

    floatingBtn.addEventListener('click', this._floatingBtnClickListener);
    container.addEventListener('click', this._containerClickListener);
    container.addEventListener('mouseenter', this._containerMouseEnterListener);
    container.addEventListener('mouseleave', this._containerMouseLeaveListener);
    document.addEventListener('click', this._documentClickListener);
  }

  // Erstellen Sie eine Funktion, die den Zustand der Entität überprüft und die Klasse hinzufügt/entfernt
  updateActiveClass(entityId) {
    try {
      const entityState = this._hass.states[entityId].state;
      const menuItem = this.shadowRoot.querySelector(
        `.menu-item[data-entity-id="${entityId}"]`,
      );
      if (this.positiveStates.includes(entityState)) {
        menuItem.classList.add('active');
      } else {
        menuItem.classList.remove('active');
      }
    } catch (error) {
      //
    }
  }

  removeMenuListener() {
    const container = this.shadowRoot.querySelector('.items-wrapper');
    const floatingBtn = this.shadowRoot.querySelector('.floating-btn');

    if (floatingBtn) {
      floatingBtn.removeEventListener('click', this._floatingBtnClickListener);
    }
    if (container) {
      container.removeEventListener('click', this._containerClickListener);
      container.removeEventListener(
        'mouseenter',
        this._containerMouseEnterListener,
      );
      container.removeEventListener(
        'mouseleave',
        this._containerMouseLeaveListener,
      );
    }
    document.removeEventListener('click', this._documentClickListener);
  }

  static getStubConfig() {
    return {
      left: false,
      icon: 'mdi:menu',
      items: [
        {
          icon: 'mdi:lightbulb',
          alt: 'Light Control',
          action: {
            action: 'call-service',
            service: 'light.turn_on',
            service_data: { entity_id: 'light.living_room' },
          },
        },
      ],
    };
  }

  set hass(hass) {
    if (this._hass && this._localConfig && this._localConfig.items) {
      for (const item of this._localConfig.items) {
        try {
          if (
            item.action.service_data &&
            item.action.service_data.entity_id &&
            this._hass.states[item.action.service_data.entity_id].state !==
              hass.states[item.action.service_data.entity_id].state
          ) {
            setTimeout(() => {
              this.updateActiveClass(item.action.service_data.entity_id);
            }, 100);
          }
        } catch (error) {
          //
        }
      }
    }

    this._hass = hass;
  }

  getCardSize() {
    return 0; // This card doesn't occupy any space
  }

  static getConfigElement() {
    return document.createElement('circle-menu-card-editor');
  }
}

customElements.define('circle-menu-card', CircleMenuCard);

class CircleMenuCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  render() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    let localConfig = JSON.parse(JSON.stringify(this._config));
    try {
      delete localConfig.type;
      delete localConfig.json_config;
    } catch (error) {
      alert(error);
    }
    this.shadowRoot.innerHTML = `
      <div class="card-config">
          <h3>JSON Configuration</h3>
          <pre>${JSON.stringify(localConfig, null, 2)}</pre>
      </div>
    `;
    localConfig = this._config;
  }
}

customElements.define('circle-menu-card-editor', CircleMenuCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'circle-menu-card',
  name: 'Circle Menu Card',
  description: 'A customizable floating circular menu card with actions.',
  preview: false,
  documentationURL: 'https://github.com/bhuebschen/circle-menu-card',
});

console.info(
  '%c  CIRCLE-MENU-CARD  \n%c   Version: 1.0.3   ',
  'color: white; background: #3498db; font-weight: bold; padding: 5px 0;',
  'color: white; background: #333; font-weight: bold; padding: 5px 0;',
);
