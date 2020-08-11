

/* 
Entrega 2 - Iván López de Munain Quintana
*/

// ****************** Variables Globales ********************* //
var gl = null,
    canvas = null,
    glProgram = null,
    fragmentShader = null,
    vertexShader = null;       

var  positionAttributeLocation =null, 
     colorLocation = null,
     matrixRotationLocation = null,
     vertexBuffer = null,
     colorBuffer = null;


// diccionario reglas
var reglas ={
    A: "FF[&BL]$LB",
    B: "FL[+CS&L]$L//CL",
    C: "FL[-BSL]LB",
    S: "//KFL/L/K",
    F: "F/$",
    X: "F[/+FF][//-FF]F[-F]$[+F]F"
};

keys = Object.keys(reglas);

// Coordenadas de los vértices en global
var   vertices =[];

// Colores de los vértices en global
var verticesColores = [];

//coordenadas y colores sol
var solVertices=[];
var solDefinitivo=[];
var colorSol=[];
var indexData = [];

//color para arbustos
var colorDef=null;
var token=true;
var colorArbusto =[50/255,205/255,50/255];

//numero de segmentos a dibujar
var segmentos = 0;

//Coordenadas vértices que simulan el suelo (hierba y tierra)
var verticesGeneral = [ 
				
    //caras arriba y abajo (distintos niveles)
    -0.75, -0.65, 1,
    0.75, -0.65, 1,
     -0.75, -0.65, -1,

     0.75, -0.65, -1,
     0.75, -0.65, 1,
     -0.75, -0.65, -1,

     -0.75, -0.75, 1,
     0.75, -0.75, 1,
     -0.75, -0.75, -1,

     0.75, -0.75, -1,
     0.75, -0.75, 1,
     -0.75, -0.75, -1,

     -0.75, -0.95, 1,
     0.75, -0.95, 1,
     -0.75, -0.95, -1,

     0.75, -0.95, -1,
     0.75, -0.95, 1,
     -0.75, -0.95, -1,

     //caras laterales: delantera y trasera (hierba)
     -0.75, -0.65, -1,
     -0.75, -0.75, -1,
     0.75, -0.65,-1,

     0.75, -0.65, -1,
     -0.75, -0.75, -1,
     0.75, -0.75,-1,

     -0.75, -0.65, 1,
     -0.75, -0.75, 1,
     0.75, -0.65,1,

     0.75, -0.65, 1,
     -0.75, -0.75, 1,
     0.75, -0.75,1,

     //caras laterales: delantera y trasera (tierra)

     -0.75, -0.95, -1,
     -0.75, -0.75, -1,
     0.75, -0.95,-1,

     0.75, -0.95, -1,
     -0.75, -0.75, -1,
     0.75, -0.75,-1,

     -0.75, -0.95, 1,
     -0.75, -0.75, 1,
     0.75, -0.95,1,

     0.75, -0.95, 1,
     -0.75, -0.75, 1,
     0.75, -0.75,1,

     //caras laterales: izq y derecha (hierba)
     -0.75, -0.65, 1,
     -0.75, -0.75, 1,
     -0.75, -0.75, -1,

     -0.75, -0.65, 1,
     -0.75, -0.65, -1,
     -0.75, -0.75, -1,

     0.75, -0.65, 1,
     0.75, -0.75, 1,
     0.75, -0.75, -1,

     0.75, -0.65, 1,
     0.75, -0.65, -1,
     0.75, -0.75, -1,

     //caras laterales: izq y derecha (tierra)

     -0.75, -0.95, 1,
     -0.75, -0.75, 1,
     -0.75, -0.75, -1,

     -0.75, -0.95, 1,
     -0.75, -0.95, -1,
     -0.75, -0.75, -1,

     0.75, -0.95, 1,
     0.75, -0.75, 1,
     0.75, -0.75, -1,

     0.75, -0.95, 1,
     0.75, -0.95, -1,
     0.75, -0.75, -1,
  
];

//colores para el suelo
var verticesGeneralColores = [
    ...repetir(6,34/255,139/255,34/255),
    ...repetir(6,0,102/255,51/255),
    ...repetir(6,34/255,139/255,34/255),
    ...repetir(6*3,0,102/255,51/255),
    ...repetir(6*3,164/255,64/255,0),
    ...repetir(6*3,0,102/255,51/255),
    ...repetir(6*3,0,102/255,51/255),
    ...repetir(6*3,164/255,64/255,0),
    ...repetir(6*3,164/255,64/255,0),
    ...repetir(6*3,0,102/255,51/255),
    ...repetir(6*3,0,102/255,51/255),
    ...repetir(6*3,164/255,64/255,0),
    ...repetir(6*3,164/255,64/255,0),
];



