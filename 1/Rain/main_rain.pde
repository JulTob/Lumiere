// Rain Effect
Drop d;  // one drop
Drop[] rain = new Drop[300];


void setup(){
  size(1500, 1000);
  d = new Drop();
  for(int i=0; i<rain.length ; ++i){
    rain[i] = new Drop();
  };
};

void draw(){
  background(10,10,90);
  d.fall();
  d.show();
  for(int i=0; i<rain.length ; ++i){
    rain[i].fall();
    rain[i].show();
  };
};

