var cells = []; // variable de alcance global para almacenar la posicion de cada uno de los *
for (let i = 0; i < 1000; i++) {
    cells[i] = " "; //llenamos las celdas con espacios por defecto
}

var particlePosition = []; // variable que guarda la posicion de las particulas del fluido; La defino como global porque varias funciones necesitan acceder a ella
var rightBorder = [26, 53, 80,107,134,161,188,215,242,269,296,323,350,377,404]; // posiciones que delimitan el borde derecho
var leftBorder = [0,27, 54, 81,108,135,162,189,216,243,270,297,324,351,378]; // posiciones que delimitan el borde izquierdo

var static = 0; // cuantas veces se va a quedar estatico el fluido antes de "romperse"
var speed = 400; // velocidad del intervalo

// Funcion para obtener el contenido del txt.
function readFile() {
    const fileInput = document.getElementById('fileInput'); //accedemos al input y a todos sus valores
    
    // Verificar si se seleccionó un archivo
    if (fileInput.files.length === 0) {
      alert('No has subido ningun archivo!');
      return;
    }
    
    const file = fileInput.files[0]; // accedemos al primer archivo seleccionado
    const reader = new FileReader(); // creamos una instancia de FileReader que nos pemrite leer archivos
    reader.readAsText(file); // le pasamos el archivo anterior
    reader.onload = function() { // cuando lea el archivo
        asciiParser(reader.result); // le pasamos al parser el dibujo del txt para que lo convierta en array
        setInterval(function(){
            printFrame();
            findFluid(); //primero busca en donde se encuentran las particulas
            gForce();
            if (static > 10) {
                findFluid();
                colision();
            }
            printFrame();
            static++
        }, speed)
    };
}

// Funcion para pasar el string a un array de la entrada del archivo
function asciiParser(string) {
    const caracteres = string.split('');
    var lines = 0; // cuenta cuantas lineas van para poder mantener las proporciones del dibujo
    var skipLine = false; // comprobar si estamos en una nueva linea
    var started = false; //comprobamos si hemos empezado en la siguiente linea
    var nextPosition = 1; // las posiciones que nos debemos de mover desde el inicio de la nueva fila
    if (caracteres.length > 150) {
        alert('El tamaño máximo del dibujo es de 10x15 (150 caract. max.) y el tuyo tiene: ' + caracteres.length);
        return;
    }
    
    for (let i = 0; i < caracteres.length; i++) {
        if (caracteres[i] === '\r') {
            continue;
        }else if (caracteres[i] === '\n' && skipLine === false) {
            lines++; //como hay un cambio de linea se le suma al numero de lineas totales
            skipLine = true;
            continue;
        }else if (caracteres[i] === '\n' && skipLine === true){ // uso el skipLine porque cuando toca un \n en cambio de linea significa que el siguiente caracter va a ser la priemra posicion de la siguiente linea
            lines++;
            nextPosition = 1;
            started = false;
            continue;
        }else if (caracteres[i] === '*' && skipLine === false) {
            cells[i] = caracteres[i];
        }else if (caracteres[i] === ' ' && skipLine === false) {
            cells[i] = caracteres[i];
        }else if (caracteres[i] === '*' && skipLine === true) {
            var initPosition = lines * 27;
            if (started === false){
                cells[initPosition] = caracteres[i];
                started = true;
            }else if (started === true){
                cells[initPosition + nextPosition] = caracteres[i];
                nextPosition++
            }

        }else if (caracteres[i] === ' ' && skipLine === true) {
            var initPosition = lines * 27;
            if (started === false){
                cells[initPosition] = caracteres[i];
                started = true;
            }else if (started === true){
                cells[initPosition + nextPosition] = caracteres[i];
                nextPosition++
                if (nextPosition > 26){
                    nextPosition = 1;
                    started = false;
                }
            }

        }
            
    }   
    return cells;
}

