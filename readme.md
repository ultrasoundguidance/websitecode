# SONAR
A theme for Ghost.
Designed by [a human online](https://ahuman.online), made for [Ultrasound Guidance](https://www.ultrasoundguidance.com).

## Customize Portal text
Please add this code to the "Code Injection" area of the admin dashboard, under `Site Footer`:
```
<script>
$(function() {
    const headerText='<div style="text-align:center;color:#3e0293;">Personal email is recommended</div>';
    window.addEventListener('hashchange', function() { if (location.hash.startsWith('#/portal')) {setTimeout(function(){$("#ghost-portal-root").find("iframe").contents().find(".gh-portal-content.signup .gh-portal-section").prepend(headerText)},200)}})
   setTimeout(function(){
       $("#ghost-portal-root").find("iframe").contents().find('.gh-portal-triggerbtn-container').click(function(){setTimeout(function(){$("#ghost-portal-root").find("iframe").contents().find(".gh-portal-content.signup .gh-portal-section").prepend(headerText);},200)})
   },200);
    });
</script>
```

## Editing site copy
The copy that appears on the homepage is sourced from entries in Ghost. To edit the homepage copy, you should edit the entries.

The entries are labeled with internal tags. The octothorpe `#` in front of the title hides the tag from Ghost’s standard display, so it won’t appear in the list of tags on the `/videos/` page.

### Home page video
This entry is tagged `#homepage` and the title is “hero-video.” It is purely a Ghost entry. Since the template pulls the entire entry into the published page, it’s important that the only content be the Vimeo link to the appropriate video.

### Home page copy
This entry is tagged `#homepage`, and the title is “hero-copy.” This entry is an HTML card. If you click into the entry, it will expand into code.

```
<div>
   <p class="hero-headliner">Quality Education</p>
</div>
   <h2 class="hero-title">Ultrasound expertise<br class="hero-title-break" /> in the palm <span class="hero-alternate-color">of your hand</span></h2>
   <p class="hero-bodycopy">It’s time to level up your ultrasound skill set. Get the education you need any time you need it. Our videos work on any device, making it easy for you to learn at your own convenience.</p>
</div>
<div class="hero-button-container">
   <a href="#/portal/" class="hero-button-left">Join Now</a>
   <a href="https://www.ultrasoundguidance.com/plans/" class="hero-button-right">Learn more</a>
</div>
```

#### hero-headliner
`<p class="hero-headliner">Quality Education</p>`
This is the colored box above the main headline.
#### hero-title
```
<h2 class="hero-title">Ultrasound expertise<br class="hero-title-break" /> in the palm <span class="hero-alternate-color">of your hand</span></h2>
```
This is the main copy on the page. It’s broken into subclasses. 
- Any copy before `hero-title-break` will always remain on one line.
- Any copy inside `hero-alternate-color` will display as teal instead of purple.
#### hero-body copy
The primary descriptive text goes here. There are no special classes inside this segment.
#### hero-button-container
```
<div class="hero-button-container">
   <a href="#/portal/" class="hero-button-left">Join Now</a>
   <a href="https://www.ultrasoundguidance.com/plans/" class="hero-button-right">Learn more</a>
</div>
```
Inside the quotes in the `href` value are where the buttons will go. If you’re pointing to the signup page, like it is now, you can leave the target as `#/portal/`.

In order to point to another page, like the second button does, you can enter the page *slug* between slashes. For the Plans page, as above, the value inside `href` is `/plans/`. Ghost will automatically apply the rest of the web address when you save the post, you won’t have to enter `https://www.ultrasoundguidance.com/`.

The page slug can be found at the top-right of the details pane on any page or post.

### Feature callouts
This is the second segment on the page, between the hero copy/hero video section, and the price cards.

These are separate posts for each feature callout, and they are tagged `#homepage` and `#bullet-features`. The `#homepage` tag is more descriptive, but the `#bullet-features` tag is necessary for it to appear in the list.

There is a separate entry in Ghost for each feature callout. The purple header is the title of the entry. The body copy can be edited directly in Ghost, it’s simply pulling text.

The *Learn more* link at the bottom of each feature callout is an HTML card. Inside the card is the following code:
```
<a href="https://www.ultrasoundguidance.com/features/" aria-label="" class="lnk">Learn more</a>
```

I have built a custom snippet called “Bullet Feature” that you can use to make a new feature callout. Create a new post, give it the appropriate title (“Professional,” “Affordable,” etc.), and in the body of the post type `/bullet-feature` and press Enter.

Edit the copy as desired, and then make sure the page name in the link reflects the appropriate target by changing the bolded name below to the appropriate page slug.

`<a href="https://www.ultrasoundguidance.com/`**features**`/“ aria-label="" class="lnk">Learn more</a>`

You can either edit the feature callouts that are already there, if you want to keep it at 4, or you can delete, revert to draft, or add new posts with the `#bullet-features` tag to change the number of feature callouts.

### Benefits
The benefits are the text posting beneath the price in each of the price cards. As of deploy, there isn’t a helper to programmatically grab the benefits from the Membership pane in the dashboard. I have recreated that functionality using posts. When the API changes, and we can pull benefits directly in the template, I will change the theme accordingly.

The benefit posts are tagged `#benefits`. They are HTML cards, and they’re a little complicated.

```
<ul class="benefit-list">
<li class="benefit-item">
    <div class="mr-3"><svg class="w-4 h-4 text-tertiary-400" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2"><polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8"></polyline><circle cx="12" cy="12" fill="none" r="11" stroke="currentColor"></circle></svg>
</div>
<p class="benefit-text">
    <!-- BENEFIT STARTS -->    
    All MSK, nerve, spasticity, and basics videos as they are released
    <!-- BENEFIT ENDS -->
</p>
</li>
<li class="benefit-item">
    <div class="mr-3"><svg class="w-4 h-4 text-tertiary-400" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2"><polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8"></polyline><circle cx="12" cy="12" fill="none" r="11" stroke="currentColor"></circle></svg></div>
<p class="benefit-text">
    <!-- BENEFIT STARTS -->
    Early notification about new and upcoming features
    <!-- BENEFIT ENDS -->
</p>
</li>
</ul>
```

If you’re going to add a new benefit, you need to copy everything starting with `<li class="benefit-item"` and ending with `</li>`. This is the HTML for *list item*. Each separate benefit is a new list item inside the unordered list (`<ul>`).

The first big chunk that looks like gobbledygook is the code that powers the probe icon. You can safely ignore that, because it’s the same no matter what.

The important part is sandwiched between `<!-- BENEFIT STARTS -->` and `<!-- BENEFIT ENDS -->`. This is the actual display text, and it’s the only part that should change. The rest of the code inside this is all formatting or the mathematical instructions to build the probe icon.

So to add a new benefit to the list, you would copy the below code, and change what is bolded:
```
<li class="benefit-item">
    <div class="mr-3"><svg class="w-4 h-4 text-tertiary-400" viewBox="0 0 24 24" stroke-linecap="round" stroke-width="2"><polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8"></polyline><circle cx="12" cy="12" fill="none" r="11" stroke="currentColor"></circle></svg></div>
<p class="benefit-text">
    <!-- BENEFIT STARTS -->
```
**Early notification about new and upcoming features**
```
    <!-- BENEFIT ENDS -->
</p>
</li>
```