/********************* 1. INIT WEBGL **************************************/ 
function initWebGL()
{
    canvas = document.getElementById("canvas");  
    body = document.getElementById("body");
    gl = canvas.getContext("webgl");
    rect = canvas.getBoundingClientRect();
  
    canvas.onmousedown = onMousedown;
    canvas.onmousemove = onMousemove;    
    document.onmouseup = onMouseup;
    document.onkeydown=pulsaTecla;

    //posicion del sol (que cambie cada vez que se actualice)
    //Valor aleatorio en un determinado rango : Math.random()*(max-min) + min

    var solX = Math.random()*2.5-1.75;
    var solY = Math.random()*1.5+3.75;
    var solZ = -2*Math.random();
    var radio = 0.15;

    esfera(solX,solY,solZ,radio);
    
    //en colorSol se almacena el color del sol (amarillo con degradacion desde negro a blanco)
    for(a=0;a<indexData.length*3;a=a+3){
        colorSol[a]=a/(indexData.length*3);
        colorSol[a+1]=a/(indexData.length*3);
        colorSol[a+2]=0;
    }
    
    //en solDefinitivo se encuentran las coordenadas de los vertices (esto lo hago porque en el metodo se almacenaban la asociacion de indices, no lo indices)
    var k =0;
    for(j=0;j<indexData.length;j++){
        solDefinitivo[k]=solVertices[indexData[j]*3];
        solDefinitivo[k+1]=solVertices[indexData[j]*3+1];
        solDefinitivo[k+2]=solVertices[indexData[j]*3+2];
        k=k+3;
    }

    /* Estado del arbol: 
    Dir = vectores de dirección 
    nodo = posicion (nodo)
    */

    var arbol1= {
        Dir:  [0,1,0],
        nodo : [0,-0.7,0]
        };
        
    var arbol3= {
        Dir:  [0,1,0],
        nodo : [0.5,-0.7,-0.5]
        };

    var arbol4= {
        Dir:  [0,1,0],
        nodo : [-0.5,-0.7,0.5]
        };
        
    /*
    Se podrian poner sus localizaciones totalmente aleatorias aunque para evitar superposiciones habria que añadir el siguiente codigo
    Problema: tarda mucho en cargar (incluso llegando a bloquearse). 
    Por eso les he dado posiciones fijas a los arboles y aleatorias a los arbustos (que no se ven tan feos aunque se solapen).

    while(arbol1.nodo[0]-arbol2.nodo[0]<0.1){
        arbol2.nodo[0]=Math.random()*1.5-0.75;
    }   

    Asi con todos los arboles que quieran dibujarse.....
    
    */


    // Niveles 
    var n1 = 7;
    var n3 = 5;
    var n4 = 5;

    //tres arboles
    dibujoArbol("A",arbol1,n1);
    dibujoArbol("A",arbol3,n3);
    dibujoArbol("A",arbol4,n4);

    //dibujo aleatorio entre 20 y 30 arbustos 
    for(i=0;i<(Math.random()*10+20);i++){
        var arbol2= {
            Dir:  [0,1,0],
            nodo : [Math.random()*1.5-0.75,-0.7,Math.random()*2-1]
            };
        dibujoArbol("X",arbol2,1);
    }

    //se reagrupan todos los vertices
    vertices = [...vertices,...verticesGeneral,...solDefinitivo];
    
    //se reagrupan todos los colores
    verticesColores = [...verticesColores,...verticesGeneralColores,...colorSol];   


    if(gl) {
        setupWebGL();
        initShaders();
        setupBuffers();
        drawScene();    
       
    } 
    else {  
        alert(  "El navegador no soporta WEBGL.");
    }   
}

/********************* 2.setupWEBGL **************************************/ 
function setupWebGL()
      {
        
        //Crea un viewport del tamaño del canvas
        gl.viewport(0, 0, canvas.width, canvas.height);

        
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);         
        gl.enable(gl.BLEND);
 
      }
