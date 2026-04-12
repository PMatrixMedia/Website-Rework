const increment = 0.1;

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case "KeyA":
      decSpeed();
      break;
    case "KeyS":
      incSpeed();
      break;
    case "KeyD":
      twoXSpeed();
      break;
    case "KeyQ":
      halfSpeed();
      break;
    case "KeyW":
      doubleSpeed();
      break;
    case "KeyE":
      threeXSpeed();
      break;
    case "KeyR":
      normalSpeed();
      break;
    default:
      break;
  }
});


function decSpeed() {
  var a = document.querySelector('video').playbackRate - increment;
  if (a < 0.1) {
    document.querySelector('video').playbackRate = 0.1;
  } else {
    document.querySelector('video').playbackRate = a;
  }
}

function halfSpeed() {
  var a = document.querySelector('video').playbackRate / 2;
  if (a < 0.1) {
    document.querySelector('video').playbackRate = 0.1;
  } else {
    document.querySelector('video').playbackRate = a;
  }
}
function doubleSpeed() {
  var a = document.querySelector('video').playbackRate * 2;
  if (a > 16) {
    document.querySelector('video').playbackRate = 16;
  } else {
    document.querySelector('video').playbackRate = a;
  }
}

function normalSpeed() {
  document.querySelector('video').playbackRate = 1;
}

function twoXSpeed() {
  document.querySelector('video').playbackRate = 2;
}

function threeXSpeed() {
  document.querySelector('video').playbackRate = 3;
}

function incSpeed() {
  var b = document.querySelector('video').playbackRate + increment;
  if (b > 16) {
    document.querySelector('video').playbackRate = 16;
  } else {
    document.querySelector('video').playbackRate = b;
  }
}
