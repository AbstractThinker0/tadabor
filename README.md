# Tadabor: Quran web App [tadabor.surge.sh](http://tadabor.surge.sh/)

This project is a web App that allows you to browse the Quran and write your notes/reflections below the verses, everything will be saved in your browser.

# For a desktop version check [github.com/AbstractThinker0/tadabor-desktop](https://github.com/AbstractThinker0/tadabor-desktop)

## Table of contents

- [How to use](#How-to-use)
- [Contributing](#Contributing)
- [Disclaimer](#Disclaimer)
- [Known bugs](#Known-bugs)
- [TODO List](#TODO-List)
- [Credits](#Credits)
- [Local use](#Local-use)
- [Future project](#Future-project)

## How to use

Simply go to [tadabor.surge.sh](http://tadabor.surge.sh/) and check Quran Browser on the home page, you can click the button next to any verse to open a form where you can enter your text, once you are done writing you can press the save button, all the data will be saved on your browser app and clearing your cache might erase the data you have saved.

## Contributing

You are welcome to do a PR or open an issue for requesting new features or reporting a bug.

## Disclaimer

The app is in beta, which means you may encounter occasional bugs. We strongly recommend keeping a backup of any data you save while using the app. Your data is stored locally on your machine and is never transmitted or stored on a remote database. However, it's always a good practice to have a backup. Please be aware that the accuracy of the Quran roots/stems list has not been verified, and the completeness of search results based on sentences/roots has not been extensively tested.

## Known bugs

- None.

## TODO List

- Add more searching methods (Tashkeel, multiple Surahs search... etc.). (Partially implemented)
- Add a settings menu that allows the users to choose font size/colors... etc.
- Add unit tests or similar to make sure that everything works as expected.
- Revamp the interface for a better user experience (Also implement a Dark theme switch).
- Document code and improve readability when possible.
- Document all the features and how they can be used.

## Credits

- **The creator of the universe for all his favors that if I tried to count I would never be able to number them**
- [quran-json](https://github.com/risan/quran-json) project for the compilation of chapter names and their transliteration
- Tanzil project for the Quran text compilation
- Computer Research Center of Islamic Sciences (noorsoft.org), Tanzil Project (tanzil.info) and Zekr Project (zekr.org) for the Quran roots compilation

## Local use

Prerequisites:

- Node.js
- npm

Once you have satisfied the prerequisites, you can install and start the application. Clone the app, and from its directory run:

1. `npm install`
2. `npm start`

usually, the domain to access the app will be http://localhost:3000/

## Future project:

Once all features of this project are implemented, it will serve as the foundation for another project that aims to create a platform for collaborative translation and reflection upon the Quran. The ultimate goal is to achieve an accurate understanding of the true message of the Quran by undoing all the semantic changes that have occurred over the centuries. There is currently no set deadline, and it all depends on God's will.
