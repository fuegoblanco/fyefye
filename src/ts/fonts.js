/** @format */

export default class FontsTool {
  static loadFont(name, path) {
    const newFont = new FontFace(name, `url("${path}")`);
    newFont
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
