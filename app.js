mostrar_registros()
mostrar_boletos()
mostrar_parcelas()

function processar_retorno() {
    var arquivo = document.getElementById("input").files[0];

    document.getElementById("nome_arquivo").innerHTML = arquivo.name;

    document.getElementById('btn_conciliar').style.display = 'block';

    var reader = new FileReader();
    
    reader.readAsText(arquivo);
    
    reader.onload = function(e) {
        var texto_puro = e.target.result;
        var json = JSON.parse(texto_puro);
        mostrar_conteudo_json(json)
    };    
}

function mostrar_conteudo_json(json){
    let tbody = document.getElementById('tbody_conteudo_json');
    
    tbody.innerHTML = '';

    json.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.nosso_numero}</td>
                <td>${item.flg_pago}</td>
                <td>${item.data_pagto}</td>
                <td>${item.obs}</td>
                <td>${item.data_registro}</td>                
            </tr>`
    });
}

function mostrar_boletos(){
    fetch(`http://localhost:8000/api/boleto/`)
    .then(res => res.json())
    .then(data => {

        let tbody = document.getElementById('tbody_boletos')
        tbody.innerHTML = '';

        data.boletos.forEach(item => {            
            tbody.innerHTML += `
                <tr>
                <td>${item.nosso_numero}</td>
                <td>${item.parcela_id}</td>
                <td>${item.created_at}</td>           
                </tr>`
        });
    })
    .catch(err => console.log(err))
}

function mostrar_parcelas(){
    fetch(`http://localhost:8000/api/parcela/`)
    .then(res => res.json())
    .then(data => {

        let tbody = document.getElementById('tbody_parcelas')
        tbody.innerHTML = '';

        data.parcelas.forEach(item => {            
            tbody.innerHTML += `
                <tr>
                <td>${item.id}</td>
                <td>${item.flg_pago}</td>
                <td>${item.created_at}</td>           
                </tr>`
        });
    })
    .catch(err => console.log(err))
}

function conciliar_parcelas(){
    var arquivo = document.getElementById("input").files[0];

    document.getElementById("nome_arquivo").innerHTML = arquivo.name;

    var reader = new FileReader();
    
    reader.readAsText(arquivo);
    
    reader.onload = function(e) {
        var texto_puro = e.target.result;
        var json = JSON.parse(texto_puro);
        
        fetch('http://localhost:8000/api/conciliacao/', {        
            method: 'POST',
            headers: {
                // "Content-Type": "Application/Json",
                // 'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                json: json
            })
        })
        .then(res => res.json())
        .then(data => {
            alerta(data.response)
            mostrar_parcelas()
            mostrar_registros()
        })
        .catch(e => console.log(e))
    
    }; 
}

function mostrar_registros(){

    fetch(`http://localhost:8000/api/registrosWebService/`)
    .then(res => res.json())
    .then(data => {

        let tbody = document.getElementById('tbody_registrosWebService')
        tbody.innerHTML = '';

        data.registros_webservice.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.nosso_numero}</td>
                    <td>${item.flg_pago}</td>
                    <td>${item.data_pagto}</td>
                    <td>${item.obs}</td>
                    <td>${item.data_registro}</td>                
                </tr>`
        });
    })
    .catch(err => console.log(err))
}

function alerta(mensagem){
    Swal.fire({
        text: mensagem,
        showConfirmButton: false,
        timer: 2000
    })
}