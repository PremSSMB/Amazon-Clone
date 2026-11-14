
/* =====================================
   AMAZON CLONE - DEMO JAVASCRIPT
===================================== */

// 1. Get the HTML elements we need.

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchCategory = document.querySelector("#search-category");
const categoryCards = document.querySelectorAll(".shop-section .box");
const shopSection = document.querySelector("#shop-section");
const statusMessage = document.querySelector("#status-message");
const cartCount = document.querySelector("#cart-count");

const siteDialog = document.querySelector("#site-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogBody = document.querySelector("#dialog-body");
const dialogActions = document.querySelector("#dialog-actions");

if (
    !searchForm || !searchInput || !searchCategory ||
    !shopSection || !statusMessage || !cartCount ||
    !siteDialog || !dialogTitle || !dialogBody || !dialogActions
) {
    console.error("Some required HTML elements are missing. Check index.html.");

} else {

    // 2. Sample products for each category.

    const demoProducts = {
        clothing: {
            name: "Everyday Clothing Set",
            price: 24.99
        },
        care: {
            name: "Personal Care Essentials",
            price: 18.50
        },
        home: {
            name: "Modern Home Decor Set",
            price: 39.99
        },
        beauty: {
            name: "Beauty Starter Kit",
            price: 22.00
        },
        electronics: {
            name: "Wireless Tech Accessory",
            price: 29.99
        },
        pets: {
            name: "Pet Care Starter Pack",
            price: 16.99
        },
        toys: {
            name: "Creative Building Toy Set",
            price: 19.99
        },
        fashion: {
            name: "Everyday Fashion Accessory",
            price: 14.99
        }
    };


    // 3. Search keywords for each category.

    const categoryKeywords = {
        clothing: "clothing clothes fabric fabrics shirts jackets apparel",
        care: "care personal skincare soap lotion wellness health medical groceries",
        home: "home furniture decoration decor living sofa chair lamp",
        beauty: "beauty makeup cosmetics lipstick brushes",
        electronics: "electronics technology computer laptop headphones gadgets",
        pets: "pets pet food dog cat animals supplies",
        toys: "toys games blocks building kids play",
        fashion: "fashion trends bags shoes accessories style"
    };


    // 4. Create an empty shopping cart.

    const cart = [];


    // 5. Format prices as US dollars.

    function formatPrice(amount) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(amount);
    }


    // 6. Protect text before inserting it into HTML.

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            const replacements = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return replacements[character];
        });
    }


    // 7. Open the pop-up window.

    function openDialog(title, bodyHTML, actionsHTML = "") {

        dialogTitle.textContent = title;
        dialogBody.innerHTML = bodyHTML;
        dialogActions.innerHTML = actionsHTML;

        if (!siteDialog.open) {
            siteDialog.showModal();
        }
    }


    // 8. Display a message below the categories.

    function showStatus(message) {
        statusMessage.textContent = message;
    }


    // 9. Filter shopping categories.

    function filterCategories(category = "all", searchTerm = "") {

        const normalizedTerm = searchTerm.trim().toLowerCase();

        let visibleCount = 0;

        categoryCards.forEach(function (card) {

            const cardCategory = card.dataset.category;

            const cardTitle = card.querySelector("h2")
                .textContent.toLowerCase();

            const keywords = categoryKeywords[cardCategory] || "";

            const matchesCategory =
                category === "all" || cardCategory === category;

            const searchableText =
                `${cardTitle} ${cardCategory} ${keywords}`;

            const matchesSearch =
                normalizedTerm === "" ||
                searchableText.includes(normalizedTerm);

            const shouldShow = matchesCategory && matchesSearch;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }

        });

        if (visibleCount === 0) {

            showStatus("No matching categories were found. Try another search.");

        } else if (normalizedTerm || category !== "all") {

            showStatus(`Showing ${visibleCount} ${
                visibleCount === 1 ? "category" : "categories"
            }.`);

        } else {

            showStatus("");
        }

        return visibleCount;
    }


    // 10. Search functionality.

    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();

        filterCategories(searchCategory.value, searchInput.value);

        shopSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });


    // 11. Update the cart number.

    function updateCartCount() {

        const totalItems = cart.reduce(function (total, item) {
            return total + item.quantity;
        }, 0);

        cartCount.textContent = totalItems;
    }


    // 12. Add products to the cart.

    function addToCart(category) {

        const product = demoProducts[category];

        if (!product) {
            showStatus("Sorry, that demo product is not available.");
            return;
        }

        const existingItem = cart.find(function (item) {
            return item.category === category;
        });

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                category: category,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        updateCartCount();

        showStatus(`${product.name} was added to your demo cart.`);

        openDialog(
            "Added to Cart",

            `<p><strong>${escapeHTML(product.name)}</strong> was added to your demo cart.</p>
             <p>Price: ${formatPrice(product.price)}</p>`,

            `<button type="button" data-action="cart">View Cart</button>
             <button type="button" data-action="close-dialog">Continue Shopping</button>`
        );
    }


    // 13. Display the shopping cart.

    function showCart() {

        if (cart.length === 0) {

            openDialog(
                "Your Cart",
                "<p>Your demo cart is empty. Choose a category and select Shop More to add a sample item.</p>"
            );

            return;
        }

        let total = 0;

        let itemsHTML = "<div class=\"cart-items\">";

        cart.forEach(function (item, index) {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;

            itemsHTML += `
                <div class="cart-item">

                    <p><strong>${escapeHTML(item.name)}</strong></p>

                    <p>${formatPrice(item.price)} each</p>

                    <p>Quantity: ${item.quantity}</p>

                    <p>Subtotal: ${formatPrice(itemTotal)}</p>

                    <button type="button"
                        data-action="decrease-cart-item"
                        data-index="${index}">−</button>

                    <button type="button"
                        data-action="increase-cart-item"
                        data-index="${index}">+</button>

                    <button type="button"
                        data-action="remove-cart-item"
                        data-index="${index}">Remove</button>

                    <hr>

                </div>
            `;
        });

        itemsHTML += `
            </div>
            <p><strong>Demo total: ${formatPrice(total)}</strong></p>
            <p><small>This is a practice cart. No purchase or payment will be made.</small></p>
        `;

        openDialog(
            "Your Cart",

            itemsHTML,

            `<button type="button" data-action="clear-cart">Clear Cart</button>
             <button type="button" data-action="close-dialog">Continue Shopping</button>`
        );
    }


    // 14. Explore a category.

    function exploreCategory(category) {

        const product = demoProducts[category];

        const card = document.querySelector(
            `.box[data-category="${category}"]`
        );

        if (!product || !card) {
            showStatus("This category is not available.");
            return;
        }

        const categoryName = card.querySelector("h2").textContent;

        openDialog(
            categoryName,

            `<p>Explore this sample product:</p>
             <p><strong>${escapeHTML(product.name)}</strong></p>
             <p>Demo price: ${formatPrice(product.price)}</p>
             <p><small>This is sample content for your student project.</small></p>`,

            `<button type="button"
                data-action="add-to-cart"
                data-category="${category}">Add to Cart</button>

             <button type="button"
                data-action="close-dialog">Close</button>`
        );
    }


    // 15. Handle clicks on the page.

    document.addEventListener("click", function (event) {

        // Navigation category filters.

        const filterButton = event.target.closest("[data-filter]");

        if (filterButton) {

            const selectedFilter = filterButton.dataset.filter;

            searchInput.value = "";
            searchCategory.value = "all";

            filterCategories(selectedFilter);

            shopSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }


        // Buttons with data-action.

        const actionButton = event.target.closest("[data-action]");

        if (!actionButton) return;

        const action = actionButton.dataset.action;


        switch (action) {

            // Change delivery location.

            case "location": {

                const addressElement = document.querySelector(
                    ".nav-address .add-second"
                );

                const currentLocation = addressElement
                    ? addressElement.textContent
                    : "USA";

                const newLocation = window.prompt(
                    "Enter your delivery city or ZIP code:",
                    currentLocation
                );

                if (newLocation && newLocation.trim() && addressElement) {

                    addressElement.textContent = newLocation.trim();

                    showStatus(
                        `Demo delivery location set to ${newLocation.trim()}.`
                    );
                }

                break;
            }


            // Account pop-up.

            case "account":

                openDialog(
                    "Account & Lists",
                    "<p>This is a student shopping demo. Real Amazon sign-in is not connected. Do not enter a real password or sensitive information.</p>"
                );

                break;


            // Orders pop-up.

            case "orders":

                openDialog(
                    "Returns & Orders",
                    "<p>You do not have any demo orders yet. This project does not connect to real orders or returns.</p>"
                );

                break;


            // Shopping cart.

            case "cart":

                showCart();

                break;


            // Explore category.

            case "explore":

                exploreCategory(actionButton.dataset.category);

                break;


            // Add product.

            case "add-to-cart":

                addToCart(actionButton.dataset.category);

                break;


            // Close pop-up.

            case "close-dialog":

                siteDialog.close();

                break;


            // Increase quantity.

            case "increase-cart-item": {

                const index = Number(actionButton.dataset.index);

                if (Number.isInteger(index) && cart[index]) {

                    cart[index].quantity++;

                    updateCartCount();

                    showCart();
                }

                break;
            }


            // Decrease quantity.

            case "decrease-cart-item": {

                const index = Number(actionButton.dataset.index);

                if (Number.isInteger(index) && cart[index]) {

                    cart[index].quantity--;

                    if (cart[index].quantity <= 0) {
                        cart.splice(index, 1);
                    }

                    updateCartCount();

                    showCart();
                }

                break;
            }


            // Remove an item.

            case "remove-cart-item": {

                const index = Number(actionButton.dataset.index);

                if (Number.isInteger(index) && cart[index]) {

                    cart.splice(index, 1);

                    updateCartCount();

                    showCart();
                }

                break;
            }


            // Clear cart.

            case "clear-cart":

                cart.length = 0;

                updateCartCount();

                showCart();

                break;


            // Back to top.

            case "back-to-top":

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                break;


            // Choose language.

            case "language":

                openDialog(
                    "Choose a Language",

                    `<label for="language-choice">Select a demo language:</label>
                     <select id="language-choice">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                     </select>`,

                    `<button type="button" data-action="apply-language">Apply</button>`
                );

                break;


            // Apply language.

            case "apply-language": {

                const choice = document.querySelector("#language-choice");

                const languageButton = document.querySelector(
                    'button[data-action="language"]'
                );

                if (choice && languageButton) {
                    languageButton.textContent = `Language: ${choice.value}`;
                }

                siteDialog.close();

                break;
            }


            // Choose country.

            case "country":

                openDialog(
                    "Choose a Country",

                    `<label for="country-choice">Select a demo country:</label>
                     <select id="country-choice">
                        <option>United States</option>
                        <option>Canada</option>
                        <option>India</option>
                        <option>United Kingdom</option>
                     </select>`,

                    `<button type="button" data-action="apply-country">Apply</button>`
                );

                break;


            // Apply country.

            case "apply-country": {

                const choice = document.querySelector("#country-choice");

                const countryButton = document.querySelector(
                    'button[data-action="country"]'
                );

                if (choice && countryButton) {
                    countryButton.textContent = choice.value;
                }

                siteDialog.close();

                break;
            }

        }

    });


    // 16. Close pop-up when clicking outside the box.

    siteDialog.addEventListener("click", function (event) {

        if (event.target === siteDialog) {
            siteDialog.close();
        }

    });


    // 17. Set cart count when the page loads.

    updateCartCount();

}

