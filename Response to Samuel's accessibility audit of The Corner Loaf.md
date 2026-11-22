# Response to Samuel's accessibility audit of The Corner Loaf

Nov 18, 2026 · @Joshua

Samuel's seven findings contain 15 distinct issues. Checked against my repo and my own NVDA and Narrator testing, 10 hold, 1 needs a re-check, and 4 are true observations that do not break WCAG. I would rate 8 of them differently from Samuel: 6 lower and 2 higher. Severity uses the [WebAIM severity ratings](https://webaim.org/blog/severity-ratings/).

## Verdicts at a glance

| # | Issue Samuel raised | Holds? | Samuel's rating | My rating |
| --- | --- | --- | --- | --- |
| 1 | Menu table has no row headers | Yes | Critical | Moderate |
| 2 | Product text is cut off at Very Large font size | Yes | Significant | Significant (agree) |
| 3a | Focus is barely visible on form inputs | Yes | Significant | Significant (agree) |
| 3b | Focus is barely visible on the submit buttons | Yes | Significant | Re-check first |
| 3c | Submit buttons look borderless in Windows High Contrast | Yes | Significant | Moderate |
| 4a | Cedi symbol is skipped by Windows Narrator | Yes, Windows Narrator skips but other screen readers like NVDA does not skip it | Moderate | Recommendation |
| 4b | Four items share the same generic image alt text | Yes | Moderate | Moderate (agree) |
| 5a | FAQ questions are not headings | True, not a violation | Moderate | Recommendation |
| 5b | "plus" is read aloud on FAQ buttons | True, not a violation | Moderate | Recommendation |
| 5c | No skip link | Not a failure | Moderate | Not an issue |
| 6a | Contact form error leaves focus on Submit | Yes | Moderate | Moderate (agree) |
| 6b | Changing Order Type resets the chosen item | Yes | Moderate | Moderate (agree) |
| 7a | Personal fields have no `autocomplete` | Yes | Recommendation | Moderate |
| 7b | Required fields have no visual marker | Yes | Recommendation | Moderate |
| 7c | WhatsApp and email are plain text, not links | True, not a WCAG failure | Recommendation | Recommendation (agree) |

The code references below are to the current repo, which has one commit dated 12 November. Samuel's line numbers do not match it, so he may have audited an older version.

## Finding 1: Menu table has no row headers

- **Samuel states:** reading down the Price or Available column in Narrator announces only "GH 28, row 2 of 7", never the bread's name. He calls it Critical and asks for `th scope="row"` and a `<caption>`.
- **Verdict: holds.** `renderMenuTable()` in `script.js` (lines 168 to 177) creates every body cell as a `td`. Only the header row uses `th scope="col"` (`index.html` lines 109 to 112). My NVDA result and his Narrator result do not contradict each other. NVDA announces the column header when moving across a row. When moving down a column, neither reader says the item name, because no cell is marked as a row header.
- **Caption:** Samuel is wrong that it is required. WCAG asks for header cells to be marked up correctly. A caption is one technique for naming a table, not a requirement, and this table already has a region label and an `h2` above it.
- **Rating: Critical becomes Moderate.** WebAIM defines Critical as content that is completely inaccessible to some users. Here the table is recognised, the column headers work and the item name is one cell to the left, so a screen reader user gets the information with extra effort. That matches Moderate. Significant is defensible because this is the complaint in the brief, but Critical is not.
- **How to fix:**

```js
// script.js, inside renderMenuTable()
[
  product.name,
  product.description,
  formatPrice(product),
  formatAvailability(product.days),
].forEach((value, i) => {
  const cell = document.createElement(i === 0 ? "th" : "td");
  if (i === 0) cell.scope = "row";
  cell.textContent = value;
  row.appendChild(cell);
});
```

```css
/* styles.css: stop the new row headers being centred */
.menu-table tbody th { text-align: left; }
```

Optional: give the table its own name with `aria-labelledby` on the table and an `id` on the "This Week's Bakes" `h2`, instead of adding a caption.

## Finding 2: Product text is cut off at Very Large font size

