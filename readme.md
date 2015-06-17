#GuitarLib

##Types##

* `Guitar` _Models a guitar, its strings, the tuning, and the available frets. Everything builds off of this class_
* `GuitarString` *Models single guitar string and how its tuned*
* `Strum`
  * `GuitarStrum`
  * `TabStrum` implements `ITabPart` _Used by `TabDocument`_
* `TabDocument`
* **abstract** `Scale`
  * `MajorScale` _models the Major Scale for the given `Guitar`_

###UI

* `BaseUI`
  * `ChordView`
  * `GuitarNeck`
  * `TabView`
    * `TabEditor`


##Build

1. Ensure Environment is setup.
2. run `gulp` in project directory


###Environment Setup

1. install node
2. install gulp
2. Open command window in project directory
3. Run `npm install typescript-require gulp-sourcemaps  typescript  through2 gulp-rename `
4. run `npm install tsify browserify`
4. Run `npm install vinyl-source-stream vinyl-buffer vinyl-transform`
5. run `npm install del globby glob`
