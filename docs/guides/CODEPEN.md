# Editable Demos in Codepen

## Description

Users will be able to click a button on each demo to open in codepen
to edit.  From there the user can edit, save or make other
modifications to the example.

## Why Codepen?

Codepen appears to be one the most stable and active online sandboxes.
It has less accessibility problems then some of the other tools.

## As a contributor, what do I need to know?

* [SVG images are served from a cache](#asset_cache)
* Images used in demos must use full paths
* [Adding new SVG images require a change to the asset cache](#asset_cache)
* Additional HTML template files are appended to your index file using
 `ng-template`. [See docs](https://docs.angularjs.org/api/ng/directive/script)

### <a name="asset_cache"></a> Asset Cache

SVG images are stored in an asset cache using `$templateCache`.

#### How does it work?

When the user clicks on the edit on codepen button, all files including
html, css, js, templates are used to create the new codepen.  An
additional script is also appended to the example to initialize the
cache.

#### How do I populate the cache?

* Make all changes necessary to add or update any svg images
* run `./scripts/build-asset-cache.sh | pbcopy` to add an object
  literal representing the file name and contents to your clipboard.
* paste object literal as `var assetMap = { ... }` in the
  [asset-cache.js](../app/asset-cache.js)
* update the CDN with the new script - TBD...
