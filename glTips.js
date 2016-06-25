/**
 * glTips - Useful, cherry-pickable, and CC0 (Public Domain like) licensed WebGL Routine Code Snippets.
 *
 * These codes are licensed under CC0.
 * http://creativecommons.org/publicdomain/zero/1.0/deed.ja
 */

(function(global) {
  "use strict";
// Class ------------------------------------------------
  function glTips() {

    // Globalization ----------------------------------------
    for(var key in glTips){
      global[key] = glTips[key];
    }
  }


// Header -----------------------------------------------

  glTips.getWebGL1Context = glTips_getWebGL1Context; // glTips#getWebGL1Context(canvas:HTMLCanvasElement):WebGLRenderingContext
  glTips.getWebGL2Context = glTips_getWebGL2Context; // glTips#getWebGL2Context(canvas:HTMLCanvasElement):WebGL2RenderingContext
  glTips.compileShader = glTips_compileShader; // glTips#compileShader(gl:WebGLRenderingContext, shaderType:[gl.VERTEX_SHADER|gl.FRAGMENT_SHADER], shaderText:string):WebGLShader
  glTips.setupShaderProgram = glTips_setupShaderProgram; // glTips#setupShaderProgram(gl:WebGLRenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader):WebGLShaderProgram
  glTips.setupShaderProgramFromSource = glTips_setupShaderProgramFromSource; // glTips#setupShaderProgramFromSource(gl, vertexShaderText:string, fragmentShaderText:string):WebGLShaderProgram
  glTips.setupTexture2D = glTips_setupTexture2D;// glTips#setupTexture2D(gl:WebGLRenderingContext, srcUri:string, level:number, internalFormat:number, format:number, type:number, magFileter:number, minFilter:number, wrapS:number, wrapT:number, mipmap:boolean, flipY:boolean, callback:Function)
  glTips.setupTexture2DSimple = glTips_setupTexture2DSimple; // glTips#setupTexture2DSimple(gl:WebGLRenderingContext, srcUri, internalFormat, format, type, filter, wrap, flipY, callback)
  glTips.makeVerticesDataInterleaved = glTips_makeVerticesDataInterleaved; // glTips#makeVerticesDataInterleaved(gl:WebGLRenderingContext, type:number, arrayOfAttributeDataArray:Array, componentArray:Array):TypedArray
// Implementation ---------------------------------------

  /**
   * Create a WebGL1 context.
   *
   * @param {HTMLCanvasElement} canvas. The canvas element.
   * @return {WebGLRenderingContext} The created context.
   * @memberOf module:glTips
   */
  function glTips_getWebGL1Context(canvas) {
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
       throw new Error("WebGL1 not supported");
    }

    return gl;
  }

  /**
   * Create a WebGL2 context.
   *
   * @param {HTMLCanvasElement} canvas. The canvas element.
   * @return {WebGL2RenderingContext} The created context.
   * @memberOf module:glTips
   */
  function glTips_getWebGL2Context(canvas) {
    var gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

    if (!gl) {
       throw new Error("WebGL2 not supported");
    }

    if (!(gl instanceof WebGL2RenderingContext)) {
      throw new Error("unexpected rendering context.");
    }
    return gl;
  }

  /**
   * Get a compiled shader object.
   *
   * @param {WebGLRenderingContext} gl. WebGL context
   * @param {string} shaderType. Shader Type [gl.VERTEX_SHADER|gl.FRAGMENT_SHADER]
   * @param {string} scriptDomId. A script DOM ID.
   * @return {WebGLShader} Compiled shader object.
   * @memberOf module:glTips
   */
  function glTips_compileShader(gl, shaderType, shaderText) {
    var shader = null;
    if (shaderType === gl.VERTEX_SHADER) {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (shaderType === gl.FRAGMENT_SHADER) {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else {
      throw new Error("Wrong shader type specified!");
    }

    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var errorLog = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new SyntaxError(errorLog);
    }

    return shader;
  }

  /**
   * Setup a linked shader program object from shader objects.
   *
   * @param {WebGLRenderingContext} gl. WebGL context
   * @param {WebGLShader} vertexShader. A vertex shader object.
   * @param {WebGLShader} fragmentShader. A fragment shader object.
   * @return {WebGLProgram} A linked shader program object.
   * @memberOf module:glTips
   */
  function glTips_setupShaderProgram(gl, vertexShader, fragmentShader) {
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      var errorLog = gl.getProgramInfoLog(shader);
      gl.deleteProgram(shaderProgram);
      throw new Error(errorLog);
    }

    return shaderProgram;
  }

  /**
   * Setup a linked shader program object from shader source texts.
   *
   * @param {WebGLRenderingContext} gl. WebGL context
   * @param {string} vertexShaderText. A vertex shader  source text.
   * @param {string} fragmentShaderText. A fragment shader source text.
   * @return {WebGLProgram} A linked shader program object.
   * @memberOf module:glTips
   */
  function glTips_setupShaderProgramFromSource(gl, vertexShaderText, fragmentShaderText) {
    var vertShader = glTips.compileShader(gl, gl.VERTEX_SHADER, vertexShaderText);
    var fragShader = glTips.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
    var shaderProgram = glTips.setupShaderProgram(gl, vertShader, fragShader);
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);

    return shaderProgram;
  }

  /**
   * Setup a texture.
   *
   * @param {WebGLRenderingContext} gl. WebGL context
   * @param {string} srcUri. Image source URI.
   * @param {number} level. Mipmap level.
   * @param {number} internalFormat. for example, gl.RGBA, gl.RGBA16F.
   * @param {number} format. format. for example, gl.RGBA.
   * @param {number} type. data type. for example, gl.UNSIGNED_BYTE.
   * @param {number} magFileter. for example, gl.LINEAR.
   * @param {number} minFileter. for example, gl.LINEAR.
   * @param {number} wrapS. for example, gl.CLAMP_TO_EDGE.
   * @param {number} wrapT. for example, gl.CLAMP_TO_EDGE.
   * @param {boolean} mipmap. generate Mipmap or not
   * @param {boolean} flipY. enable gl.UNPACK_FLIP_Y_WEBGL.
   * @param {Function} callback. callback called when setup is done.
   * @memberOf module:glTips
   */
  function glTips_setupTexture2D(gl, srcUri, level, internalFormat, format, type,
    magFileter, minFilter, wrapS, wrapT, mipmap, flipY, callback) {
    var img = new Image();
    img.onload = function() {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFileter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
      if (mipmap) {
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      callback(texture);
    };

    img.src = srcUri;
  }

  /**
  * Setup a texture (Simple Version).
  *
  * @param {WebGLRenderingContext} gl. WebGL context
  * @param {string} srcUri. Image source URI.
  * @param {number} internalFormat. for example, gl.RGBA, gl.RGBA16F.
  * @param {number} format. format. for example, gl.RGBA.
  * @param {number} type. data type. for example, gl.UNSIGNED_BYTE.
  * @param {number} fileter. for example, gl.LINEAR.
  * @param {number} wrap. for example, gl.CLAMP_TO_EDGE.
  * @param {boolean} flipY. enable gl.UNPACK_FLIP_Y_WEBGL.
  * @param {Function} callback. callback called when setup is done.
  * @memberOf module:glTips
  */
  function glTips_setupTexture2DSimple(gl, srcUri, internalFormat, format, type,
    filter, wrap, flipY, callback) {
      glTips.setupTexture2D(gl, srcUri, 0, internalFormat, format, type,
        filter, filter, wrap, wrap, true, flipY, callback);
  }

  /**
   * Convert separeted vertex attribute arrays to a interleaved array.
   *
   * @param {number} type. for example, gl.FLOAT
   * @param {Array} arrayOfAttributeDataArray. array of vertex attribute data array.
   * @param {Array} componentArray. array of component number of vertex attribute data array.
   * @return {TypedArray} a interleaved TypedArray object. for example, Float32Array.
   * @memberOf module:glTips
   */
  function glTips_makeVerticesDataInterleaved(type, arrayOfAttributeDataArray, componentArray) {
    var bufferSize = 0;
    for (var key in arrayOfAttributeDataArray) {
      bufferSize += arrayOfAttributeDataArray[key].length;
    }

    var componentSize = 0;
    for (var key in componentArray) {
      componentSize += componentArray[key];
    }

    var typedArray = null;
    if (type === 0x1406) { // gl.FLOAT
      typedArray = new Float32Array(bufferSize);
    }

    var offset = 0;
    var dataLengthAsVector = arrayOfAttributeDataArray[0].length / componentArray[0];
    for (var i=0; i<dataLengthAsVector; i++) {
      offset = 0;
      for (var j=0; j<componentArray.length; j++) {
        for (var k=0; k<componentArray[j]; k++) {
          typedArray[i*componentSize + offset + k] = arrayOfAttributeDataArray[j][i*componentArray[j]+k];
        }
        offset += componentArray[j];
      }
    }

    return typedArray;
  }

// Exports ----------------------------------------------
  if ("process" in global) {
      module["exports"] = glTips;
  }

  global["glTips"] = glTips;

})((this || 0).self || global);
