class SmartButton extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = '<button type="submit"><slot><slot></button>';

        this._button = this.shadowRoot.querySelector("button");
    }

    connectedCallback() {
        this._button.addEventListener('click', function (e) {
            var textProperty = ('innerText' in this) ? 'innerText' : 'textContent';
            var label = this[textProperty];            
            var timeout = this.getAttribute('timeout') || 5000;
            var text = this.getAttribute('text') || 'Wait...';
            
            // fake up submit button due to shadow-dom
            var submit = this.parentNode.appendChild(document.createElement('button'));
            submit.style.display = 'none';

            // disable and change label
            this._button.disabled = true;
            this[textProperty] = text;

            // revert
            setTimeout(function () {
                this[textProperty] = label;
                this._button.disabled = false;
            }.bind(this), timeout);

            submit.click();

        }.bind(this));
    }
}

window.customElements.define('smart-button', SmartButton);