// CMPT 361 Assignment 2: Stanford Bunny
// Ionwyn Sean || isean || 301267286

let gl;
let canvas;
let program;
let points = [];
let indices = [];
let bunny = [];
let angle = 0;
let copy_angle = 0;
let rotation1;
let rotation2;
let scale1;
let trans1;
let trans2;
let p_x = 0;
let copy_lx = 0;
let p_y = 0;
let stop_light_rotating = false;
let stop_light_panning = false;

let status;

window.onload = function init() {
  rotation1 = document.getElementById("rotation1");
  rotation2 = document.getElementById("rotation2");
  scale1 = document.getElementById("scale1");
  trans1 = document.getElementById("trans1");
  trans2 = document.getElementById("trans2");
  status = document.getElementById("status");

  canvas = document.getElementById("gl-canvas");
  canvas.focus();
  let drag = false;
  let dragStart;
  let dragEnd;

  canvas.addEventListener("wheel", ({ deltaY }) => {
    if (deltaY < 0) {
      document.getElementById("scale1").value += 0.05;
    }
    if (deltaY > 0) {
      document.getElementById("scale1").value -= 0.05;
    }
  });

  canvas.addEventListener("mousedown", ({ which, pageX, pageY }) => {
    switch (which) {
      case 1:
        dragStart = {
          x: pageX,
          y: pageY
        };

        drag = true;

        break;

      case 3:
        dragStart = {
          x: pageX,
          y: pageY
        };

        drag = true;

        break;
    }
  });
  canvas.addEventListener("mousemove", ({ which, clientX, clientY }) => {
    switch (which) {
      case 1:
        // get mouse position with respect to canvas
        p_x = (2 * clientX) / canvas.width - 1;
        p_y = (2 * (canvas.height - clientY)) / canvas.height - 1;
        if (drag) {
          dragEnd = {
            x: p_x,
            y: p_y
          };
          document.getElementById("trans1").value = p_x.toFixed(2);
          document.getElementById("trans2").value = p_y.toFixed(2);
          dragStart = dragEnd;
        }
        break;
      case 3:
        p_x = (2 * clientX) / canvas.width - 1;
        p_y = (2 * (canvas.height - clientY)) / canvas.height - 1;

        if (drag) {
          dragEnd = {
            x: p_x * 180,
            y: p_y * 180
          };
          document.getElementById("rotation1").value = dragEnd.x.toFixed(2);
          document.getElementById("rotation2").value = dragEnd.y.toFixed(2);
          dragStart = dragEnd;
        }

        break;
    }
  });

  canvas.addEventListener("mouseup", event => {
    drag = false;
  });

  window.addEventListener("keypress", ({ which }) => {
    switch (which) {
      case 114:
        document.getElementById("rotation1").value = 0;
        document.getElementById("rotation2").value = 0;
        document.getElementById("scale1").value = 0.25;
        document.getElementById("trans1").value = 0;
        document.getElementById("trans2").value = 0;

        break;

      case 112:
        // One clever way to keep switching is to use XOR operator!
        stop_light_rotating ^= true;
        copy_angle = angle;
        break;

      case 115:
        // One clever way to keep switching is to use XOR operator!
        stop_light_panning ^= true;
        copy_lx = p_x;

        break;
    }
  });

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.478, 0.472, 0.4703, 1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  // Set points from "bunny.js"
  indices = get_faces();
  points = get_vertices();

  for (var i = 0; i < indices.length; i++) {
    for (var j = 0; j < 3; j++) {
      bunny.push(points[indices[i][j] - 1]);
    }
  }

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  const normBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(bunny), gl.STATIC_DRAW);

  const vertexNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vertexNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexNormal);

  const vertexPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  window.requestAnimationFrame(render);
};

// Utility function.  Brilliant idea obtained from: https://kitware.github.io/vtk-js/api/Rendering_OpenGL_ShaderProgram.html
function setUniform3f(prog, name, x, y, z) {
  const position = gl.getUniformLocation(prog, name);
  gl.uniform3f(position, x, y, z);
}

function render() {
  if (stop_light_rotating) {
    angle = copy_angle;
  } else {
    angle += 0.1;
  }

  if (stop_light_panning) {
    p_x = copy_lx;
  } else {
    p_x += 0.25;
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const rotate1 = rotateX(rotation1.value);
  const rotate2 = rotateY(rotation2.value);
  const s1 = scalem(scale1.value, scale1.value, scale1.value);
  const trans = translate(trans1.value, trans2.value, 0);

  const mat = mult(trans, mult(s1, mult(rotate2, rotate1)));

  const position = gl.getUniformLocation(program, "mat");
  gl.uniformMatrix4fv(position, false, flatten(mat));

  const rotationSpeedConstant = 10;

  // x = cos(angle in rad)
  const x = Math.cos((Math.PI * angle * rotationSpeedConstant) / 180.0);
  // y = sin(angle in rad)
  const y = Math.sin((Math.PI * angle * rotationSpeedConstant) / 180.0);

  const gx = Math.cos((Math.PI * p_x * rotationSpeedConstant) / 180.0);
  // Set uniforms
  setUniform3f(program, "panning_spotlightDir", gx, p_y, 3.0);
  setUniform3f(program, "lightDir", x, y, 0.0);
  setUniform3f(program, "lightColorMat", 1, 1, 0);
  setUniform3f(program, "lightColor", 0.913, 0.826, 0.216);
  setUniform3f(program, "ambientColor", 0.113, 0.126, 0.216);
  setUniform3f(program, "surfaceSpec", 0.2, 0.2, 0.2);
  setUniform3f(program, "surfaceSpecMat", 0.8, 0.8, 0.8);
  setUniform3f(program, "surfaceDiffuse", 0.4, 0.3, 0.4);

  gl.bufferData(gl.ARRAY_BUFFER, flatten(bunny), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLES, 0, bunny.length);
  window.requestAnimationFrame(render);
}
