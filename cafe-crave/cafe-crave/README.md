# Cafe Crave

A multi-page cafe website built with plain HTML, CSS and JavaScript (no build step).

## Pages
- `index.html` – home, featured dishes, testimonials, hours
- `menu.html` – 18 dishes with category filters, search and add-to-cart
- `about.html` – story, values, team
- `reservation.html` – table booking form with validation
- `contact.html` – contact form with validation
- `cart.html` – cart, quantity controls, GST (5%) and a demo checkout

## Run it with VS Code Live Server
1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open the **Extensions** panel and install **Live Server** (by Ritwick Dey).
3. Use **File → Open Folder…** and choose the `cafe-crave` folder.
4. Right-click `index.html` and choose **Open with Live Server** (or click **Go Live** in the status bar).
5. The site opens at `http://127.0.0.1:5500/`. Edits reload automatically.

No Live Server? You can also double-click `index.html`, or run `python -m http.server` in the folder and visit `http://localhost:8000`.

## Notes
- Cart data is stored in `localStorage` under `cafeCraveCart`.
- Header and footer are injected by `js/main.js` into every page.
- Food photos load from Unsplash; if one fails, a branded placeholder is shown. Put local images in `assets/images/` and update the `img` paths in `js/menu.js` if you prefer.
- Checkout, reservation and contact forms are demos: nothing is sent or stored on a server.