function printFrame() {

    var frame = `
    []===========================[]` + `
    ||`+cells[0]+cells[1]+cells[2]+cells[3]+cells[4]+cells[5]+cells[6]+cells[7]+cells[8]+cells[9]+cells[10]+cells[11]+cells[12]+cells[13]+cells[14]+cells[15]+cells[16]+cells[17]+cells[18]+cells[19]+cells[20]+cells[21]+cells[22]+cells[23]+cells[24]+cells[25]+cells[26]+`||` + `
    ||`+cells[27]+cells[28]+cells[29]+cells[30]+cells[31]+cells[32]+cells[33]+cells[34]+cells[35]+cells[36]+cells[37]+cells[38]+cells[39]+cells[40]+cells[41]+cells[42]+cells[43]+cells[44]+cells[45]+cells[46]+cells[47]+cells[48]+cells[49]+cells[50]+cells[51]+cells[52]+cells[53]+`||` + `
    ||`+cells[54]+cells[55]+cells[56]+cells[57]+cells[58]+cells[59]+cells[60]+cells[61]+cells[62]+cells[63]+cells[64]+cells[65]+cells[66]+cells[67]+cells[68]+cells[69]+cells[70]+cells[71]+cells[72]+cells[73]+cells[74]+cells[75]+cells[76]+cells[77]+cells[78]+cells[79]+cells[80]+ `||` + `
    ||`+cells[81]+cells[82]+cells[83]+cells[84]+cells[85]+cells[86]+cells[87]+cells[88]+cells[89]+cells[90]+cells[91]+cells[92]+cells[93]+cells[94]+cells[95]+cells[96]+cells[97]+cells[98]+cells[99]+cells[100]+cells[101]+cells[102]+cells[103]+cells[104]+cells[105]+cells[106]+cells[107]+ `||` + `
    ||`+cells[108]+cells[109]+cells[110]+cells[111]+cells[112]+cells[113]+cells[114]+cells[115]+cells[116]+cells[117]+cells[118]+cells[119]+cells[120]+cells[121]+cells[122]+cells[123]+cells[124]+cells[125]+cells[126]+cells[127]+cells[128]+cells[129]+cells[130]+cells[131]+cells[132]+cells[133]+cells[134]+`||` + `
    ||`+cells[135]+cells[136]+cells[137]+cells[138]+cells[139]+cells[140]+cells[141]+cells[142]+cells[143]+cells[144]+cells[145]+cells[146]+cells[147]+cells[148]+cells[149]+cells[150]+cells[151]+cells[152]+cells[153]+cells[154]+cells[155]+cells[156]+cells[157]+cells[158]+cells[159]+cells[160]+cells[161]+`||` + `
    ||`+cells[162]+cells[163]+cells[164]+cells[165]+cells[166]+cells[167]+cells[168]+cells[169]+cells[170]+cells[171]+cells[172]+cells[173]+cells[174]+cells[175]+cells[176]+cells[177]+cells[178]+cells[179]+cells[180]+cells[181]+cells[182]+cells[183]+cells[184]+cells[185]+cells[186]+cells[187]+cells[188]+`||` + `
    ||`+cells[189]+cells[190]+cells[191]+cells[192]+cells[193]+cells[194]+cells[195]+cells[196]+cells[197]+cells[198]+cells[199]+cells[200]+cells[201]+cells[202]+cells[203]+cells[204]+cells[205]+cells[206]+cells[207]+cells[208]+cells[209]+cells[210]+cells[211]+cells[212]+cells[213]+cells[214]+cells[215]+`||` + `
    ||`+cells[216]+cells[217]+cells[218]+cells[219]+cells[220]+cells[221]+cells[222]+cells[223]+cells[224]+cells[225]+cells[226]+cells[227]+cells[228]+cells[229]+cells[230]+cells[231]+cells[232]+cells[233]+cells[234]+cells[235]+cells[236]+cells[237]+cells[238]+cells[239]+cells[240]+cells[241]+cells[242]+`||` + `
    ||`+cells[243]+cells[244]+cells[245]+cells[246]+cells[247]+cells[248]+cells[249]+cells[250]+cells[251]+cells[252]+cells[253]+cells[254]+cells[255]+cells[256]+cells[257]+cells[258]+cells[259]+cells[260]+cells[261]+cells[262]+cells[263]+cells[264]+cells[265]+cells[266]+cells[267]+cells[268]+cells[269]+`||` + `
    ||`+cells[270]+cells[271]+cells[272]+cells[273]+cells[274]+cells[275]+cells[276]+cells[277]+cells[278]+cells[279]+cells[280]+cells[281]+cells[282]+cells[283]+cells[284]+cells[285]+cells[286]+cells[287]+cells[288]+cells[289]+cells[290]+cells[291]+cells[292]+cells[293]+cells[294]+cells[295]+cells[296]+`||` + `
    ||`+cells[297]+cells[298]+cells[299]+cells[300]+cells[301]+cells[302]+cells[303]+cells[304]+cells[305]+cells[306]+cells[307]+cells[308]+cells[309]+cells[310]+cells[311]+cells[312]+cells[313]+cells[314]+cells[315]+cells[316]+cells[317]+cells[318]+cells[319]+cells[320]+cells[321]+cells[322]+cells[323]+`||` + `
    ||`+cells[324]+cells[325]+cells[326]+cells[327]+cells[328]+cells[329]+cells[330]+cells[331]+cells[332]+cells[333]+cells[334]+cells[335]+cells[336]+cells[337]+cells[338]+cells[339]+cells[340]+cells[341]+cells[342]+cells[343]+cells[344]+cells[345]+cells[346]+cells[347]+cells[348]+cells[349]+cells[350]+`||` + `
    ||`+cells[351]+cells[352]+cells[353]+cells[354]+cells[355]+cells[356]+cells[357]+cells[358]+cells[359]+cells[360]+cells[361]+cells[362]+cells[363]+cells[364]+cells[365]+cells[366]+cells[367]+cells[368]+cells[369]+cells[370]+cells[371]+cells[372]+cells[373]+cells[374]+cells[375]+cells[376]+cells[377]+`||` + `
    ||`+cells[378]+cells[379]+cells[380]+cells[381]+cells[382]+cells[383]+cells[384]+cells[385]+cells[386]+cells[387]+cells[388]+cells[389]+cells[390]+cells[391]+cells[392]+cells[393]+cells[394]+cells[395]+cells[396]+cells[397]+cells[398]+cells[399]+cells[400]+cells[401]+cells[402]+cells[403]+cells[404]+`||`+ ` 
    []===========================[]
    `;

    var fileContentPre = document.getElementById('fileContent'); //accedemos al pre de html para establecer el contenido ahi
    fileContentPre.textContent = frame;

}

  
function findFluid() { // buscamos la posicion exacta de cada "particula" de fluido
    particlePosition = [];
    for (let i = 0; i < 404; i++) {
        if (cells[i] === '*'){
            particlePosition.push(i);
        }
    }
    return particlePosition;
}

