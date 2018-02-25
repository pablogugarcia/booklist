function internal(x) {
  return x + 2;
}

let p;
if (Math.random()) {
  p = import("./junk2");
} else {
  p = import("./junk3");
}
export default class Junk {
  foo(val) {
    return p.then(val => internal(val));
  }
}
