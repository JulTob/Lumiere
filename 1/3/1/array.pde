
float[] coswave; 

void setup() {
  size(200, 200);
  coswave = new float[width];
  for (int i = 0; i < width; i++) {
    float amount = map(i, 0, width, 0, PI);
    coswave[i] = abs(cos(amount));
  }
  background(255);
  noLoop();
}

void draw() {

  for (int i = 0; i < width; i++) {
    stroke(coswave[i]*255);
    line(i, 0  , i, height);
  }

  
  
}