/********************* 3. INIT SHADER **************************************/ 
function initShaders()
    {
    // Esta función inicializa los shaders

    //1.Obtengo la referencia de los shaders 
    var fs_source = document.getElementById('fragment-shader').innerHTML;
    var vs_source = document.getElementById('vertex-shader').innerHTML;

    //2. Compila los shaders  
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

    //3. Crea un programa
    glProgram = gl.createProgram();

    //4. Adjunta al programa cada shader
        gl.attachShader(glProgram, vertexShader);
        gl.attachShader(glProgram, fragmentShader);
        gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("No se puede inicializar el Programa .");
        }

    //5. Usa el programa
    gl.useProgram(glProgram);

  
    }

/********************* 3.1. MAKE SHADER **************************************/ 
function makeShader(src, type)
{
    //Compila cada  shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error de compilación del shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}


/********************* 5 SETUP BUFFERS  **************************************/ 
function setupBuffers(){    



    //Buffer vértices
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);         
    
    positionAttributeLocation = gl.getAttribLocation(glProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);        

    //Enlazo con las posiciones de los vértices
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    //Buffer de color
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesColores), gl.STATIC_DRAW);  

  

    colorLocation = gl.getAttribLocation(glProgram, "color");
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

   
    //Localiza la matriz de perspectiva
    matrixRotationLocation = gl.getUniformLocation(glProgram,"matrixRotation");


} 

/*********************      Draw Scene     *********************************** */
function drawScene(){   

    var rotationYMatrix = mat4.create();
    var rotationXMatrix = mat4.create();
    var rotationMatrix = mat4.create();
    var vistaMatrix = mat4.create();
    var perspectivaMatrix = mat4.create();

    var perspectiva = Math.PI/4;

    //para poder hacer zoom
    mat4.perspective(perspectivaMatrix,perspectiva, 1,0.1,10);
    mat4.lookAt(vistaMatrix,[0,-0.1,g_far],[0,0,0],[0,1,0]);

    mat4.rotateY(rotationYMatrix,rotationYMatrix,anguloRotacionY);
    mat4.rotateX(rotationXMatrix,rotationXMatrix,anguloRotacionX);
    mat4.multiply(rotationMatrix, rotationXMatrix, rotationYMatrix);
    mat4.multiply(rotationMatrix, vistaMatrix, rotationMatrix);

    mat4.multiply(rotationMatrix, perspectivaMatrix, rotationMatrix);
    
    gl.uniformMatrix4fv(matrixRotationLocation,false, rotationMatrix);
    
    
    //Dibuja las ramas
    gl.drawArrays(gl.LINES, 0, segmentos);

    //Dibuja las hojas
    gl.drawArrays(gl.TRIANGLES, segmentos,vertices.length);

}


//==================================Funciones Auxiliares============================

/*Funcion repeticion tres numeros tantas veces (uso para asignacion de colores)
 Paramero num : numero de veces que se quiere repetir
 Parametro valor1: primer valor a repetir (Red)
 Parametro valor2: segundo valor a repetir (Blue)
 Parametro valor3: tercer valor a repetir (Green)
 Devolucion: vector de numeros reales
*/
function repetir(num, valor1,valor2,valor3){
    var respuesta=[];
    for(i=0;i<num;i=i+3){
        respuesta[i]=valor1;
        respuesta[i+1]=valor2;
        respuesta[i+2]=valor3;
    }
    return respuesta;
}


/*Funcion para representar una esfera
Parametro xc: coordenada X del centro de la esfera
Parametro yc: coordenada Y del centro de la esfera
Parametro zc: coordenada Z del centro de la esfera
Parametro radius: radio de la esfera
*/
function esfera(xc,yc,zc,radius){
    var latitudeBands = 30;
    var longitudeBands = 30;

    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta + xc;
            var y = cosTheta + yc;
            var z = sinPhi * sinTheta + zc;

            solVertices.push(radius * x);
            solVertices.push(radius * y);
            solVertices.push(radius * z);
        }
    }


    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }


}

//============================= ROTACIÓN ===============================

var rect = null;
var x0 = null,
    x1 = null,
    y0 = null,
    y1 = null;
var down = false;

//se situa la vista desde donde se quiere ver
var anguloRotacionY = -0.12;
var anguloRotacionX = 0;

var anguloInicialY = null;
var anguloInicialX = null;

/**
 * Grados a radianes.
 * Parametro angle: angulo en grados
 */
function degtoRads(angle) {
    return angle*Math.PI/360;
}

/**
 * Devuelve el ángulo de giro en radianes a partir de la distancia recorrida en el eje X
 * Parametro x0: coordenada inicial de x 
 * Parametro x1: coordenada final de x 
 */
