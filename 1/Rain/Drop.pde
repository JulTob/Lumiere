class Drop {
  float x = random(width);
  float y = random(-550);
  float size = random(10);
  float speed = random(5);
  
  void fall(){
    y = y + speed;
    speed = speed + 0.01*size;
    if ( y >height){
      y = random(-360);
      speed = random(5);
      x = random(width);
    }
  }

  void show(){
    stroke( 200, 200, 255);
    line(x,y,x,y+size);
  }

}
