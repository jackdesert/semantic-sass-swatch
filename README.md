Semantic SASS Swatches
======================

http://semantic-sass-swatches.com


Develop
-----------

    git clone git@github.com/jackdesert/semantic-sass-swatches
    cd semantic-sass-swatches
    bundle
    bundle exec middleman server


Deploy
------




Backlog
-------

* Formatting/positioning of download link (only one? Or one near each color input?)
* Styling of Q&A header--- possible reuse of header__hr
* Improve readability of Q&A
* footer with contact email
* interaction design of hover/click functionality to display color
* register semantic-sass-swatch.com
* deploy (statically, please)
* get feedback from Elle
* user may add unlimited colors to swatch
* use a template to build the table (code readability)
* Flush out README so people know what this is
* Figure out why some shades have luminance values that don't match along the row
  - perhaps this is because we need a better checker to see if it's in RGB space
  - ask elle how to check if something is in RGB space
* Allow colors to be loaded from parameters, such that the comment
  in the downloaded sass file can be clicked and the same colors will autoload

Done
----

* user may enter colors
* converted from rails to middleman

