## Three things a customer must learn within 5 seconds of opening the website

- The bakery name and location - "The Corner Loaf is a small neighbourhood bakery on Boundary Road in East Legon, Accra."
- Whether the bakery is open or closed - "people increasingly check the website on their phones, mid-walk, to decide whether it is worth stopping in today."
- The items available today - "Regulars have mentioned they cannot quickly tell what is actually available that day", "Marcus suspects he is losing quick morning walk-by traffic to people who give up scrolling and just keep walking", "people increasingly check the website on their phones, mid-walk, to decide whether it is worth stopping in today."

## Issues found on exiting website

- The main content of the website wasn't responsive due to the fact that fixed values were used, that is the units were in pixels instead of using relative units like rems or percentages. Hence this made viewing the website no mobile inconvenient with the user having to zoom in.
- The website also had a broken navigation bar, none of the links in the navigation bar worked due to having a # in the href of the anchor element which lead nowhere.
- The website also skips headings which is bad for accessibility, most users that rely on assistive technologies like screen readers depend on the order of the headings to know the page layout or to build a table of contents so skipping headings affects the way this screen readers navigate the website.
- Then there was also the contact section which was out of sync with the rest of the layout in terms of it's positioning, which was mainly caused by the contact section not being included in the parent container that had a class of wrapper.
- There was also the submit buttons of the forms that didn't work which was mainly due to the website having no javascript.
- The website did not use any semantic elements just divs which do not give any meaning to assistive technolgy or the website in general, since div's do not have any semantic meaning unlike headers, footers, main, aside etc that give semantic meaning.


## Additional improvement beyond what the brief asked for

With the additional improvement I went with an order form so that customers can place orders for items available today and they can can and pick them up during the day or a few minutes/hours after placing them. Which should help marcus get more customers since most of his customers are regulars who walk past every morning they can place the orders before going to the shop during their walk to pick up the order, and same for people coming from further away they can also place the order so that by the time they come to the shop the items have not been sold out.


## Short written audit of finished website

For starters I used semantic html in the codebase replacing the existing divs sprinkled all over the code, the html now has a header, footer, main and sections. I also made sure not skip any headings, making sure the page followed a chronological order. I had some images too in the code so I made sure the images had an alt tag, and also reserved space for images to prevent the page content jumping around hence ensuring a good cumulative layout shift score (0 when tested in development). I also made sure to optimize the images so that they don't take a long time to load which also gave a good largest contentful paint score (0.30s when tested in development). Then with the pre-order FAQ section I replaced the faq-trigger div's with buttons to make them keyboard focusable. The table for the this weeks bakes section too I made sure it's given a min width so that the content doesn't become squashed and also handled the overflow behaviour to make it scrollable if it exceeds the width of the viewport so that it doesn't shift the layout of the entire page. With the page styling too I made sure to create variables for the color's used, the font sizes, spacing, and width to ensure consistency across the page since only a defined set of variables are used. On the page too I made sure that key requirements/frustration of the client was tackled, so mainly wanted something that allowed users to see what's available today, which I did and it's one of the first things a user will notice when they visit the website and it's also visible on mobile without having to zoom in the page first. I also made sure there was good contrast between text and background with the lowest contrast across the entire website being a 5.4.
