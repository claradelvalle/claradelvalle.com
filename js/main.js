/*
 * Clara Del Valle
 * Costa Rica
 * 2020
 */

let magic = window.magic || {};

(function (){

    let scene,
        camera,
        meshes,
        clock,
        renderer,
        controls,
        uniforms,
        axesHelper,
        SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
        aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    const colors = [
        {
            'color':'0, 0, 0',
            'name':'black'
        },
        {
            'color':'255, 0, 0',
            'name':'red'
        },
        {
            'color':'0, 255, 0',
            'name':'green'
        },
        {
            'color':'0, 0, 255',
            'name':'blue'
        },
        {
            'color':'255, 255, 0',
            'name':'yellow'
        },
        {
            'color':'255, 0, 255',
            'name':'purple'
        },
        {
            'color':'50, 230, 255',
            'name':'turquoise'
        },
        {
            'color':'150, 75, 0',
            'name':'brown'
        },
        {
            'color':'255, 50, 200',
            'name':'pink'
        }
    ];

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
     * Init all functions
     */
    function init(font) {
        // Verifies if app is running on a mobile device
        isMobile = false;

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            isMobile = true;
        }

        window.addEventListener( 'resize', onWindowResize, false );

        setScene();

        renderTextGeometry(font, 'Clara');
        
        // onWindowResize();
        
        if (developmentEnvironment()){
            showStats();
            showAxesHelper();
        }
        
        window.addEventListener( 'resize', onWindowResize, false );
        window.addEventListener( 'touchstart', generateMeshAtRandomPosition, false );

        update();
    }

    /**
     * Sets basic 3D Scene Elements
     */
    function setScene(){
        meshes = new Array();
        scene = new THREE.Scene();
        clock = new THREE.Clock();
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        renderer = new THREE.WebGLRenderer( );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0xFFF0FF, 1 );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        document.body.appendChild( renderer.domElement );
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        camera.position.set( 0, 10, 4);
        controls.autoRotate = true;
        controls.update();
     }

    /**
      * Setup shader Material
      * Init Uniforms
     */
     const setupShaderMaterial = () => {
        let shaderMaterial;

        uniforms = {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new THREE.Vector2() },
            u_mouse: { type: "v2", value: new THREE.Vector2() }
        };

        uniforms.u_resolution.value.x = window.innerWidth;
        uniforms.u_resolution.value.y = window.innerHeight;

        shaderMaterial =   new THREE.ShaderMaterial( {
            name: "Displacement",
            uniforms: uniforms,
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'displacementFragmentShader' ).textContent
        });

        return shaderMaterial;
    }
     /**
      * Loads the JSON font
      * Create the text Mesh
     */
    function renderTextGeometry(font, text){
        let letterWidth = 0,
            letterMesh;

        letterPosition = 0;

        textMesh = new THREE.Group();

        material = setupShaderMaterial();
        
        for(let i=0;i<text.length;i++){
            geometry = new THREE.TextGeometry( text[i], {
                font: font,
                size: 1,
                height: 0.25,
                curveSegments: 15
            });

            geometry.center();

            letterMesh = new THREE.Mesh( geometry, material );

            letterMesh.position.x = 0.7*i;

            textMesh.add( letterMesh)
        }

        textMesh.position.x = -1.5;
        textMesh.position.y = 1;

        if(isMobile){
            textMesh.position.y = 3.5;
        }

        scene.add(textMesh);
    }

    /**
     * Click Event Handler
     * Generates a cube on a random position
     */
    function generateMeshAtRandomPosition(){
        let material = new THREE.MeshBasicMaterial( {color: getRandomColor()} ),
            mesh,
            geometry,
            randomValue = getRandomInt(0, 3) ;
        
        switch (randomValue) {
            case 0:
                geometry = generateCubeGeometry();
                break;
            case 1: 
                geometry = generateSphereGeometry();
                break;
            case 2:
                geometry = generateIcosahedronGeometry();
                break;
            case 3: 
                geometry = generateTorusGeometry();
                break;
            default:
                return;
        }

        mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(getRandomArbitrary(-2,2), getRandomArbitrary(-2,2), getRandomArbitrary(-1,1));

        meshes.push(mesh);
        scene.add( mesh);
    }

    /**
     * Generates a cube geometry
     */
    const generateCubeGeometry = () => {
        let cubeWidth = getRandomArbitrary(0,1),
        cubeHeight = getRandomArbitrary(0,1);
        cubeGeometry = new THREE.BoxGeometry( cubeWidth, cubeHeight, 1 );
        return cubeGeometry;
    }

    /**
     * Generates an sphere geometry
     */
    const generateSphereGeometry = () => {
        let sphereRadius = getRandomArbitrary(0,1),
            sphereGeometry = new THREE.SphereBufferGeometry( sphereRadius, 32, 32 );
        return sphereGeometry;
    }

    /**
     * Generates an icosahedron geometry
     */
    const generateIcosahedronGeometry = () => {
        let icosahedronRadius = getRandomArbitrary(0,1),
            icosahedronGeometry = new THREE.IcosahedronGeometry(icosahedronRadius);
        return icosahedronGeometry;
    }

    /**
     * Generates a torus geometry
     */
    const generateTorusGeometry = () => {
        let torusRadius = getRandomArbitrary(0, 1),
            tube = getRandomArbitrary(0, 1),
            radialSegments = 10,
            tubularSegments = 30,
            torusGeometry = new THREE.TorusGeometry(torusRadius, tube, radialSegments, tubularSegments);
        return torusGeometry;
    }

    /**
     * Returns random numbers for RGB color
     */
    function getRandomColor() {
        // return "rgb(" + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ")";
        let pos = getRandomInt(0, colors.length);
        let stringColor = "rgb(" + colors[pos].color + ")";
        console.log(pos);
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
    function update(nowMsec){
        requestAnimationFrame( update );

        var delta = clock.getDelta();
        uniforms.u_time.value += delta * 2;

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
     * Load the JSON font and 
     * Init all functions
     */
    loader = new THREE.FontLoader();
    loader.load('../fonts/gotham_black_regular.json', function(font){
        init(font);
    });

}(magic));
