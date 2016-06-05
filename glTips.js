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

    if (!(gl instanceof WebGLRenderingContext)) {
       throw new Error("unexpected rendering context.");
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

// Exports ----------------------------------------------
  if ("process" in global) {
      module["exports"] = glTips;
  }

  global["glTips"] = glTips;

})((this || 0).self || global);
