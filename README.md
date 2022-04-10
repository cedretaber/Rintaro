# Rintaro

[![CI](https://github.com/cedretaber/Rintaro/actions/workflows/ci.yml/badge.svg)](https://github.com/cedretaber/Rintaro/actions/workflows/ci.yml)
[![Build](https://github.com/cedretaber/Rintaro/actions/workflows/build.yml/badge.svg)](https://github.com/cedretaber/Rintaro/actions/workflows/build.yml)

Support the creation of translation mods

## How to use

1. Select the base mod to be translated

For example, if you are playing Stellaris on Windows, you can find the mod in `path\to\SteamLibrary\steamapps\workshop\content\281990\`.
Check the mod number in the Steam Workshop or elsewhere.

2. (Optional) Adding an existing translated mod

If you already have a translated mod, you can import its translation.
Even if the versions do not match, only the keys that exist will be taken and applied, and nothing will be done to strings for which the keys do not exist.

3. Go to the Edit tab and translate the text while looking at the original text

Good luck.
Watch out for special strings that are replaced by icons etc.

4. If you want to interrupt, you can go back to the 'File' tab and save the file in JSON format

This JSON format file is proprietary to Rintaro. It cannot be loaded by the game, but it allows you to save your edits in progress.

5. When the translation is finished, check how the output looks in the 'Confirm' tab

It provides an overview with a look and feel similar to the original text file.

6. If everything is OK, export as a yml file using the export button on the 'File' tab

It is written out to the specified directory under the name `localisation`. There may also be a `localisation_synced` directory, but both are used.

7. Can be copied directly into your own mod file and then loaded directly into the game for use.

If you have not already created a Mod for yourself, use the game launcher to create a Mod for translation.
Inside that Mod's directory, copy the directory Rintaro has written out.

## How to develop

```bash
# Setup
$ npm install

# build
$ npm run build

# run in dev mode
$ npm start

# test
$ npm run test
$ npm run electron:test

# pack
$ npm run build:all
```