function  getTheta(x0,x1) {
    var alfa;

    alfa = (x1-x0) *Math.PI / 180;
    return alfa;
}

/**
 * Evento inicio de pulsación del ratón.
 * Parametro event:  evento de inicio de pulsación.
 */
function onMousedown(event) {

    x0 = event.pageX - rect.left - canvas.width;
    y0 = event.pageY - rect.left - canvas.height;
    down = true;

    anguloInicialY = anguloRotacionY;
    anguloInicialX = anguloRotacionX;
    
}

/**
 * Maneja el evento de movimiento del ratón.
 * Parametro event: evento de movimiento del ratón.
 */
function onMousemove(event) {
    if(down) {
        x1 = event.pageX - rect.left - canvas.width;
        y1 = event.pageY - rect.left - canvas.height;

        anguloRotacionY = anguloInicialY - getTheta(x0,x1);
        anguloRotacionX = anguloInicialX;
        
        /******* Descomentar esta parte si se quiere rotacion sobre el eje X ************
         
        anguloRotacionX = anguloInicialX - getTheta(y0,y1);

        //se limita el angulo de rotacion en X (no aporta nada observar por debajo del "suelo")

        if(anguloRotacionX>-0.2){
            anguloRotacionX=-0.2;
        }

        if( anguloRotacionX<-2.95){
            anguloRotacionX=-2.95;
        }

        */

        drawScene();
    }
}

/**
 * Fin de pulsación del ratón.
 * Parametro event: evento de fin de pulsación del ratón.
 */
function onMouseup(event) {
    down = false;
}

var g_far=-1.87;

//funcion para poder hacer zoom en el eje z
function pulsaTecla(event){
    
    switch(event.keyCode){
        case 38:  
            if(g_far>-0.46){ 
                g_far=-0.46;
            } else{
                g_far += 0.01;
            }
            break;  // The up arrow key was pressed
        case 40:  
            if(g_far<-2.86){ 
                g_far=-2.86;
            } else{
                g_far -= 0.01;
            }
            break;  // The down arrow key was pressed
        default: return; 
      }
    
    drawScene();
    
}




// =============================================== L-SYSTEM ===========================================

// Ángulo 
var delta = 40;

// Colores 
var colorRamas = [153/255,76/255,0];   
var colorHoja = [154/255,205/255,50/255];    
var colorFlor = [138/255,43/255,226/255];    

// Pila de estados 
var pila = [];


//Longitud segmentos 
var longitud = 0.105;

/*
Dibujar el arbol.
Parametro inicio: semilla para desencadenar las reglas
Parametro estado: estado del arbol
Parametro n: numero de iteraciones para construir el arbol
*/
function dibujoArbol(inicio,estado,n) {    
   

    //semilla para comenzar a disparar reglas
    var secuencia = inicio;

    //longitud de los segmentos pintados
    var long;

    //para ir almacenando la cadena
    var siguiente = "";

    // se obtiene la secuencia al aplicar las reglas iterando n veces (niveles)
    for(var i=0; i < n; i++) {
        siguiente = formacionCadena(secuencia);
        secuencia = siguiente;  
    }

    //una vez formada la cadena la recorremos para saber que operaciones realizar
    for(let letra of secuencia) {
        
        long = 1.5*longitud - Math.random()*longitud;

        switch(letra) {
            case('['):

                //meter estado en la pila
                var iniRama=true;
                estado = iniciarRama(iniRama,estado);
                break;

            case(']'):

                //saca estado de la pila
                var iniRama = false;
                estado = iniciarRama(iniRama,estado);               
                break;           

            case('F'):

                if(token == true){
                    colorDef = colorRamas;
                }else{
                    colorDef=colorArbusto;
                }

                haciaDelantePintar(long, colorDef,estado);
                
                //anotar que se ha pintado un nuevo segmento
                segmentos++;

                break; 
                          
            case('f'):
                haciaDelanteSinPintar(long,estado);
                break;

            case('+') :
                girarIzq(estado);
                break;

            case('-'):
               girarDch(estado);
                break;

            case('$'): //Sustituye a \                
               rotarIzq(estado);
                break;

            case('/'):
                rotarDch(estado);
                break;

            case('|'):

                vuelta(estado);
                break; 
            
            case('&'):

                tirarAbajo(estado);
                 break;
 
             case('^'):

                 tirarArriba(estado);
                 break; 

            case('L'):

                dibujarHoja(long,colorHoja,estado);   
                
            case('K'):

                dibujarFlor(long,colorFlor,estado); 

            default :
                break;
        }
    }
}