- **Samuel states:** with the browser font set to Very Large at 320px, text in the Available Today cards is clipped.
- **Verdict: holds.** The CSS explains it. `.product-card` has `overflow: hidden` (`styles.css` line 476), `.product-image` is a fixed 5rem wide (483 to 485) and grows with the root font size, `.product-price` is `white-space: nowrap` (513), and `.product-details` has no `min-width: 0` (491 to 494).
- **Rating: Significant, agree.** People who rely on large text cannot read item names or prices in the cards. It is not Critical because the same details appear in the weekly table below.
- **How to fix:**

```css
.product-card { flex-wrap: wrap; overflow: visible; }
.product-image {
  flex: 0 0 min(var(--width-3xs), 30%);
  width: min(var(--width-3xs), 30%);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}
.product-details { flex: 1 1 var(--width-2xs); min-width: 0; }
.product-header { flex-wrap: wrap; }
```

Then re-test at 320px with Very Large font size. This is the same kind of failure I found on Samuel's site.

## Finding 3: Focus is hard to see on forms, and submit buttons lose their borders in High Contrast

- **Samuel states:** focus is nearly invisible on all form inputs and both submit buttons, and the submit buttons look borderless in Windows High Contrast.
- **3a, inputs: holds.** `.form-field:focus` sets `outline: none` and relies on a 1px border colour change plus a faint 12% shadow (`styles.css` 329 to 333). The two border colours (`#767676` to `#8b4513`) differ by only about 1.5:1, well under the 3:1 that a visible focus change needs. Rating Significant, agree: a keyboard user filling in an order cannot tell which of the inputs is active.
- **3b, submit buttons: not verified.** Nothing in `styles.css` removes the outline on `.form-submit`. The only outline rules are on lines 264 to 266 and 330. The browser's default focus ring should therefore appear. Tab to both buttons in Chrome and Edge. If the ring is clearly visible, drop this part. If it is lost against the brown button, apply the fix below.
- **3c, High Contrast: holds.** `.form-submit` has `border: 0` (line 339), so in forced-colours mode the button has no edge. Rating Moderate, not Significant: the label is still readable and operable, only the button shape is lost.
- **How to fix:**

```css
/* remove outline: none and the box-shadow from .form-field:focus, then: */
.form-field:focus-visible { outline: 3px solid var(--secondary-color); outline-offset: 2px; }

.form-submit { border: var(--border-width-thick) solid transparent; }
.form-submit:focus-visible { outline: 3px solid var(--secondary-color); outline-offset: 3px; }
```

A transparent border is painted in a system colour in High Contrast mode, so the button regains an edge without changing how it looks normally.

## Finding 4: Currency symbol and image descriptions

### 4a. Cedi symbol is skipped

- **Samuel states:** Narrator reads "GH₵ 28" as "GH 28", dropping the cedi sign.
- **Verdict: holds, on Narrator only.** NVDA reads it as "GH Ghanaian cedi 28". The symbol comes from `formatPrice()` (`script.js` lines 82 to 85), which feeds the cards, the table and the dropdown.
- **Rating: Moderate becomes Recommendation.** The number and the "GH" prefix are still announced, and prices sit in obvious price positions on a Ghanaian bakery site. Listeners can understand it, and one reader out of two is affected.
- **How to fix (optional):** keep the visible price and give screen readers a spoken version.

```js
function setPrice(el, product) {
  const unit = product.priceUnit ? ` per ${product.priceUnit}` : "";
  const visible = document.createElement("span");
  visible.setAttribute("aria-hidden", "true");
  visible.textContent = formatPrice(product);
  const spoken = document.createElement("span");
  spoken.className = "sr-only";
  spoken.textContent = `${product.price} Ghana cedis${unit}`;
  el.replaceChildren(visible, spoken);
}
// createProductCard(): replace price.textContent = formatPrice(product) with setPrice(price, product)
// renderMenuTable(): for the price column (i === 2) call setPrice(cell, product)
```

```css
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
```

The dropdown options cannot hold extra elements, so leave them as they are.

### 4b. Generic image alt text

