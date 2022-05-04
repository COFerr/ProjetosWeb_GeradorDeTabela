function gerarTabela(){

  //Armazenar os times digitados na textArea em entradaTimes
  entradaTimes = document.getElementById('time').value;
  entradaTimes = entradaTimes.split('\n')

  //Organiza a entrada dos times em um array de objetos time
  times = []
  let time = {
    nome: '',
    estado: ''
  }
  function criarTime(nome,estado){
    return{
      nome: nome,
      estado: estado
    }
  }
  for(i=0; i<entradaTimes.length;i++){
    times[i] = criarTime(entradaTimes[i].split(';')[0], entradaTimes[i].split(';')[1]);
  }
  
  //criação do obejto jogo
  let jogo = {
    timeCasa: '',
    timeVisitante:'',
    localDoJogo: '',
    rodada: ''
  }
  //factory function para criar o objeto jogo
  function criarJogo(timeCasa,timeVisitante, localDoJogo, rodada){
    return{
      timeCasa: timeCasa,
      timeVisitante: timeVisitante,
      localDoJogo: localDoJogo,
      rodada: rodada
    }    
  }
  //cria os jogos de ida e armazena em um array
  jogosDeIda = []
  t = times.length;
  m  = times.length / 2;
  contaJogos = 0;
  // t-1 é o número de rodadas do turno e m é o número de jogos por rodada
  while(contaJogos < (t-1)*m){
    for (i = 0; i < (t - 1); i++) {
      for (j = 0; j < m; j++){
        if (j % 2 == 1 || i % 2 == 1 && j == 0){
          jogosDeIda[contaJogos] = criarJogo(times[t-j-1].nome,times[j].nome, times[t-j-1].estado, i+1);
          contaJogos += 1;
        }  
        else{
          jogosDeIda[contaJogos] = criarJogo(times[j].nome,times[t-j-1].nome, times[j].estado, i+1);
          contaJogos += 1;
        }
      }
      //cicla o array times mantendo o times[0] no lugar
      ciclo = times.pop();
      times.splice(1,0,ciclo);
      }
  }
  //Armazena os jogos de volta invertendo mandante e estado
  jogosDeVolta = []
  for(i = 0 ; i < jogosDeIda.length; i++){
    emQueLugar = []
    for (j = 0; j < times.length; j++){
      //procura o visitante do jogo de ida no array de times, e armazena o estado no array emQueLugar
      if(jogosDeIda[i].timeVisitante == times[j].nome){
        emQueLugar[i] = times[j].estado;
        //cria o jogo de volta, invertendo times e local, a rodada é i + (t-1)
        jogosDeVolta[i] = criarJogo(jogosDeIda[i].timeVisitante,jogosDeIda[i].timeCasa,emQueLugar[i],jogosDeIda[i].rodada + times.length - 1);
      }   
    }
  }
  //o total de jogos é a concatenação de jogosDeIda com jogosDeVolta
  jogos = jogosDeIda.concat(jogosDeVolta);
  //o array tabelaCampeonato armazena cada jogo como deve ser exibido

  //Cria um vetor de booleanos para armazenar os jogos com rodada dupla
  rodadaDupla = []
  //para cada jogo, percorre o array de jogos verificando igualdade de local rodada e índice
  for(i=0; i < jogos.length; i++){
    for(j=0; j < jogos.length; j++){
      if(jogos[i].localDoJogo == jogos[j].localDoJogo && jogos[i].rodada == jogos[j].rodada && i !== j){
        //as posições em que a condição é satisfeita são assinaladas no array rodadaDupla
        rodadaDupla[i] = true;
        rodadaDupla[j] = true;
      }
    }
  }
  for(i=0; i< jogos.length; i++){
    if(rodadaDupla[i]){
      jogos[i].rodada = jogos[i].rodada + '(RODADA DUPLA)';
    }
  }

  tabelaCampeonato = []
  for(i=0;i < jogos.length; i++){
      tabelaCampeonato[i] = (jogos[i].timeCasa + ' x ' + jogos[i].timeVisitante + ' - ' + jogos[i].localDoJogo + ' - ' + 'rodada ' + jogos[i].rodada);    
  }
  //tabelaExibida é uma string, gerada a partir de tabelaCampeonato que será exibida em no label tabelaGerada
  tabelaExibida = tabelaCampeonato.join('\n');
  document.getElementById('tabelaGerada').innerText = "\n"+tabelaExibida

  //Criação do objeto placar do jogo
  placardoDoJogo = {
    golsDoTimeDaCasa : '',
    golsDoTimeVisitante : ''
  }
  //factory function para o objeto placar do jogo
  function gerarPlacarDoJogo(golsDoTimeDaCasa,golsDoTimeVisitante){
    return{
      golsDoTimeDaCasa : golsDoTimeDaCasa,
      golsDoTimeVisitante : golsDoTimeVisitante
    }
  }
  
  //Gera resultados aleatórios para os jogos e armazena em placarDosJogos
  placarDosJogos = [];
  for(i = 0; i < jogos.length; i++){
    placarDosJogos[i] = gerarPlacarDoJogo(Math.round(Math.random(0,10)*5), Math.round(Math.random(0,10)*5))
  }
  //imprime os placares gerados
  //for (i = 0 ; i < placarDosJogos.length; i++){
    //console.log(placarDosJogos[i]);
  //}

  //função que retorna uma string diferente a cada resultado possível para o jogo  
  function determinarVitoria(golsDoTimeDaCasa, golsDoTimeVisitante){
    if(golsDoTimeDaCasa > golsDoTimeVisitante){
      return 'timeDaCasa';
    }
    else if(golsDoTimeDaCasa < golsDoTimeVisitante){
      return 'timeVisitante'
    }
    else return 'empate'
  }

  //Array pontuacaoCampeonato armazena a pontuação de cada time baseado em sua posição no array times
  pontuacaoCampeonato = []
  for(i= 0; i<times.length; i++){
    pontuacaoCampeonato[i] = 0;
  }

  //Cada jogo é percorrido procurando o resultado e os times que pontuam são procurados no array times, para que sua posição no array times seja usada para atribuir pontuação

  //placarDosJogos e jogos tem o mesmo tamanho, logo, o placar também é atribuído ao jogo pela posição do objeto no array. Cada placar é aplicado à função determinarVitoria

  for(i = 0; i < placarDosJogos.length; i++){
    x = determinarVitoria(placarDosJogos[i].golsDoTimeDaCasa,placarDosJogos[i].golsDoTimeVisitante)
    //A string retornada é usada para determinar o vencedor ou o empate e atribuir pontuação a cada time.
    if (x == 'timeDaCasa'){
      for(j = 0; j < times.length; j++){
        if(jogos[i].timeCasa == times[j].nome){
          //console.log(j, ' - ', times[j].nome)
          //O time é procurado no array times e sua posição é usada para atribuir pontuação no array pontuacaoCampeonato.
          pontuacaoCampeonato[j]  += 3;
        }
      }
    }
    else if(x == 'timeVisitante'){
      for(j = 0; j < times.length; j++){
        if(jogos[i].timeVisitante == times[j].nome){
          //console.log(j, ' - ', times[j].nome)
          pontuacaoCampeonato[j] += 3;
        }
      }
    }
    else{
     //console.log(jogos[i].timeCasa, ' - ', jogos[i].timeVisitante)
      for(j = 0; j < times.length; j++){
       if(jogos[i].timeCasa == times[j].nome){
          //console.log(j, ' - ', times[j].nome, 'empate')
          pontuacaoCampeonato[j]  += 1;
        }
      }
      for(j = 0; j < times.length; j++){
        if(jogos[i].timeVisitante == times[j].nome){
          //console.log(j, ' - ', times[j].nome, 'empate')
          pontuacaoCampeonato[j] += 1;
        }
      }
    }
  }
  
  //imprime no console a pontuação de cada time no campeonato
  //for(i=0;i<pontuacaoCampeonato.length; i++){
    //console.log(pontuacaoCampeonato[i]);
  //}

  //função que retorna o índice do time que obtiver a maior pontuação
  function determinarCampeao(pontuacaoCampeonato){
    pontosMax = Math.max(...pontuacaoCampeonato) 
    return pontuacaoCampeonato.indexOf(pontosMax)
  }
  
  //usa a função para determinar o campeão
  indiceDoCampeao = determinarCampeao(pontuacaoCampeonato)
  campeao = times[indiceDoCampeao].nome

  //Exibe uma frase e o time campeão na tela(Comentado porque não dizia expressamente para exibir)
  //document.getElementById('quemEOCampeao').innerText = "\n"+ 'O campeão é o '+ campeao

  //imprime no console o time campeão
  //console.log(times[indiceDoCampeao].nome)
}