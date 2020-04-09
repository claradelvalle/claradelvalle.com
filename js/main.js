/*
 * Clara Del Valle
 * Costa Rica
 * 2020
 */

let magic = window.magic || {};

(function (){

    'use strict';

    let scene,
        clock,
        stats,
        camera,
        loader,
        meshes,
        objects,
        renderer,
        axesHelper,
        currentMesh,
        rainbowMesh,
        currentColorTextMesh,
        isSphereReadyForRotation,
        SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
        aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    /**
     * Check hostname to verify Development Environment
     */    
    const developmentEnvironment = () => window.location.host != 'claradelvalle.com';

    /**
     * Checks if website is rendered on a mobile device
     */
    const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
    
    /**
     * Set up and show Javascript Performance Monitor
     */
    const showStats = () => {
        stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
    }

    /**
     * Show Axes Helpers for 3D
     */
    const showAxesHelper = () => {
        axesHelper = new THREE.AxesHelper( 5 );
        scene.add( axesHelper );
    }

    /**
     * Init all functions
     */
    const init = () => {
        let jsonFileURL = '/js/constants/objects.json';
        objects = new Array();

        readJson(jsonFileURL);
        
        setScene();
        
        if (developmentEnvironment()){
            showStats();
            showAxesHelper();
        }

        window.addEventListener( 'touchstart', renderElement, false );
    }

    /**
     * Sets basic 3D Scene Elements
     */
    const setScene = () => {
        meshes = new Array();
        scene = new THREE.Scene();
        clock = new THREE.Clock();

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 0, 1, 10);
        // camera.lookAt(0, 0, 0);
        
        renderer = new THREE.WebGLRenderer( );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0xFFF0FF, 1 );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        document.body.appendChild( renderer.domElement );

        // controls = new THREE.OrbitControls( camera, renderer.domElement );
     }

    /**
     * Call objects.json file
     */
    function readJson(jsonFileURL){
        let obj,
            randomValue,
            xmlhttp = new XMLHttpRequest();

        xmlhttp.open('GET', jsonFileURL, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) {
                    obj = JSON.parse(xmlhttp.responseText);
                    objects = new Array();
                    objects = obj.objects;

                    renderElement();
                    update();
                }
            }
        };

        xmlhttp.send(null);
    }

    /**
     * Loads a texture URL and returns a promise
     */
    const loadTexture = (url) => {
        return new Promise(resolve => {
            new THREE.TextureLoader().load(url, resolve)
        });
    }

    /**
     * Renders a Material with a texture image
     */
    const loadMaterial = (textureUrl) => {
        return loadTexture(textureUrl).then(texture => {
            return new THREE.MeshBasicMaterial({ map: texture });
        });
    }

    /**
     * Grabs params and returns a Geometry
     */
    const getGeometry = (name, params) => {
        let geometry;

        switch (name) {
            case "SphereBufferGeometry":
                geometry = new THREE.SphereBufferGeometry( params[0], params[1], params[2] );
                break;
            case "TorusGeometry":
                geometry = new THREE.TorusGeometry( params[0], params[1], params[2], params[3]  );
                break;
            case "BoxGeometry":
                geometry = new THREE.BoxGeometry( params[0], params[1], params[2]);
                break;
            case "IcosahedronGeometry": 
                geometry = new THREE.IcosahedronGeometry( params );
                break;
            case "TorusKnotBufferGeometry": 
                geometry = new THREE.TorusKnotBufferGeometry( params[0], params[1], params[2], params[3] );
                break;
            default:
                return;
        }
        return geometry;
    }

    /**
     * Click Event Handler
     * renders a mesh with randomized geometry and texture
     */
    const renderElement = () => {
        let mesh,
            name,
            params,
            geometry,
            theObject,
            textureUrl,
            randomValue;

        randomValue = getRandomInt(0, objects.length-1);
        theObject = objects[randomValue];
        
        name = theObject.name;
        geometry = getGeometry(theObject.geometry, theObject.params);
        textureUrl = theObject.textureUrl;

        loadMaterial(textureUrl).then(material => {
            scene.remove(scene.getObjectByName( 'geometricMesh'));

            mesh = new THREE.Mesh( geometry, material );
            mesh.name = "geometricMesh";
            mesh.position.set(0, 2.2, 0);

            meshes.push(mesh);
            scene.add( mesh);
            currentMesh = mesh.name;
         });
    }
    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max, showOnConsole) {
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
        // uniforms.u_time.value += delta * 2;

        if (developmentEnvironment()){
            stats.begin();
        }
        
        // scene.getObjectByName( 'geometricMesh' ).rotation.x -= 0.01;

        // if(isSphereReadyForRotation) {
        //     rainbowMesh.rotation.x -= 0.01;
        //     rainbowMesh.rotation.y -= 0.01;
        // }
        
        renderer.render( scene, camera );

        if (developmentEnvironment()){
            stats.end();
        }
    }

    /** 
     * Init all functions
     */
    init();

}(magic));