- **Samuel states:** four items share `bofrot.jpg` with the alt text "A selection of freshly baked treats".
- **Verdict: holds.** `script.js` lines 38 to 39, 46 to 47, 56 to 57 and 65 to 66. The two loaves also share "Fresh loaves baking in the oven" (lines 22 to 23 and 30 to 31), which Samuel did not flag but which has the same effect.
- **Rating: Moderate, agree.** Each card makes a screen reader user hear the same phrase before the item's heading, and the phrase does not describe that item.
- **How to fix:** each card's heading and description already name the item, so the image is decorative. In `createProductCard()` set `image.alt = "";` and delete the `imageAlt` properties from the data.

## Finding 5: FAQ headings, "plus" and the skip link

### 5a. FAQ questions are not headings

- **Samuel states:** the H key jumps from "Pre-Order FAQ" straight to "About The Corner Loaf", skipping the four questions.
- **Verdict: the observation is true, but it is not a WCAG failure.** The questions are `button` elements (`index.html` lines 126 to 134). WCAG 1.3.1 does not force every disclosure control to be a heading, the "Pre-Order FAQ" `h2` exists, and every question is reachable by Tab. The ARIA accordion pattern does recommend a heading around each trigger, so it is a best-practice gap.
- **Rating: Moderate becomes Recommendation.** Samuel can fairly point out that WebAIM's own Moderate example is missing headings. The answer is that nothing here is inaccessible or hidden, since the questions are named buttons.
- **How to fix:** it takes a minute, so just do it.

```html
<h3 class="faq-heading">
  <button type="button" class="faq-trigger" aria-expanded="false" aria-controls="faq-advance">
    How far in advance do I need to order?
  </button>
</h3>
```

```css
.faq-heading { margin: 0; font-size: inherit; }
```

The script finds buttons by the `.faq-trigger` class, so it keeps working.

### 5b. "Plus" is read aloud

- **Samuel states:** every FAQ button announces "plus" after the question.
- **Verdict: true on Narrator, not a violation.** The `+` is generated CSS (`styles.css` lines 269 to 271, and "−" on 278 to 280). The state is already conveyed by `aria-expanded` (`index.html` line 130), so the icon is redundant noise. My NVDA test did not read it.
- **Rating: Moderate becomes Recommendation.**
- **How to fix:**

```css
.faq-trigger::after { content: "+"; content: "+" / ""; }
.faq-item.active .faq-trigger::after { content: "−"; content: "−" / ""; }
```

Keep the plain declaration first. Browsers that do not understand the `/ ""` syntax ignore the second line and still show the icon.

### 5c. No skip link

- **Samuel states:** keyboard users must tab through the order form on every visit to reach the schedule or FAQ.
- **Verdict: not a failure.** WCAG 2.4.1 Bypass Blocks is about blocks that repeat across pages. This is one page with no navigation, and headings plus the `main` landmark already give a way to move past content (techniques H69 and ARIA11). The fair usability point is that the order form sits before the weekly bakes.
- **Rating: Moderate becomes not an issue.**
- **Decision: do not add one.** Write one line in the writeup: "No skip link was added. The page has no repeated navigation block to skip, and 2.4.1 is met through headings and the main landmark."

## Finding 6: Form errors and the Order Type reset

### 6a. Contact error leaves focus on Submit

- **Samuel states:** after submitting `abc@invalid`, the error is announced but keyboard focus stays on Send Message, and the email field has no `aria-invalid`.
- **Verdict: holds.** `initContactForm()` (`script.js` lines 305 to 313) only writes the message into the `role="status"` paragraph. It does not move focus or mark the field. The message does name the email field, so WCAG 3.3.1 is arguably met. The gap is the extra effort of finding the field again.
- **Rating: Moderate, agree.** A keyboard or screen reader user has to press Shift+Tab backwards to find the field to fix.
- **How to fix:**

```js
// in initContactForm(): get the field once, then on the error path
const emailInput = document.getElementById("contact-email");

if (!emailPattern.test(email)) {
  emailInput.setAttribute("aria-invalid", "true");
  emailInput.setAttribute("aria-describedby", "contact-status");
  showStatus("Please enter a valid email address.", true);
  emailInput.focus();
  return;
}
emailInput.removeAttribute("aria-invalid");
emailInput.removeAttribute("aria-describedby");
```

