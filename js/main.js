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
        objects,
        controls,
        renderer,
        axesHelper,
        currentMesh,
        customUniforms,
        cameraPositionZ,
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

        renderFireBall();

        // window.addEventListener( 'touchstart', renderElement, false );
        window.addEventListener( 'touchstart', zoomOut, false );
    }

    /**
     * Sets basic 3D Scene Elements
     */
    const setScene = () => {
        scene = new THREE.Scene();
        clock = new THREE.Clock();

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        cameraPositionZ = 8
        camera.position.set( 0, 1, cameraPositionZ);
        
        renderer = new THREE.WebGLRenderer( );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor( 0xFFF0FF, 1 );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        document.body.appendChild( renderer.domElement );

        controls = new THREE.OrbitControls( camera, renderer.domElement );
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

                    // renderElements();

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
            case "IcosahedronBufferGeometry": 
                geometry = new THREE.IcosahedronBufferGeometry( params[0] );
                break;
            case "TorusKnotBufferGeometry": 
                geometry = new THREE.TorusKnotBufferGeometry( params[0], params[1], params[2], params[3] );
                break;
            case "EggGeometry":
                geometry = getEggGeometry();
            default:
                return;
        }
        return geometry;
    }

    /**
     * 
     */
    const getEggGeometry = () => {
       // points - (x, y) pairs are rotated around the y-axis
        let points = [];
        for ( let deg = 0; deg <= 180; deg += 6 ) {
            let rad = Math.PI * deg / 180;
            let point = new THREE.Vector2( ( 0.72 + .08 * Math.cos( rad ) ) * Math.sin( rad ), - Math.cos( rad ) ); // the "egg equation"
            // console.log( point ); // x-coord should be greater than zero to avoid degenerate triangles; it is not in this formula.
            points.push( point );
        }

        return new THREE.LatheBufferGeometry( points, 32 );
    }

    /**
     * New Click Event Handler
     * Zooms out a bit to see next element
     */
    const zoomOut = () => {
        cameraPositionZ += 1;
        camera.position.set( 0, 1, cameraPositionZ);
        renderElement();
    }

    /**
     * Renders elements on pageLoag
     */

    const renderElements = () => {
        let mesh,
        geometry,
        theObject,
        position,
        textureUrl;
        
        for(let i=0; i<objects.length;i++){
            theObject = objects[i];
            position = theObject.position;
            console.log(position);
            geometry = getGeometry(theObject.geometry, theObject.params);
            textureUrl = theObject.textureUrl;
    
            loadMaterial(textureUrl).then(material => {
                mesh = new THREE.Mesh( geometry, material );
                mesh.position.set(position);
                console.log(theObject)

                scene.add( mesh);
             });   
        }
        console.log(scene.children);

        // theObject = objects[0];
        // console.log(theObject);
        // geometry = getGeometry(theObject.geometry, theObject.params);
        // textureUrl = theObject.textureUrl;

        // loadMaterial(textureUrl).then(material => {
        //     mesh = new THREE.Mesh( geometry, material );
        //     mesh.name = "geometricMesh";
        //     mesh.position.set(0, 2.2, 0);

        //     scene.add( mesh);
        //     currentMesh = mesh;
        //  });   

        //  theObject = objects[1];
        
        // geometry = getGeometry(theObject.geometry, theObject.params);
        // textureUrl = theObject.textureUrl;

        // loadMaterial(textureUrl).then(material => {
        //     mesh = new THREE.Mesh( geometry, material );
        //     mesh.name = "geometricMesh";
        //     mesh.position.set(1.5, 2.2, 3);

        //     scene.add( mesh);
        //     currentMesh = mesh;
        //  });   
    }

    /**
     * Click Event Handler
     * renders a mesh with randomized geometry and texture
     */
    const renderElement = () => {
        let posZ,
            mesh,
            geometry,
            theObject,
            textureUrl,
            randomValue;

        randomValue = getRandomInt(0, objects.length-1);
        theObject = objects[randomValue];
        
        geometry = getGeometry(theObject.geometry, theObject.params);
        textureUrl = theObject.textureUrl;
        posZ = theObject.positionZ;

        loadMaterial(textureUrl).then(material => {
            // scene.remove(scene.getObjectByName( 'geometricMesh'));

            mesh = new THREE.Mesh( geometry, material );
            mesh.name = "geometricMesh";
            mesh.position.set(0, 2.2, posZ);
            // mesh.position.set(meshPosition);

            scene.add( mesh);
            currentMesh = mesh;
         });

         document.getElementsByTagName('h2')[0].innerText = theObject.name;
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
     * 
     */
    const renderFireBall = () => {
        // base image texture for mesh
        let lavaTexture = new THREE.TextureLoader().load('textures/lava.jpg');

        // multiplier for distortion speed 		
        let baseSpeed = 0.02;
        // number of times to repeat texture in each direction
        let repeatS = 3.0;
        let repeatT = 4.0;

        // texture used to generate "randomness", distort all other textures
        let noiseTexture = new THREE.TextureLoader().load('textures/cloud.png');

        noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
        // magnitude of noise effect
        let noiseScale = 0.5;

        // texture to additively blend with base image texture
        let blendTexture = new THREE.TextureLoader().load('textures/lava.jpg');

        blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping; 
        // multiplier for distortion speed 
        let blendSpeed = 0.1;
        // adjust lightness/darkness of blended texture
        let blendOffset = 0.15;

        // texture to determine normal displacement
        let bumpTexture = noiseTexture;
        bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
        // multiplier for distortion speed 		
        let bumpSpeed   = 0.02;
        // magnitude of normal displacement
        let bumpScale   = 5.0;

        // use "this." to create global object
        customUniforms = {
            baseTexture: 	{ type: "t", value: lavaTexture },
            baseSpeed:		{ type: "f", value: baseSpeed },
            repeatS:		{ type: "f", value: repeatS },
            repeatT:		{ type: "f", value: repeatT },
            noiseTexture:	{ type: "t", value: noiseTexture },
            noiseScale:		{ type: "f", value: noiseScale },
            blendTexture:	{ type: "t", value: blendTexture },
            blendSpeed: 	{ type: "f", value: blendSpeed },
            blendOffset: 	{ type: "f", value: blendOffset },
            bumpTexture:	{ type: "t", value: bumpTexture },
            bumpSpeed: 		{ type: "f", value: bumpSpeed },
            bumpScale: 		{ type: "f", value: bumpScale },
            alpha: 			{ type: "f", value: 1.0 },
            time: 			{ type: "f", value: 1.0 }
        };

        // create custom material from the shader code above
        //   that is within specially labeled script tags
        let customMaterial = new THREE.ShaderMaterial( 
        {
            uniforms: customUniforms,
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        }   );
            
        let ballGeometry = new THREE.SphereGeometry( .4, 16, 16 );
        let ball = new THREE.Mesh(	ballGeometry, customMaterial );
        ball.position.set(0, 0, 0);
        scene.add( ball );
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

        let delta = clock.getDelta();
        // uniforms.u_time.value += delta * 2;
    	customUniforms.time.value += delta;

        if (developmentEnvironment()){
            stats.begin();
        }
        
        if(currentMesh){
            // scene.getObjectByName( 'geometricMesh' ).rotation.y += 0.01;
            currentMesh.rotation.y += 0.01;
        }
        
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
