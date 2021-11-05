function MostrarModal(materia) {
    console.log("MostrarModal");
    modal = document.getElementById("id_modal");
    var modificarBtn = document.getElementById("btn_modificar");
    var delBtn = document.getElementById("btn_delete");
    form = document.getElementById("form");

    if(materia != null){
        document.getElementById("id_id").value = materia.id;
        document.getElementById("id_nombre").value = materia.nombre;
        var fechaAux =  materia.fechaFinal.split("/");  
        document.getElementById("id_fecha").value = (fechaAux[2] + "-" + fechaAux[1] + "-" + fechaAux[0]);

        if (materia.turno == "Manana") {
            document.getElementById("id_Maniana").checked = true;
        }else {
            document.getElementById("id_Noche").checked = true;
        }
        
        modificarBtn.setAttribute("style", "display: block");
        delBtn.setAttribute("style", "display: block");

        modificarBtn.addEventListener("click", (e)=>{
            PostModificarPromise();
        });
        // delBtn.addEventListener("click", (e)=>{
        //     deletePromise();
        // });

        var closeBtn = document.getElementById("id_cerrar_modal");
        closeBtn.addEventListener("click", (e)=>{
            modal.close();
        });

        modal.show();
    }


}