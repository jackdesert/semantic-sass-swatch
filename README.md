Semantic SASS Swatch
====================

http://semantic-sass-swatch.com


Develop
-----------

    git clone git@github.com:jackdesert/semantic-sass-swatch
    cd semantic-sass-swatch
    bundle
    bundle exec middleman server


Deploy
------

    bundle exec middleman build && bundle exec middleman deploy


Feature Requests (not on the backlog)
-------------------------------------

* When an english color name is entered, show the hex code for it so they can nudge



Backlog
-------

* Improve space invaders joke
* CRLF if windows; else LF is fine
* Make sure download link is removed before each addition
* Eat our own dogfood
* Rearrange Q&A so that Q/A is a different color/saturation/shade
  instead of having the "Q" and "A", because the "Q" and "A" look
  so much like bullets that it distracts from the actual bullets
  inside the answers
* Styling of Q&A header--- possible reuse of header__hr
* Formatting/positioning of download link (only one? Or one near each color input?)
* Get download link to *open* in text editor, instead of only downloading
* Styling of footer---how about rotating the header__hr 180 degrees
  so that it has its toe pointed down on the right (instead ofup onthe left)
  and have source code and contact below that (on the left)
* interaction design of hover/click functionality to display color
* get feedback from Elle
* user may add unlimited colors to swatch
* use a template to build the table (code readability)
* Flush out README so people know what this is
* Allow colors to be loaded from parameters, such that the comment
  in the downloaded sass file can be clicked and the same colors will autoload
* Test in Chrome
* Test in Safari
* Test on Windows :(((((

Done
----

* user may enter colors
* converted from rails to middleman
* deploy (statically, please)
* register semantic-sass-swatch.com

