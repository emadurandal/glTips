(function (){
  var gl = null;
  var canvas = null;
  function initWebGL() {
    canvas = document.querySelector("#webgl-canvas");
    canvas.width = 1200;
    canvas.height = 800;
    gl = glTips.getWebGL1Context(canvas);
    if (gl) {
      console.log("WebGL1 context was created successfully.");
    }
    gl.clearColor(0.8, 0.8, 1, 1);
    gl.enable(gl.DEPTH_TEST);
  }

  initWebGL();

  var INSTANCE_NUMBER = 50000;
  var X_ARRANGE_NUMBER = 10;
  var shaderProgram = null;
  var attribLocationPosition = null;
  var attribLocationNormal = null;
  var attribLocationTexcoord = null;

  function initVertexBuffers()
  {
    // create VBO
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // convert separeted vertex attribute arrays to a interleaved array
    var typedArray = glTips.makeVerticesDataInterleaved(gl.FLOAT,
      [cubePosArray, cubeNormalArray, cubeTexcoordArray],
      [3, 3, 2]
    )

    gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attribLocationPosition, 3, gl.FLOAT, gl.FALSE, 32, 0)
    gl.vertexAttribPointer(attribLocationNormal, 3, gl.FLOAT, gl.FALSE, 32, 12)
    gl.vertexAttribPointer(attribLocationTexcoord, 2, gl.FLOAT, gl.FALSE, 32, 24)

    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndexArray), gl.STATIC_DRAW);
  }

  function initShader() {
    var vertShaderText = document.querySelector("#shader-vs").textContent;
    var fragShaderText = document.querySelector("#shader-fs").textContent;
    shaderProgram = glTips.setupShaderProgramFromSource(gl, vertShaderText, fragShaderText);

    attribLocationPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(attribLocationPosition);
    attribLocationNormal = gl.getAttribLocation(shaderProgram, "aNormal");
    gl.enableVertexAttribArray(attribLocationNormal);
    attribLocationTexcoord = gl.getAttribLocation(shaderProgram, "aTexcoord");
    gl.enableVertexAttribArray(attribLocationTexcoord);

    uniformLocationPVWMatrix = gl.getUniformLocation(shaderProgram, 'uPVWMatrix');
    uniformLocationWMatrix = gl.getUniformLocation(shaderProgram, 'uWMatrix');

    gl.useProgram(shaderProgram);
  }

  var rotation = 0;
  var viewMat = mat4.create();
  var projMat = mat4.create();
  var unitLength = 4.5;

  mat4.lookAt(viewMat, vec3.fromValues(unitLength*X_ARRANGE_NUMBER/2-unitLength/2, 10, 35), vec3.fromValues(unitLength*X_ARRANGE_NUMBER/2-unitLength/2, 0, 0), vec3.fromValues(0, 1, 0));
  mat4.perspective(projMat, Math.PI / 4, canvas.width/canvas.height, 1, 50000);

  function initMatrix(instanceId) {

    var worldMat = mat4.create();
    mat4.translate(worldMat, worldMat, vec3.fromValues(unitLength*(instanceId%X_ARRANGE_NUMBER), 0, -unitLength*(instanceId/X_ARRANGE_NUMBER)));
    mat4.rotateY(worldMat, worldMat, rotation);

    var pvwMat = mat4.create();
    mat4.mul(pvwMat, viewMat, worldMat);
    mat4.mul(pvwMat, projMat, pvwMat);

    gl.uniformMatrix4fv(uniformLocationPVWMatrix, false, pvwMat);
    gl.uniformMatrix4fv(uniformLocationWMatrix, false, worldMat);
  }

  var rS = new rStats();
  function render(){
    rS( 'FPS' ).frame();

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (var i=0; i<INSTANCE_NUMBER; i++) {
      initMatrix(i);
      gl.drawElements(gl.TRIANGLES, cubeIndexArray.length, gl.UNSIGNED_SHORT, 0);
    }
    rotation += 0.02;

    rS().update();

    requestAnimationFrame( render );

  }

  // glTips();
  initShader();
  initVertexBuffers();
  glTips.setupTexture2DSimple(gl, "../assets/uv_test.png", gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE, gl.LINEAR, gl.CLAMP_TO_EDGE, true,
    function(){
      var uniformTextureSampler_0 = gl.getUniformLocation(shaderProgram, 'uTexture');
      gl.uniform1i(uniformTextureSampler_0, 0);

      render();
    }.bind(this));
})();
