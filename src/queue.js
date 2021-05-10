class Queue{
  constructor() {
    this.front = null;
    this.rear = null;
    this.storage = [];
  }

  enqueue(item) {
    this.storage.push(item);
    if (this.storage.length === 1 ){
      this.front = item;
      this.rear = item;
    } else {
      this.rear = item;
    }
    return this;
  }

  dequeue() {
    if(!this.storage.length){
      return 'empty queue';
    }
    let user = this.storage.shift();
    // this.storage.shift();
    if(this.storage.length === 0){
      this.front = null;
      this.rear = null;
    } else {
      this.front = this.storage[0];
      this.rear = this.storage[this.storage.length - 1];
    }
    return user;
    // return this
  }

  peek() {
    if (this.storage.length === 0){
      return false;
    }
    return this.front;
  }

  isEmpty(){
    if (this.storage.length < 1) {
      return true;
    }
  }

}

module.exports = Queue;
