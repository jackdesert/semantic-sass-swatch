Rationale
=========

Q: Why did this start as a rails app?
A: It was easy, and familiar. It also made it easy to keep several versions around.

Q: Why are you building this?
A: It's messy and time-consuming to guess how much to desaturate a color,
   either through decreasing chroma or adjusting lightness.
   And in the end, the goal is to have consistency.

Q: Why the middleman gem?
A: Wanted a convenient way to manage files and use SASS while still being able to deploy
   one html file, one stylesheet, one javascript file.

Q: Why haml?
A: It's familiar.

Q: Why is a table being built by concatenating strings in javascript?
A: It's in the backlog to start using a javascript templating engine like Handlebars
   to make that code cleaner.

Q: Why does it check for matching lightness (within 1 of target lightness)
   as a way of determining if the target color exists in RGB space?
A: There must be a more elegant way of checking if a color is valid in a color space,
   and an email has been sent to Ellen (Maker of Gimp-CCE) asking for help.

Q: Are you satisfied with the middleman gem?
A: It seems more intuitive than the staticmatic gem, which I have used in the past.
   It's great that it concatenates javascript and css files!
   However, the load time with the middleman gem is slow. (About 3 seconds)
   Also, documentation is poor. For example, why is sprockets not enabled by default?

Q: Why are there only two color swatches?
A: Ideally, the number of swatches is adjustable by the user. But
   the requisite interaction design has not been done for that feature.
   It's in the backlog! ;)

