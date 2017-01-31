// Import CSS
require('normalize.css');
require('font-awesome/css/font-awesome.min.css');
require('app/main.scss');

var THREE = require('three');

var vertexShader = require('app/shader.vert'),
    fragmentShader = require('app/contours.frag');

var container;
var camera, scene, renderer;
var uniforms;
var PIXEL_RATIO = window.devicePixelRatio || 1;

init();
animate();

function init() {
    container = document.getElementById( 'scene' );

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_pixel_ratio: { type: "f", value: PIXEL_RATIO },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        extensions: {
          derivatives: true
        }
    } );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );

    container.appendChild( renderer.domElement );

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );

    document.onmousemove = function(e) {
      uniforms.u_mouse.value.x = e.pageX;
      uniforms.u_mouse.value.y = e.pageY;
    }
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    uniforms.u_time.value += 0.05;
    renderer.render( scene, camera );
}
