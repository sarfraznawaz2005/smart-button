class SmartButton extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });
        
        this.shadowRoot.innerHTML = '<button type="submit"><slot><slot></button>';
    }

    connectedCallback() {
        this._button = this.shadowRoot.querySelector("button");
        this.shadowRoot.querySelector("button").addEventListener('click', this._submit.bind(this));
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector("button").removeEventListener('click', this._submit.bind(this));
    }

    _submit() {
        let textProperty = ('innerText' in this) ? 'innerText' : 'textContent';
        let label = this[textProperty];
        let timeout = this.getAttribute('timeout') || 5000;
        let form = this.findParentForm(this);

        this._button.disabled = true;
        this[textProperty] = this.getAttribute('text') || 'Wait...';

        if (form) {
            form.submit();
        }

        setTimeout(function() {
            this[textProperty] = label;
            this._button.disabled = false;
        }.bind(this), timeout);
    }

    findParentForm(el) {
        let parent = el.parentNode;

        if ((typeof findParentForm !== 'undefined') && (parent && parent.tagName != 'FORM')) {
            parent = findParentForm(parent);
        }

        return parent.tagName == 'FORM' ? parent : null;
    }
}

customElements.define('smart-button', SmartButton);