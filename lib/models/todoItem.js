class TodoItem{
  constructor(id,obj, done = false){
    this._itemId = id;
    this._objective = obj;
    this._done = done;
  }
  get itemId(){
    return this._itemId;
  }
  get objective(){
    return this._objective;
  }
  isDone(){
    return this._done;
  }
  changeStatus(){
    this._done = !this._done;
    return true;
  }
  changeObjective(newObjective){
    this._objective = newObjective;
    return true;
  }
}

module.exports = TodoItem;
