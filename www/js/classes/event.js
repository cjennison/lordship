function Event(opts){

  this.text1 = opts.text1;
  this.text2 = opts.text2;
  this.title = opts.title;

}


function addNewEvent(container, event){
  /*
  for(var i = container.length; i > 0; i--){
    container[i-1] = container[i];
  }
  */
  container.push(event);
  //container.reverse();
}