# Tadabor: Quran web App [tadabor.surge.sh](http://tadabor.surge.sh/)

This project is a web App that allows you to browse through the Quran and write your notes/reflections below the verses, everything will be saved in your browser.

# For a desktop version check [tadabor-desktop](https://github.com/EnlightenCode/tadabor-desktop) repo.

## Table of contents

- [How to use](#How-to-use)
- [Contributing](#Contributing)
- [Known bugs](#Known-bugs)
- [TODO List](#TODO-List)
- [Credits](#Credits)
- [Local use](#Local-use)
- [Future project](#Future-project)

## How to use

Simply go to [tadabor.surge.sh](http://tadabor.surge.sh/) and check Quran Browser on the home page, you can click the button next to any verse to open a form where you can enter your text, once you are done writing you can press the save button, all the data will be saved on your browser app and clearing your cache might erase the data you have saved.

## Contributing

You are welcome to do a PR or open an issue for requesting new features or reporting a bug.

## Known bugs

- ~~When loading the website for the first time it might take time to load and sometimes you might need to do multiple refreshes.~~ (Fixed in [fc87012](https://github.com/EnlightenCode/tadabor/commit/c0ba1c32c53fbf83fd4b60827df7744e5ad2a43a) ?)

## TODO List

- Add more searching methods (Tashkeel, multiple Surahs search... etc). (Partially implemented)
- Add unit tests or similar to assure that everything works as expected.
- Revamp the interface for a better user experience.
- Document code and improve readability when possible.
- Document all the features and how they can be used.

## Credits

- **The creator of the universe for all his favors that if I tried to count I would never be able to number them**
- [quran-json](https://github.com/risan/quran-json) project for the compilation of chapter names and their transliteration
- Tanzil project for the Quran text compilation ( Check the bottom of [quran-simple-plain.txt](https://raw.githubusercontent.com/EnlightenCode/tadabor/master/public/res/quran-simple-plain.txt) )
- Computer Research Center of Islamic Sciences (noorsoft.org) and Tanzil Project (tanzil.info) and Zekr Project (zekr.org) for the Quran roots compilation ( Check the bottom of [quran-root.txt](https://github.com/EnlightenCode/tadabor/blob/master/public/res/quran-root.txt) )

## Local use

Prerequisites:

- Node.js
- npm

Once you have satisfied the prerequisites, you can install and start the application. Clone the app, and from its directory run:

1. `npm install`
2. `npm start`

usually the domain to access the app will be http://localhost:3000/

## Future project:

Once this project is complete (all features implemented), it will be used as the basis for another project that aims to be a platform for collaborative translation and reflection on the Qur'an, the goal being to achieve an accurate understanding of the true message of the Qur'an By undoing all the semantic changes that have occurred over the centuries, no deadline has been set yet, and it all depends on God's.