function gForce() { // representa la "gravedad" que hace que el fluido caiga
    var particleNumber = particlePosition.length;
    let endBorder = [378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404];

    for (let i = 0; i <= particleNumber; i++){
        let newParticlePosition = particlePosition[i];

        if (endBorder.indexOf(newParticlePosition) !== -1){ //comprueba que ha llegado al final
            //cells[newParticlePosition] = '*';
            continue
        }else if (cells[newParticlePosition+27] === ' ' && cells[newParticlePosition+27] <= 404){ //comprueba si puede caer
            cells[newParticlePosition] = ' ';
            cells[newParticlePosition+27] = '*';
        }
    }
    return cells;

}

function colision(){ // funcion que controla la colision lateral de las particulas y su desplazamiento
    var particleNumber = particlePosition.length;
    console.log('Numero de part: ' + particleNumber)
    for (let i = 0; i <= particleNumber; i++){
        
        var numeroAleatorio = Math.floor(Math.random() * 2) + 1; // 1 es izq y 2 es drch (elije si la particula va ir hacia un lado u otro aleatoriamente)
        var newParticlePosition = 0;
        newParticlePosition = particlePosition[i];
        console.log('Valor que obtiene: ' + newParticlePosition)
        console.log('Valor que esta en 0: ' + particlePosition[0])
        console.log('Valor que esta en 1: ' + particlePosition[1])
        console.log(i)
        if (numeroAleatorio === 2){
            if (rightBorder.indexOf(newParticlePosition) !== -1){ //si esta en el borde drch no puede moverse mas
                cells[newParticlePosition] = '*';
            }else{
                if (cells[newParticlePosition+1] === ' '){
                    cells[newParticlePosition] = ' ';
                    cells[newParticlePosition+1] = '*';
                }else{
                    cells[newParticlePosition] = '*';
                }
            }
        }else if (numeroAleatorio === 1 ){
            if (leftBorder.indexOf(newParticlePosition) !== -1){ //si esta en el borde izq no puede moverse mas
                cells[newParticlePosition] = '*';    
            }else{
                if (cells[newParticlePosition-1] === ' '){
                    cells[newParticlePosition] = ' ';
                    cells[newParticlePosition-1] = '*';
                }else{
                    cells[newParticlePosition] = '*';
                }
            }
        }
        
    }
    return cells;
}