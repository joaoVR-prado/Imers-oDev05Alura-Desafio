let time = [];
const url = 'https://api.api-futebol.com.br/v1/campeonatos/10/tabela';
const token = 'live_196892e24d23bdda74b94dc735f63d'; //max 100 por dia.

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro de Rede: ${response.status}`);

    }
    return response.json();
  })
  .then(data => {
    time = [...data];
    exibirTabela();

  })
  .catch(error => {
    console.error('Erro ao consumir a API:', error);

  });

function adicionarVitoria(i){
    time[i].vitorias += 1;
    time[i].pontos +=3;
    time[i].jogos +=1;

};

function adicionarDerrota(i){
    time[i].derrotas += 1;
    time[i].jogos +=1;

};

function adicionarEmpate(indiceA, indiceB){
    time[indiceA].empates += 1;
    time[indiceA].pontos += 1;
    time[indiceA].jogos += 1;

    time[indiceB].empates += 1;
    time[indiceB].pontos += 1;
    time[indiceB].jogos += 1;

};

function quicksort(array) {
    if (array.length <= 1) {
        return array;
    }

    const pivot = array[Math.floor(array.length / 2)].pontos;
    const left = [];
    const right = [];
    const pivotArray = [];

    for (const time of array) {
        if (time.pontos > pivot) {
            left.push(time);
        } else if (time.pontos < pivot) {
            right.push(time);
        } else {
            pivotArray.push(time);
        }
    }
  
    const sortedPivotArray = pivotArray.sort((a, b) => {
        if (a.vitorias !== b.vitorias) {
            return b.vitorias - a.vitorias;
        } else if (a.saldo_gols !== b.saldo_gols) {
            return b.saldo_gols - a.saldo_gols;
        } else {
            return b.gols_pro - a.gols_pro;
        }
    });

    return quicksort(left).concat(sortedPivotArray, quicksort(right));
}


function exibirTime(){
    const selectA = document.getElementById("selectTimeA");
    selectA.innerHTML = "";
    const selectB = document.getElementById("selectTimeB");
    selectB.innerHTML = "";

    for (let i = 0; i < time.length; i++) {
        const optionA = document.createElement("option");
        optionA.text = time[i].time.nome_popular;
        optionA.value = i;
        selectA.add(optionA);

        const optionB = document.createElement("option");
        optionB.text = time[i].time.nome_popular;
        optionB.value = i;
        selectB.add(optionB);

    }

}

function mudarSaldo() {
    const idSelectA = Number(document.getElementById("selectTimeA").value);
    const idSelectB = Number(document.getElementById("selectTimeB").value);
    const golsSelectA = Number(document.getElementById("golsA").value);
    const golsSelectB = Number(document.getElementById("golsB").value);

    if(idSelectA == idSelectB){
        alert("Times iguais selecionados!");
        exibirTabela();

    } else{
        time[idSelectA].gols_pro += golsSelectA;
        time[idSelectA].gols_contra += golsSelectB;

        time[idSelectB].gols_pro += golsSelectB;
        time[idSelectB].gols_contra += golsSelectA;

        time[idSelectA].saldo_gols = time[idSelectA].gols_pro - time[idSelectA].gols_contra;
        time[idSelectB].saldo_gols = time[idSelectB].gols_pro - time[idSelectB].gols_contra;

        if (golsSelectA > golsSelectB) {
            adicionarVitoria(idSelectA);
            adicionarDerrota(idSelectB);
        } else if (golsSelectA < golsSelectB) {
            adicionarVitoria(idSelectB);
            adicionarDerrota(idSelectA);
        } else {
            adicionarEmpate(idSelectA, idSelectB);
        }

        exibirTabela();

    }

    
}

function exibirTabela(){
    const tabelaTimes = document.getElementById("tabelaTimes");
    tabelaTimes.innerHTML = "";
    exibirTime();

    time = quicksort(time);

    for(let i=0; i<time.length; i++){
        const tr = document.createElement("tr");

        const tdPosicao = document.createElement("td");
        const tdImg = document.createElement("td");
        const tdNome = document.createElement("td");
        const tdPontos = document.createElement("td");
        const tdJogos = document.createElement("td");
        const tdVitorias = document.createElement("td");
        const tdEmpates = document.createElement("td");
        const tdDerrotas = document.createElement("td");
        const tdgols_pro = document.createElement("td");
        const tdgols_contra = document.createElement("td");
        const tdsaldo_gols = document.createElement("td");

        const img = document.createElement("img");
        img.src = time[i].time.escudo;

        tdPosicao.textContent = i+1;
        tdNome.textContent = time[i].time.nome_popular;
        tdPontos.textContent = time[i].pontos;
        tdJogos.textContent = time[i].jogos;
        tdVitorias.textContent = time[i].vitorias;
        tdEmpates.textContent = time[i].empates;
        tdDerrotas.textContent = time[i].derrotas;
        tdgols_pro.textContent = time[i].gols_pro;
        tdgols_contra.textContent = time[i].gols_contra;
        tdsaldo_gols.textContent = time[i].saldo_gols;

        tr.appendChild(tdPosicao);
        tdImg.appendChild(img);
        tr.appendChild(tdImg);
        tr.appendChild(tdNome);
        tr.appendChild(tdPontos);
        tr.appendChild(tdJogos);
        tr.appendChild(tdVitorias);
        tr.appendChild(tdEmpates);
        tr.appendChild(tdDerrotas);
        tr.appendChild(tdgols_pro);
        tr.appendChild(tdgols_contra);
        tr.appendChild(tdsaldo_gols);
        tabelaTimes.appendChild(tr);

    }

}
