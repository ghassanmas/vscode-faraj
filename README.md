# vscode-faraj README


This an expirmental/personal, vscode extension, you can use at your own risk, so far it has the following features:


- Translate selected text to Arabic or English.


## Installation/Rquirments

- clone the repo
- install vsc `npm install -g @vscode/vsce`
- Create pacakge `vsce package` (should be alreay in repo root)
    - outputs `vscode-faraj-0.0.2.vsix` file
- Install as file `code --install-extension vscode-faraj-0.0.2.vsix`

- Install and run [libratranslate](https://github.com/LibreTranslate/LibreTranslate)

### Configuration

`faraj.libratranslateHost` and `libratranslatePort`, according to where libratranslate is running. e.g `libratranslate --host 192.168.1.5 --port 5555`; Then `192.168.1.5`, and `5555` would crosspond to the host and port respectively.

`faraj.insertAfter` default `true`, if `false`, the selected text would be replaced with tranlsation.  I opted to make it on, because _I assume one mostly need to adjust translated text, would need to compare with orignal then_.

### Usage

Just select any text in any file, then open command pallet, search for, `Translate the selected...etc`.


### Limitaion

- Only translate to/from English, Arabic. Woiudl make it configurable if/when time allows. 

- Changing any setting or config, requires to restart VS code.


## Refs

- [Related ChatGPT coversation used while building this so far](https://chatgpt.com/share/685444a2-2d5c-8004-843f-93dd393f102b)
- [VScode extensions development docs](https://code.visualstudio.com/api) 
- The project was boostrapted via [`Yeoman`](https://yeoman.io/) and [`VS code Extension Generator`](https://www.npmjs.com/package/generator-code)


## License

MIT License

