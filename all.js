class Header extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `
      
      <ul>
          <button class="btn" onclick = "window.location.href='index.html'"><i class="fa fa-home"></i></button>
          <li style="float:right"><a class="active" href="plane.html">Plane</a></li>
          <li style="float:right"><a class="active" href="bounce.html">Bounce</a></li>
      </ul>
    `;
    }
  }

  customElements.define('header-component', Header);


  class Footer extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `
      <footer>
        Created by L & M.
        <button style='float:right'>Contact Us</button>
      </footer>
    `;
    }
  }

  customElements.define('footer-component', Footer);