/*
 * Clara Del Valle
 * Costa Rica
 * 2020
 */

var magic = window.magic || {};

(function (){

    var scene,
        camera,
        meshes,
        colors,
        renderer,
        axesHelper,
        controls;
        SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
        aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    /**
     * Check hostname to verify Development Environment
     */    
    function developmentEnvironment() {
        return window.location.host != 'claradelvalle.com';
    }

    /**
     * Set up and show Javascript Performance Monitor
     */
    function showStats(){
        stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
    }

    /**
     * Show Axes Helpers for 3D
     */
    function showAxesHelper(){
        axesHelper = new THREE.AxesHelper( 5 );
        scene.add( axesHelper );
    }

    /**
     * Sets basic 3D Scene Elements
     */
    function initScene(){
        meshes = new Array();
        colors = new Array();
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        renderer = new THREE.WebGLRenderer( );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0xFFF0FF, 1 );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        document.body.appendChild( renderer.domElement );
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        //controls.update() must be called after any manual changes to the camera's transform
        camera.position.set( 0, 10, 4);
        controls.autoRotate = true;
        controls.update();

        colors = [
            '0, 0, 0',
            '255, 0, 0',
            '0, 255, 0',
            '0, 0, 255',
            '255, 255, 0',
            '255, 0, 255',
            '50, 230, 255',
            '0, 255, 255',
            '255, 50, 200'
        ];

        generateMeshAtRandomPosition();

        window.addEventListener( 'resize', onWindowResize, false );
        // window.addEventListener( 'click', generateMeshAtRandomPosition, false );
        window.addEventListener( 'touchstart', generateMeshAtRandomPosition, false );
     }


    /**
     * Click Event Handler
     * Generates a cube on a random position
     */
    function generateMeshAtRandomPosition(){
        var material = new THREE.MeshBasicMaterial( {color: getRandomColor()} ),
            mesh,
            geometry,
            randomValue = getRandomInt(0, 1) ;
        
        if(randomValue == 0){
            geometry = generateCubeGeometry();
        }
        else {
            geometry = generateSphereGeometry();
        }

        mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(getRandomArbitrary(-2,2), getRandomArbitrary(-2,2), getRandomArbitrary(-1,1));

        meshes.push(mesh);
        scene.add( mesh);
    }

    /**
     * Generates a cube
     */
    function generateCubeGeometry() {
        var cubeWidth = getRandomArbitrary(0,1),
        cubeHeight = getRandomArbitrary(0,1);
        cubeGeometry = new THREE.BoxGeometry( cubeWidth, cubeHeight, 1 );

        return cubeGeometry;
    }

    /**
     * Generates an sphere
     */
    function generateSphereGeometry(){
        var sphereRadius = getRandomArbitrary(0,1),
            sphereGeometry = new THREE.SphereBufferGeometry( sphereRadius, 32, 32 );

        return sphereGeometry;
    }

    /**
     * Returns random numbers for RGB color
     */
    function getRandomColor() {
        // return "rgb(" + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ")";
        let stringColor = "rgb(" + colors[getRandomInt(0, colors.length)] + ")";
        return stringColor;
    }

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
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

        if (developmentEnvironment()){
            stats.begin();
        }
        
        // rotateMeshes();

        controls.update();

        renderer.render( scene, camera );

        if (developmentEnvironment()){
            stats.end();
        }
    }

    /** 
     * Init all functions
     */
    initScene();

    if (developmentEnvironment()){
        showStats();
        showAxesHelper();
    }
    
    animate();

}(magic));
