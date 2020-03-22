/*
 * Clara Del Valle
 * Costa Rica
 * 2020
 */

let magic = window.magic || {};

magic.main = (function (gg){

    let scene,
        camera,
        renderer,
        planeGeometry,
        planeMesh,
        axesHelper,
        controls;

        
    let SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
        aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    /*
     * Generates a mesh using the provided Geometry and FragmentShaderName
     */
    function renderPlaneMeshWithShaderMaterial(fragmentShaderName){
        planeGeometry = new THREE.PlaneGeometry( 1, 1);
        planeMesh = new THREE.Mesh( planeGeometry, shaderMaterial );
        planeMesh.scale.set(2, 2, 2);
        scene.add( planeMesh );
    }

    /*
     * Set up and show Javascript Performance Monitor
     */
    function showStats(){
        stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
    }

    /*
     *
     */
    function showAxesHelper(){
        axesHelper = new THREE.AxesHelper( 5 );
        scene.add( axesHelper );
    }

    /*
     * Sets basic 3D Scene Elements
     */
    function initScene(){
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

        renderer = new THREE.WebGLRenderer( );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0xFFFFFF, 1 );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        document.body.appendChild( renderer.domElement );

        controls = new THREE.OrbitControls( camera, renderer.domElement );

        //controls.update() must be called after any manual changes to the camera's transform
        camera.position.set( 0, 20, 10 );
        controls.update();

        window.addEventListener( 'resize', onWindowResize, false );
     }

    /*
     * Handles window resize events
     */
    function onWindowResize(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
                
        camera.aspect = 0.5 * aspect;
        camera.updateProjectionMatrix();

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    }

    /**
     * Updates objects on each frame
     */
    function animate(nowMsec){
        requestAnimationFrame( animate );

        stats.begin();
        
        controls.update();

        renderer.render( scene, camera );

        stats.end();
    }

    /** 
     * Init all functions
     */
    showStats();
    initScene();
    showAxesHelper();
    animate();

}(magic));