/**
 * Obtiene la secuencia resultante de aplicar las reglas de producción (concatenandolas)
 * Parametro inicio: semilla del sistema.
 */
function formacionCadena(inicio) {
    var secuencia = "";

    for(let letra of inicio) {
        //concatenamos los strings
        secuencia = secuencia.concat(disparoRegla(letra));
    }

    return secuencia;
}


/**
 * Disparo de la regla de producción
 * Parametro letra 
 */
function disparoRegla(letra) {
    
        switch(letra) {
            
            case(keys[0]):  
                token=true;
                return reglas.A;                        
            
            case(keys[1]):  
                return reglas.B;
          
            case(keys[2]):
                return reglas.C;
            
            case(keys[3]):
                return reglas.S;      
            
            case(keys[4]):
                return reglas.F;
            
            case(keys[5]):
                token = false;
                return reglas.X;           
                
            // Si la letra no coincide con ninguna regla de producción se sustituye por sí misma.
            default:
                return letra;

        }
}



// =============== Operaciones  =====================

//iniciar una rama o terminarla en funcion del parametro iniRama(booleano: true añadimos estado en la pila, false sacamos estado)

function iniciarRama(iniRama,estado){

    if(iniRama){
        
        var antiguoNodo = estado.nodo.slice();
        var antiguoDir = estado.Dir.slice();
        var oldestado = {Dir : antiguoDir, nodo : antiguoNodo};

        //se añade el estado anterior a la cima de la pila
        pila.push(oldestado);

    }else{

        //se saca el estado de la cima de la pila
        estado = pila.pop();

    }
    
    return estado;
}

// Operación f, se le da la longitud para avanzar

function haciaDelanteSinPintar(long,estado) {
    var nodoFinal = [estado.nodo[0] + long*estado.Dir[0], estado.nodo[1] + long*estado.Dir[1], estado.nodo[2] + long*estado.Dir[2]];
    estado.nodo = nodoFinal;
}

// Dibuja un segmento del color y la longitud indicados.

function haciaDelantePintar(long,color,estado) {
    var nodoInicial = [estado.nodo[0], estado.nodo[1], estado.nodo[2]];
    var nodoFinal;

    vertices = [...vertices,...nodoInicial];
    haciaDelanteSinPintar(long,estado); 

    nodoFinal = [estado.nodo[0], estado.nodo[1], estado.nodo[2]];
    vertices = [...vertices,...nodoFinal];   

    if(Math.random() > 0.8) {

        //intento de simular luminosidad
        verticesColores = [...verticesColores,...[1,1,1]];
    } else {
        verticesColores = [...verticesColores,...color];
    }
    
    verticesColores = [...verticesColores,...color];
    segmentos++;
}


// Operación \

function rotarIzq(estado) {
    var newDir = [];
    vec3.rotateX(newDir, estado.Dir, estado.nodo, degtoRads(delta)); 
    vec3.normalize(newDir,newDir);    
    estado.Dir = newDir;
}

// Operación /.
 
function rotarDch(estado) {
    var newDir = [];
    vec3.rotateX(newDir, estado.Dir, estado.nodo, -degtoRads(delta)); 
    vec3.normalize(newDir,newDir);
    estado.Dir = newDir;
}

// Realiza la operación +.

function girarIzq(estado) {
    var newDir = [];
    vec3.rotateZ(newDir, estado.Dir, estado.nodo, degtoRads(delta)); 
    vec3.normalize(newDir,newDir);
    estado.Dir = newDir;
 }

// Operacion -

function girarDch(estado) {
    var newDir = [];
    vec3.rotateZ(newDir, estado.Dir, estado.nodo, -degtoRads(delta));  
    vec3.normalize(newDir,newDir);
    estado.Dir = newDir;
}

// Operación &

function tirarAbajo(estado) {
    var newDir = [];
    vec3.rotateY(newDir, estado.Dir, estado.nodo, degtoRads(delta)); 
    vec3.normalize(newDir,newDir);
    estado.Dir = newDir;
}

// Operación ^
 
function tirarArriba(estado) {
    var newDir = [];
    vec3.rotateY(newDir, estado.Dir, estado.nodo, -degtoRads(delta)); 
    vec3.normalize(newDir,newDir);
    estado.Dir = newDir;
}



//Operación |
 
function vuelta(estado) {
    var newDir = [];
    vec3.rotateZ(newDir, estado.Dir, estado.nodo,Math.PI); 
    vec3.normalize(newDir,newDir);
    estado.Dir = newDir;
}


