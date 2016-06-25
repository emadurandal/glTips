(function (){
  var canvas = document.querySelector("#webgl-canvas");
  var gl = glTips.getWebGL1Context(canvas);
  if (gl) {
    console.log("WebGL1 context was created successfully.");
  }
  gl.clearColor(0.8, 0.8, 1, 1);


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
      [fighterPosArray, fighterNormalArray, fighterTexcoordArray],
      [3, 3, 2]
    )

    gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attribLocationPosition, 3, gl.FLOAT, gl.FALSE, 32, 0)
    gl.vertexAttribPointer(attribLocationNormal, 3, gl.FLOAT, gl.FALSE, 32, 12)
    gl.vertexAttribPointer(attribLocationTexcoord, 2, gl.FLOAT, gl.FALSE, 32, 24)

    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    g_ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g_ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(fighterIndexArray), gl.STATIC_DRAW);
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


    gl.useProgram(shaderProgram);
  }

  var rotation = 0.0;
  function initMatrix() {
    var viewMat = mat4.create();
    mat4.lookAt(viewMat, vec3.fromValues(0, 0, 7), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

    var worldMat = mat4.create();
    mat4.rotateY(worldMat, worldMat, rotation);
    rotation += 0.02;

    var projMat = mat4.create();
    mat4.perspective(projMat, Math.PI / 4, 1, 1, 1000);

    var pvwMat = mat4.create();
    mat4.mul(pvwMat, viewMat, worldMat);
    mat4.mul(pvwMat, projMat, pvwMat);

    uniformLocationPVWMatrix = gl.getUniformLocation(shaderProgram, 'uPVWMatrix');
    gl.uniformMatrix4fv(uniformLocationPVWMatrix, false, pvwMat);
    uniformLocationWMatrix = gl.getUniformLocation(shaderProgram, 'uWMatrix');
    gl.uniformMatrix4fv(uniformLocationWMatrix, false, worldMat);
  }

  function render(){
    gl.enable(gl.DEPTH_TEST);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    initMatrix();

    gl.drawElements(gl.TRIANGLES, fighterIndexArray.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame( render );

  }

  // glTips();

  initShader();
  initVertexBuffers();
  glTips.setupTexture2DSimple(gl, "../assets/fighter.png", gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE, gl.LINEAR, gl.CLAMP_TO_EDGE, true,
    function(){
      var uniformTextureSampler_0 = gl.getUniformLocation(shaderProgram, 'uTexture');
      gl.uniform1i(uniformTextureSampler_0, 0);

      render();
    }.bind(this));
})();
