(function (){
  var gl = null;
  var canvas = null;
  var ext = null;
  function initWebGL() {
    canvas = document.querySelector("#webgl-canvas");
    canvas.width = 1200;
    canvas.height = 800;
    gl = glTips.getWebGL2Context(canvas);
    if (gl) {
      console.log("WebGL2 context was created successfully.");
    }
    gl.clearColor(0.8, 0.8, 1, 1);
    gl.enable(gl.DEPTH_TEST);

  }

  initWebGL();

  var INSTANCE_NUMBER = 10000;
  var textureSize = 128;
  var X_ARRANGE_NUMBER = 10;
  var shaderProgram = null;
  var attribLocationPosition = null;
  var attribLocationNormal = null;
  var attribLocationTexcoord = null;
  var attribLocationWorldMatrixRow1 = null;
  var attribLocationWorldMatrixRow2 = null;
  var attribLocationWorldMatrixRow3 = null;

  function initMeshBuffers()
  {
    // create VBO
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // convert separeted vertex attribute arrays to a interleaved array
    var typedArray = glTips.makeVerticesDataInterleaved(gl, gl.FLOAT,
      [cubePosArray, cubeNormalArray, cubeTexcoordArray],
      [3, 3, 2]
    )

    gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attribLocationPosition, 3, gl.FLOAT, gl.FALSE, 32, 0)
    gl.vertexAttribPointer(attribLocationNormal, 3, gl.FLOAT, gl.FALSE, 32, 12)
    gl.vertexAttribPointer(attribLocationTexcoord, 2, gl.FLOAT, gl.FALSE, 32, 24)
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // create Indexbuffer
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndexArray), gl.STATIC_DRAW);
  }

  var worldMatrixRow1Texture = null;
  var worldMatrixRow2Texture = null;
  var worldMatrixRow3Texture = null;
  var worldMatrixRow1TextureData = null;
  var worldMatrixRow2TextureData = null;
  var worldMatrixRow3TextureData = null;
  function initInstanceTextures()
  {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    // row1 texture
    worldMatrixRow1TextureData = new Float32Array(4*textureSize*textureSize);
    gl.activeTexture(gl.TEXTURE1);
    worldMatrixRow1Texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, worldMatrixRow1Texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, textureSize, textureSize, 0,
                      gl.RGBA, gl.FLOAT, worldMatrixRow1TextureData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var uniformTextureSampler_1 = gl.getUniformLocation(shaderProgram, 'uWorldMatrixRow1Texture');
    gl.uniform1i(uniformTextureSampler_1, 1);


    // row2 texture
    worldMatrixRow2TextureData = new Float32Array(4*textureSize*textureSize);
    gl.activeTexture(gl.TEXTURE2);
    worldMatrixRow2Texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, worldMatrixRow2Texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, textureSize, textureSize, 0,
                      gl.RGBA, gl.FLOAT, worldMatrixRow2TextureData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var uniformTextureSampler_2 = gl.getUniformLocation(shaderProgram, 'uWorldMatrixRow2Texture');
    gl.uniform1i(uniformTextureSampler_2, 2);

    // row3 texture
    worldMatrixRow3TextureData = new Float32Array(4*textureSize*textureSize);
    gl.activeTexture(gl.TEXTURE3);
    worldMatrixRow3Texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, worldMatrixRow3Texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, textureSize, textureSize, 0,
                      gl.RGBA, gl.FLOAT, worldMatrixRow3TextureData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var uniformTextureSampler_3 = gl.getUniformLocation(shaderProgram, 'uWorldMatrixRow3Texture');
    gl.uniform1i(uniformTextureSampler_3, 3);
  }

  function initShader() {
    var vertShaderText = document.querySelector("#shader-vs").textContent;
    var fragShaderText = document.querySelector("#shader-fs").textContent;
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, glTips.compileShader(gl, gl.VERTEX_SHADER, vertShaderText));
    gl.attachShader(shaderProgram, glTips.compileShader(gl, gl.FRAGMENT_SHADER, fragShaderText));

    gl.bindAttribLocation(shaderProgram, 0, 'aPosition');
    attribLocationPosition = 0;
    gl.enableVertexAttribArray(attribLocationPosition);
    gl.bindAttribLocation(shaderProgram, 1, 'aNormal');
    attribLocationNormal = 1;
    gl.enableVertexAttribArray(attribLocationNormal);
    gl.bindAttribLocation(shaderProgram, 2, 'aTexcoord');
    attribLocationTexcoord = 2;
    gl.enableVertexAttribArray(attribLocationTexcoord);

    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

  }

  var rotation = 0;
  var viewMat = mat4.create();
  var projMat = mat4.create();
  var unitLength = 4.5;

  function initMatrix() {

    mat4.lookAt(viewMat, vec3.fromValues(unitLength*X_ARRANGE_NUMBER/2-unitLength/2, 10, 35), vec3.fromValues(unitLength*X_ARRANGE_NUMBER/2-unitLength/2, 0, 0), vec3.fromValues(0, 1, 0));
    mat4.perspective(projMat, Math.PI / 4, canvas.width/canvas.height, 1, 50000);

    uniformLocationPMatrix = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    gl.uniformMatrix4fv(uniformLocationPMatrix, false, projMat);
    uniformLocationVMatrix = gl.getUniformLocation(shaderProgram, 'uVMatrix');
    gl.uniformMatrix4fv(uniformLocationVMatrix, false, viewMat);
  }

  function updateWorldMatrix() {

    for (var i=0; i<INSTANCE_NUMBER; i++) {
      var worldMat = mat4.create();
      mat4.translate(worldMat, worldMat, vec3.fromValues(unitLength*(i%X_ARRANGE_NUMBER), 0, -unitLength*(i/X_ARRANGE_NUMBER)));
      mat4.rotateY(worldMat, worldMat, rotation);
      mat4.transpose(worldMat, worldMat);

      for (var j=0; j<4; j++) {
        worldMatrixRow1TextureData[i*4+j] = worldMat[j+4*0];
        worldMatrixRow2TextureData[i*4+j] = worldMat[j+4*1];
        worldMatrixRow3TextureData[i*4+j] = worldMat[j+4*2];
      }

    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, worldMatrixRow1Texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, textureSize, textureSize, gl.RGBA, gl.FLOAT, worldMatrixRow1TextureData);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, worldMatrixRow2Texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, textureSize, textureSize, gl.RGBA, gl.FLOAT, worldMatrixRow2TextureData);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, worldMatrixRow3Texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, textureSize, textureSize, gl.RGBA, gl.FLOAT, worldMatrixRow3TextureData);

  }

  var rS = new rStats();
  function render(){
    rS( 'FPS' ).frame();

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateWorldMatrix();
    gl.drawElementsInstanced(gl.TRIANGLES, cubeIndexArray.length, gl.UNSIGNED_SHORT, 0, INSTANCE_NUMBER);
    rotation += 0.02;

    rS().update();

    requestAnimationFrame( render );

  }

  // glTips();
  initShader();
  initMeshBuffers();
  initInstanceTextures();
  initMatrix();

  gl.activeTexture(gl.TEXTURE0);
  glTips.setupTexture2DSimple(gl, "../assets/uv_test.png", gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE, gl.LINEAR, gl.CLAMP_TO_EDGE, true,
    function(){
      var uniformTextureSampler_0 = gl.getUniformLocation(shaderProgram, 'uTexture');
      gl.uniform1i(uniformTextureSampler_0, 0);

      render();
    }.bind(this));
})();