// Dibuja una hoja en la posición en la que se encuentra.

function dibujarHoja(long, color,estado) {

    var direccion = [];
    var aux1,aux2,aux3;
    var nodoInicial = estado.nodo.slice();
    var colorAux = [34/255,139/255,35/255];
    var Dir = estado.Dir.slice();
    
    vec3.rotateX(direccion, Dir, nodoInicial, (Math.PI/6));    


    var variacionX = long/4*direccion[0];
    var variacionY = long/4*direccion[1];
    var variacionZ = long/4*direccion[2];

    aux1 = [nodoInicial[0] + variacionX , nodoInicial[1] + variacionY, nodoInicial[2] - variacionZ];
    aux2 = [nodoInicial[0] + variacionX, nodoInicial[1] + variacionY, nodoInicial[2] + variacionZ];
    aux3 = [aux2[0]-long/3,aux2[1],aux2[2]-long/3];

    verticesGeneral = [...verticesGeneral,...nodoInicial,...aux3,...aux2,...aux1,...aux2,...aux3];    

    for(var i = 0; i < 6; i++) {
        if(Math.random() > 0.5) {
            verticesGeneralColores = [...verticesGeneralColores,...color];
        } else {
            verticesGeneralColores = [...verticesGeneralColores,...colorAux];
        }
       
    }
}

//Dibujo de flores
function dibujarFlor(long, color,estado) {

    var direccion = [];
    var aux1,aux2,aux3, aux4, aux5;
    var nodoInicial = estado.nodo.slice();
    var colorAux = [123/255,104/255,238/255];
    var Dir = estado.Dir.slice();

    vec3.rotateX(direccion, Dir, nodoInicial, (Math.PI/6));   
    
    var variacionX = long/4*direccion[0];
    var variacionY = long/4*direccion[1];
    var variacionZ = long/4*direccion[2];

    aux1 = [nodoInicial[0] + variacionX , nodoInicial[1] + variacionY, nodoInicial[2] - variacionZ];
    aux2 = [nodoInicial[0] + variacionX, nodoInicial[1] + variacionY, nodoInicial[2] + variacionZ];
    aux3 = [aux2[0]-long/3,aux2[1],aux2[2]-long/3];
    

    verticesGeneral = [...verticesGeneral,...nodoInicial,...aux3,...aux2,...aux1,...aux2,...aux3];    

    for(var i = 0; i < 6; i++) {
        if(Math.random() > 0.5) {
            verticesGeneralColores = [...verticesGeneralColores,...color];
        } else {
            verticesGeneralColores = [...verticesGeneralColores,...colorAux];
        }
       
    }

    var variacionX = Math.random()*0.01;
    var variacionY = Math.random()*0.05-0.05;
    var variacionZ = Math.random()*0.02-0.01;

    //dibujo de frutos, cabe la posibilidad de que una flor tenga un fruto rojo
    //cada fruto esta dibujado con un octaedro que debido a la gravedad cae en el eje y
    //mi intencion era utilizar el procedimiento esfera() para realizar frutos esfericos 
    //pero tardaba mucho a la hora de procesarse quedandose colgado

    if(Math.random() > 0.9) {

            aux1 = [nodoInicial[0] , nodoInicial[1] + variacionY/2, nodoInicial[2]]
            aux2 = [nodoInicial[0] + variacionX, nodoInicial[1] + variacionY/3, nodoInicial[2] +variacionZ];
            aux3 = [nodoInicial[0] - variacionX, nodoInicial[1] + variacionY/3 , nodoInicial[2] + variacionZ];
            aux4 = [nodoInicial[0] + variacionX, nodoInicial[1] + variacionY/3, nodoInicial[2] - variacionZ];
            aux5 = [nodoInicial[0] - variacionX, nodoInicial[1] + variacionY/3 , nodoInicial[2] - variacionZ];

            verticesGeneral = [...verticesGeneral,...nodoInicial,...aux3,...aux2,...aux1,...aux2,...aux3,
                ...nodoInicial,...aux4,...aux5,...aux1,...aux4,...aux5,
                ...nodoInicial,...aux2,...aux4,...aux1,...aux2,...aux4,
                ...nodoInicial,...aux3,...aux5,...aux1,...aux3,...aux5];
            verticesGeneralColores = [...verticesGeneralColores,...repetir(24*3,178/255,34/255,34/255)];
       
        }


}




