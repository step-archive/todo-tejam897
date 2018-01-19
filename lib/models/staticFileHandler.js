const fs = require('fs');
const DefaultHandler = require('./defaultHandler.js');
class StaticFileHandler extends DefaultHandler {
  constructor(root,fSystem=fs) {
    super()
    this.root = root;
    this.fs = fSystem;
  }
  getStaticFile(file){
    return `${this.root}${file}`;
  }
  execute(req,res){
    if (req.method!='GET') return;
    let filePath = this.getStaticFile(req.url);
    if(this.fs.existsSync(filePath)){
      return res.sendFile(filePath);
    }
  }
}
module.exports = StaticFileHandler;