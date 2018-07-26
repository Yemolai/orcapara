// Globais
var fileUrl = "./file.php";
var orcaList = [];
var arvore, titulo, config;
//

// função de inicialização
$( document ).ready(function() {
  arvore = $("#arvore"), titulo = $("#titulo");
  $("#abrir, #salvar, #imprimir, #exportar, #anexos").prop('disabled', false);
  $("#qtd-header, .table").hide();
  // Atribuição de ocultar/mostrar menu ao botão
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });
  // Buscar o JSON da lista de orçamentos
  $.getJSON(fileUrl, "", function( data ) { // Busca a lista de orçamentos
    $.each( data.data, function (k, v) { // Escreve um li para cada
      orcaList[k] = v; // copia pro vetor global
      $("<li id='orca" + k + "'>\
          <a href=\"#\" onclick='loadOrca(" + k + ",0)'>" + v +
         "</a>\
        </li>").appendTo("#sidebar-menu"); // concatena no sidebar-menu
    });
    $("#abrir, #salvar, #imprimir, #exportar, #anexos").prop('disabled', false);
    if (orcaList.length>0) {
      var last;
      if (last = rememberLastOpened()) {
        loadOrca(last.id, last.version);
      } else {
        loadOrca(1, 0);
      }
      carregarOrcamentosSalvos();
    } else {
      // TODO escrever sobre a área da árvore que não foi possível conectar
      $.alert("Não há orçamentos disponíveis!");
    }
  });
});
