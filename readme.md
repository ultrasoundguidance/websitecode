# SONAR
A theme for Ghost.
Designed by [a human online](https://ahuman.online), made for [Ultrasound Guidance](https://www.ultrasoundguidance.com).

## Customize Portal text
Please add this code to the "Code Injection" area of the admin dashboard:
```<script>
$(function() {
    const headerText='<div style="text-align:center;color:#3e0293;">Personal email is recommended</div>';
    window.addEventListener('hashchange', function() { if (location.hash.startsWith('#/portal')) {setTimeout(function(){$("#ghost-portal-root").find("iframe").contents().find(".gh-portal-content.signup .gh-portal-section").prepend(headerText)},200)}})
   setTimeout(function(){
       $("#ghost-portal-root").find("iframe").contents().find('.gh-portal-triggerbtn-container').click(function(){setTimeout(function(){$("#ghost-portal-root").find("iframe").contents().find(".gh-portal-content.signup .gh-portal-section").prepend(headerText);},200)})
   },200);
    });
</script>
```
