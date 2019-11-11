<img align="center" width="64" src="reaser/icon/reaser.svg"> **Reaser** | *Remove a search*

## Goal
Reaser is a WebExtensions addon to remove search URLs from your browser history.\
Think of everytime you perform a search within a webpage: you get a list of results, you visit some of them, and over time your history gets cluttered with many URLs that point to the search page, not only to the results. Reaser removes those URLs, all without user intervention.

## How
Reaser clears the history on a tab basis: it tracks the search URLs and remove them when the user closes the tab, just in case he or she needs to return back to the previous pages.\
But there's a caveat: it doesn't exist a forced or standard way to define a searching form/input, so every website makes history for itself. Fortunately there are commonly used patterns that we can expect in order to detect when the user is performing a research. Regardless, false negatives are to be expected because of these unpredictable patterns.

## Icon
I'm no designer, I guess it's pretty obvious… So any pull requests for a better icon are very welcome. Thanks!

## License
[GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0.en.html).
