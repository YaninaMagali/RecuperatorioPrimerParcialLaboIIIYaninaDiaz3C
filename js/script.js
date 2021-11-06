var materias = [];
const cabeceraParams = ["Id" ,"Nombre", "Cuatrimestre", "Fecha Final", "Turno"];

function getMaterias(funcionExito, funcionError){

    var request = new XMLHttpRequest();

    request.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var response = this.response;
            materias = JSON.parse(response);
            funcionExito(materias);
        }
        else if(this.readyState == 4 && this.status != 200){
            funcionError(false);
        }
    }
    request.open("GET", "http://localhost:3000/materias", true);
    request.setRequestHeader('Content-type', 'application/json');
    request.send();
}

function PostModificarMateria(funcionExito, funcionError)
{
    var aux = GetDataDelForm();

    if(aux != null 
        && ValidarNombre(aux.nombre) 
        && ValidarTurno()
        && ValidarFecha()
        ) 
    {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("divSpinner").hidden = true;
                funcionExito(aux);
                //console.log("OK");
            }
            else if(this.readyState != 4){
                document.getElementById("divSpinner").hidden = false;
            }
            else if(this.readyState == 4 && this.status != 200){    
                funcionError(false);
                //console.log("NOT OK");
            }
        }
        request.open("POST", "http://localhost:3000/editar", true);
        request.setRequestHeader('Content-type', 'application/json');
        request.send(JSON.stringify(aux));
}}

function deletePost(funcionExito, funcionError){

    var aux = GetDataDelForm();

    if(aux != null){
        var request = new XMLHttpRequest();

        request.onreadystatechange = function()
        {
            console.log(this.readyState);
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("divSpinner").hidden = true;
                funcionExito(aux);
            }
            else if(this.readyState != 4){
                document.getElementById("divSpinner").hidden = false;
            }
            else if(this.readyState == 4 && this.status != 200){    
                funcionError(false);
            }
        }
        request.open("POST", "http://localhost:3000/eliminar", true);
        request.setRequestHeader('Content-type', 'application/json');
        request.send(JSON.stringify(aux));
    }
}

function CrearTabla(idTabla, cabeceraParams) 
{
    var tabla = document.getElementById(idTabla);

    if (tabla === null)
    {
        tabla = document.createElement("table");
        tabla.setAttribute("id", idTabla);
        tabla.setAttribute("class", "Tabla");
        let container = document.getElementById("id_div_tabla");
        container.appendChild(tabla);
        let cabecera = CrearCabeceraTabla(cabeceraParams);
        tabla.appendChild(cabecera);
        tbody = document.createElement("tbody");
        tbody.setAttribute("id", "id_tbody");
        tabla.appendChild(tbody);
    }
    return tabla;
}

function CrearCabeceraTabla(cabeceraData) 
{
    let fila = document.createElement("tr");
    for(i = 0; i<cabeceraData.length;i++)
    {
        let col = document.createElement("th");
        let lbl = document.createTextNode(cabeceraData[i]);
        col.appendChild(lbl);
        fila.appendChild(col); 
        if(i == 0)
        {
            col.setAttribute("type", "hidden");
        }
    }

    return fila;
}

function AgregarFila(materia) 
{
    var idTabla = "id_tabla"
    var tabla = document.getElementById(idTabla);
    

    if (tabla == null)
    {
        tabla = CrearTabla(idTabla, cabeceraParams);
    }

    if (materia != null)
    {
        var tbody = document.getElementById("id_tbody");
        var fila = document.createElement("tr");
        fila.setAttribute("id", "id_fila" + materia.id);
        fila.setAttribute("name", "name_fila"+ materia.id);
        cols = [materia.id, materia.nombre, materia.cuatrimestre, materia.fechaFinal, materia.turno];
        cols.forEach(element =>
        {
            var col = document.createElement("td");
            var lbl = document.createTextNode(element);
            col.appendChild(lbl);
            fila.appendChild(col);
        })

        fila.addEventListener("dblclick", (e)=>{
            MostrarModal(materia)});

            tbody.appendChild(fila);
    }
    return fila;

}

function CargarTablaMaterias(materias)
{
    materias.forEach(element => {
        AgregarFila(element);
    })

}

function funcionError() {
    console.log("Se ejecuta la funcionError() ");
}

function ValidarNombre(nombre)
{
    var validacion = true;
    if(nombre.length < 6)
    {
        document.getElementById('id_nombre').style.borderColor = "red";
        validacion = false;
    }
    return validacion;
}

function ValidarTurno()
{
    var validacion = true;
    var tm = document.getElementById('id_Maniana');
    var tn = document.getElementById('id_Noche');

    if(tm.checked == false && tn.checked == false)
    {
        document.getElementById('divTurno').style.borderColor = "red";
        validacion = false;
    }
    return validacion;
}

function ValidarFecha()
{
    var validacion = true;
    var fechaAValidar = document.getElementById('id_fecha');
    var fechaAValidarAux = new Date(fechaAValidar.value);

    var fechaAux = new Date();
    var fechaActual = fechaAux.getFullYear()+'-'+(fechaAux.getMonth()+1)+'-'+fechaAux.getDate();

    console.log(fechaActual);
    console.log(fechaAValidar.value);
    if(Date.parse(fechaAValidarAux) < Date.parse(fechaActual))
    {
        fechaAValidar.style.borderColor = "red";
        validacion = false;
    }
    return validacion;
}

function GetDataDelForm(){
    console.log("GetDataDelForm");
    var id = document.getElementById("id_id").value;
    var nombre = document.getElementById("id_nombre").value;
    var cuatri  = document.getElementById("id_cuatri").value;
    var fecha = document.getElementById("id_fecha").value;
    //console.log(fecha);
    var turno;
    
    if(document.getElementById("id_Maniana") == "Maniana"){
        turno = "Maniana";
    }
    else{
        turno = "Noche";
    }

    return {id: id, nombre: nombre, cuatrimestre: cuatri, fechaFinal: fecha, turno: turno};
}

function getMateriasPromise(){
    promise = new Promise(getMaterias);
    promise.then(CargarTablaMaterias).catch(funcionError);
}

function ReemplazarFila(materia) {
    var filaAux = AgregarFila(materia);
    var filaActual = document.getElementById("id_fila"+materia.id);
    filaActual.replaceWith(filaAux);
}

function RemoverFila(materia){
    var filaActual = document.getElementById("id_fila"+materia.id);

    if (filaActual.parentNode) {
        filaActual.parentNode.removeChild(filaActual);
        console.log("remuevi");
      }
}


function PostModificarPromise(){
    promise = new Promise(PostModificarMateria);
    promise.then(ReemplazarFila).catch(funcionError);
}

function deletePromise() {
    promise = new Promise(deletePost);
    promise.then(RemoverFila).catch(funcionError);
}

    window.addEventListener("load", function () {
        this.getMateriasPromise();

    
        // var addBtn = document.getElementById("id_btn_abrir_form_registro");
        // addBtn.addEventListener("click", (e)=>{
        //     MostrarModal();
        // });
    
      });
    