### 6b. Changing Order Type resets the chosen item

- **Samuel states:** selecting an item and then changing Order Type silently resets the Item dropdown to "Select an item".
- **Verdict: holds.** `populateProducts()` rebuilds the select with `innerHTML` (`script.js` lines 321 to 322), and it runs on every change of the type (lines 369 to 370). Type sits below Item in the form (`index.html` lines 36 to 85), so people fill in the item first and then lose it.
- **Rating: Moderate, agree.** A screen reader user may not notice that the choice was cleared and finds out when the form refuses to submit.
- **How to fix:** do both, they are small.
  1. In `index.html`, move the "Type" `form-group` above the "Item" `form-group`.
  2. Keep the selection when it is still valid:

```js
const updateOrderOptions = () => {
  const previous = productSelect.value;          // add this line first
  /* ...existing code that repopulates the select... */
  if ([...productSelect.options].some((o) => o.value === previous)) {
    productSelect.value = previous;               // add these lines last
  }
};
```

Optionally add `aria-live="polite"` to `#order-form-help` so the change of wording is announced.

## Finding 7: Autofill, required markers and contact links

### 7a. No `autocomplete` on personal fields

- **Samuel states:** the name, phone and email inputs have no `autocomplete` attributes.
- **Verdict: holds.** `#order-name`, `#order-contact`, `#contact-name` and `#contact-email` (`index.html` lines 55 to 62, 65 to 76 and 239 to 251). This is WCAG 1.3.5 Identify Input Purpose, a Level AA criterion, so it is a real failure and Samuel rated it too low.
- **Rating: Recommendation becomes Moderate.** People who find typing hard (motor difficulties, dyslexia, memory) have to enter the same details by hand, which is unnecessary effort but not a block.
- **How to fix:** add `autocomplete="name"` to both name inputs, `autocomplete="tel"` to `#order-contact` and `autocomplete="email"` to `#contact-email`.

### 7b. No visual marker for required fields

- **Samuel states:** required fields have the `required` attribute but nothing visible says so.
- **Verdict: holds.** Screen readers announce "required", but sighted users only find out after a failed submit. This is WCAG 3.3.2 Labels or Instructions (Level A).
- **Rating: Recommendation becomes Moderate, at the low end.**
- **How to fix:** add one line above each form and a hidden-from-readers asterisk on required labels.

```html
<p class="section-intro">Fields marked * are required.</p>
<label for="order-name">Name: <span aria-hidden="true">*</span></label>
```

Required fields are Item, Name, Phone and Type in the order form, and Name, Email and Message in the contact form.

### 7c. WhatsApp and email are plain text

- **Samuel states:** the contact details in the About section cannot be tapped.
- **Verdict: true, but not a WCAG failure** (`index.html` lines 225 to 226). It is a usability gap.
- **Rating: Recommendation, agree.**
- **How to fix:** `<a href="https://wa.me/233551000000">0551 000 000</a>` and `<a href="mailto:thecornerloaf@email.com">thecornerloaf@email.com</a>`.

## Suggested order of fixes

1. **Significant:** finding 2 (text cut off), then 3a (input focus). Re-check 3b while you are in the CSS.
2. **Moderate:** 1 (row headers), 3c, 4b, 6a, 6b, 7a, 7b.
3. **Recommendation:** 5a, 5b, 7c, and 4a if there is time.
4. **Not fixing:** 5c, with the one-line reason above.

## Notes on the audit itself

- **Line numbers do not match the repo.** Samuel puts the table at `index.html` line 62 (it is at 106), `renderMenuTable()` at `script.js` lines 132 to 150 (158 to 181) and the focus CSS at `styles.css` lines 285 to 307 (329 to 333). Ask which version he audited.
- **Findings 4 to 7 each bundle two or three separate issues** under one rating, which blurs the ranking. They are split in this document.
- **Compared with the template,** the audit has no date and time tested, and each finding lacks its own reproduction steps, evidence, "found by" and "why it ranks here". The manual test table (M1 to M11) covers part of that.
