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
        controls,
        renderer,
        uniforms,
        axesHelper,
        currentMesh,
        rainbowMesh,
        currentColorTextMesh,
        rainbowTextureMaterial,
        gothamBlackRegularFont,
        isSphereReadyForRotation,
        SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
        aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    const materials = [

    ];

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
    const init = (font) => {
        setScene();
        
        if (developmentEnvironment()){
            showStats();
            showAxesHelper();
        }

        window.addEventListener( 'touchstart', renderElement, false );
        renderElement();
        update();
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
      * Setup shader Material
      * Init Uniforms
     */
     const setupShaderMaterial = () => {
        let shaderMaterial;

        uniforms = {
            u_time: { value: 1.0 },
            u_resolution: { type: "v2", value: new THREE.Vector2() },
        };

        uniforms.u_resolution.value.x = window.innerWidth;
        uniforms.u_resolution.value.y = window.innerHeight;

        shaderMaterial =   new THREE.ShaderMaterial( {
            name: "rainbow",
            uniforms: uniforms,
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        });

        return shaderMaterial;
    }

    /**
     * Loads a texture URL and returns a promise
     */
    const loadTexture = (url) => {
        return new Promise(resolve => {
            new THREE.TextureLoader().load(url, resolve)
        })
    }

    /**
     * Renders a Sphere with a rainbow texture image
     */
    const getRainbowMaterial = () => {
        loadTexture('textures/rainbow.png').then(texture => {
            rainbowTextureMaterial =  new THREE.MeshBasicMaterial({ map: texture });
        })
        return rainbowTextureMaterial;
    }

     /**
      * Loads the JSON font
      * Create the text Mesh
      * @param THREE.Vector3 tectPposition
      */
    const renderTextMesh = (font, text, textPosition, material, meshName) => {
        let letterMesh,
            geometry,
            fontSize = 0.37,
            letterSpacing = 0.3;

        let textMesh = new THREE.Group();
        
        for(let i=0;i<text.length;i++){
            geometry = new THREE.TextGeometry( text[i], {
                font: font,
                size: fontSize,
                height: 0.2,
                curveSegments: 15
            });

            geometry.center();

            letterMesh = new THREE.Mesh( geometry, material );

            letterMesh.position.x = letterSpacing*i;
            letterMesh.position.y = 1;

            textMesh.add( letterMesh)
        }

        textMesh.name = meshName;
        textMesh.position.set(textPosition.x, textPosition.y, textPosition.z);
        textMesh.rotation.x = 0.07;

        scene.remove(scene.getObjectByName( 'colorName'));
        scene.add(textMesh);
    }

    /**
     * Click Event Handler
     * renders a mesh with randomized geometry, material and color
     */
    const renderElement = () => {
        let material = new THREE.MeshBasicMaterial( {color: getRandomColor()} ),
            mesh,
            geometry,
            randomValue = getRandomInt(0, 3);
        
        switch (randomValue) {
            case 0:
                geometry = renderCubeGeometry();
                break;
            case 1:
                geometry = renderSphereGeometry();
                material = getRainbowMaterial();
                break;
            case 2:
                geometry = renderIcosahedronGeometry();
                break;
            case 3: 
                geometry = renderTorusGeometry();
                break;
            default:
                return;
        }

        scene.remove(scene.getObjectByName( 'geometricMesh'));

        mesh = new THREE.Mesh( geometry, material );
        mesh.name = "geometricMesh";
        mesh.position.set(0, 2.2, 0);

        meshes.push(mesh);
        scene.add( mesh);
        currentMesh = mesh.name;
    }

    /**
     * renders a cube geometry
     */
    const renderCubeGeometry = () => {
        let cubeWidth = 2,
            cubeHeight = 2,
            cubeGeometry = new THREE.BoxGeometry( cubeWidth, cubeHeight, 1 );
        return cubeGeometry;
    }

    /**
     * renders a sphere geometry
     */
    const renderSphereGeometry = () => {
        let sphereRadius = 1.7,
            sphereGeometry = new THREE.SphereBufferGeometry( sphereRadius, 32, 32 );
        return sphereGeometry;
    }

    /**
     * renders an icosahedron geometry
     */
    const renderIcosahedronGeometry = () => {
        let icosahedronRadius = 1.5,
            icosahedronGeometry = new THREE.IcosahedronGeometry(icosahedronRadius);
        return icosahedronGeometry;
    }

    /**
     * renders a torus geometry
     */
    const renderTorusGeometry = () => {
        let torusRadius = 1.4,
            tube = 0.4,
            radialSegments = 10,
            tubularSegments = 20,
            torusGeometry = new THREE.TorusGeometry(torusRadius, tube, radialSegments, tubularSegments);
        return torusGeometry;
    }

    /**
     * Returns random numbers for RGB color
     */
    const getRandomColor = () => {
        // return "rgb(" + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ")";
        let pos = getRandomInt(0, colors.length-1, true),
            stringColor = "rgb(" + colors[pos].color + ")",
            colorName = colors[pos].name;
        
        currentColorTextMesh = colorName;
        let material = new THREE.MeshBasicMaterial( {color: stringColor} );

        renderTextMesh(gothamBlackRegularFont, colorName, new THREE.Vector3( -2, -3.5, 0 ), material, 'colorName');
        
        return stringColor;
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
        // let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
        
        let preValue = Math.random() * (max - min + 1);
        // let randomInt = Math.floor(preValue) + min;
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
        
        scene.getObjectByName( 'geometricMesh' ).rotation.x -= 0.01;

        if(isSphereReadyForRotation) {
            rainbowMesh.rotation.x -= 0.01;
            rainbowMesh.rotation.y -= 0.01;
        }
        
        renderer.render( scene, camera );

        if (developmentEnvironment()){
            stats.end();
        }
    }

    /** 
     * Load the JSON font and Init all functions
     */
    loader = new THREE.FontLoader();
    loader.load('../fonts/gotham_black_regular.json', function(font){
        gothamBlackRegularFont = font;
        init();
    });

}(magic));
