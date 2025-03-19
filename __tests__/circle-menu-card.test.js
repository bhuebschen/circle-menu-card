global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { getByRole } = require('@testing-library/dom');
import '@testing-library/jest-dom';

// Lade den Inhalt von circle-menu-card.js
const scriptContent = fs.readFileSync(
  path.resolve(__dirname, '../circle-menu-card.js'),
  'utf8',
);

describe('Circle Menu Card', () => {
  let window;
  let document;

  beforeEach(() => {
    // Erstelle ein neues JSDOM-DOM
    const dom = new JSDOM('<!DOCTYPE html><div id="root"></div>', {
      runScripts: 'dangerously',
    });
    window = dom.window;
    document = window.document;

    // Füge das Skript zum DOM hinzu
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Warte, bis das Skript geladen ist
    return new Promise((resolve) => {
      scriptEl.onload = resolve;
    });
  });

  test('stellt sicher, dass die circle-menu-card Komponente registriert ist', () => {
    expect(window.customElements.get('circle-menu-card')).toBeDefined();
  });

  test('rendert die circle-menu-card Komponente', () => {
    // Füge die Komponente zum DOM hinzu
    const circleMenuCard = document.createElement('circle-menu-card');
    document.body.appendChild(circleMenuCard);

    // Überprüfe, ob die Komponente im DOM vorhanden ist
    expect(document.querySelector('circle-menu-card')).not.toBeNull();
  });

  test('stellt sicher, dass das Menü-Icon gerendert wird', () => {
    // Füge die Komponente zum DOM hinzu
    const circleMenuCard = document.createElement('circle-menu-card');
    document.body.appendChild(circleMenuCard);

    // Suche das Menü-Icon
    const menuButton = getByRole(circleMenuCard.shadowRoot, 'button');
    expect(menuButton).toBeInTheDocument();
  });

  test('öffnet das Menü bei Klick auf das Menü-Icon', () => {
    // Füge die Komponente zum DOM hinzu
    const circleMenuCard = document.createElement('circle-menu-card');
    document.body.appendChild(circleMenuCard);

    // Suche das Menü-Icon
    const menuButton = getByRole(circleMenuCard.shadowRoot, 'button');
    expect(menuButton).toBeInTheDocument();

    // Klicke auf das Menü-Icon
    menuButton.click();

    // Überprüfe, ob das Menü geöffnet ist
    const menu = circleMenuCard.shadowRoot.querySelector('.menu');
    expect(menu).toHaveClass('open');
  });
});
