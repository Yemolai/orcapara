// variável que define se algum orçamento já foi carregado
var loaded=false;
var customizable = false;
var loaded_orca = {id: null, version: null, name: null};
var onSelectFunction, onDeselectFunction, onActivate;
// função de carregamento de orçamento em árvore
function loadOrca(id, version, on_ready_callback) {
  var treeData;
  var plugins = [];
  $.getJSON(fileUrl, "id="+id+"&version="+version, function( data ) {
    if (data.data.config) { // busca dados de configuração do orçamento
      config = data.data.config;
    }
    else { // se não encontrar, caia fora
      // TODO informar na página que não foi possível conectar ao servidor
      $.alert("Não foi possível conectar ao servidor");
      return false;
    }
    // Altera título para o nome do orçamento atualmente aberto
    $(titulo).text(config.name);
    customizable = (config.customizable==true) ? true : false;
    if (config.customizable) { // orçamento é customizável?
      // use estas configurações
      onSelectFunction = selectCustomizable;
      onDeselectFunction = deselectCustomizable;
      plugins.push("checkbox", "changed");
      $("#detailsToolbar").show();
      $("#qtd-header").show();
    }
    else {
      // define a função de onChange (quando muda algo na árvore)
      onSelectFunction = selectNotCustomizable;
      onDeselectFunction = function(){}; // nunca usada
      $("#qtd-header").show();
      $("#detailsToolbar").hide();
    }
    if (data.data && data.data.tree) {
      treeData = data.data.tree;
      if (loaded) { // já foi carregado?
        $(arvore).jstree(true).destroy(); // então destrua antes de preencher
        $("[id^='item']").remove();
        $("#detalhes").hide();
        $("#total").text("");
        if (subtotal) subtotal=0.00;
      }
      $("#arvore").addClass("jstree-no-icons"); // garanta que não terá ícones
      $(arvore).jstree({ // inicializa uma instância de árvore
        "core":{ // opções do núcleo base da árvore
          "data": treeData, // dados da árvore
          "icons": false, // desativa ícones (isso nunca funciona)
          "stripes": true, // faz o fundo ficar listrado (também não funciona)
          "responsive": true, // ajusta o conteúdo quando o container muda
          "multiple": config.customizable,// (não) permite selecionar vários nós
          "error": function (err) { // error handling function
            console.log("jstreeError:",err); // no momento só escreve no console
          }// fim da função de erro
        },
        "plugins": plugins // lista de plugins a serem utilizados
      });
      recordLastOpened(id, version);
      loaded = true;// já foi carregado uma vez!
      if (typeof on_ready_callback !== 'undefined') {
        $(arvore).on('ready.jstree', function () {
          removeBranchCheckbox();
          on_ready_callback();
        });
      } else {
        $(arvore).on('ready.jstree', removeBranchCheckbox);
        $(arvore).on('select_node.jstree', onSelectFunction); // use a função em select_node
        $(arvore).on('deselect_node.jstree', onDeselectFunction); // função para deselect_node
        $(arvore).on('activate_node.jstree', onActivateFunction);
      }
      $("#abrir, #salvar").prop('disabled', !config.customizable);// botões!
    }
    $("[id^='file-']").remove();
    if (data.data.files && data.data.files.length>0) {
      $("#anexos").prop('disabled', false);
      for (var idx in data.data.files) {
        arquivo = data.data.files[idx];
        var filename = arquivo.split('/').pop();
        var extension;
        switch (filename.split('.').pop().toLowerCase()) {
          case 'pdf':
            extension = "fa-file-pdf-o";
            break;
          case 'ods':
          case 'xls':
          case 'xlsx':
            extension = "fa-file-excel-o";
            break;
          case 'odt':
          case 'doc':
          case 'docx':
            extension = "fa-file-word-o";
            break;
          default:
            extension = "fa-file-o";
        }
        filename = filename.split('.').shift();
        var icone = $("<i/>", { class: "fa fa-fw " + extension });
        var link = $("<a/>", { href: arquivo, text: " " + filename })
          .prepend(icone);
        var li = $("<li/>", {id: "file-" + filename.replace(/\s/g, '-')})
          .append(link);
        $("#anexo-list").append(li);
      }
      loaded_orca.id = id;
      loaded_orca.version = config.version;
      loaded_orca.name = config.name;
    } else {
      $("#anexos").prop('disabled', true);
    }
  }); // Get JSON

  $.getJSON(fileUrl, "id="+id+"&version=list", function( res ) {
    var versionList = eval('[' + res.data + ']');
    if (versionList.length > 1) {
      $("li[id^=orca-version-]").remove();
      $("#versions-button").prop('disabled', false);
      $("#versions-button>i.fa-caret-down").show();
      for (var i = 0; i < versionList.length; i++) {
        if ((i == version) || (versionList[i] == version)) {
          $("#versionName")
            .empty()
            .text((""+versionList[i]).replace(/([0-9]+)\.([0-9]+)/, "$2/$1"));
          continue;
        }
        var li = $("<li/>", {id: "orca-version-" + versionList[i]});
        $("<a/>", {
          class: "text-right",
          href: "#",
          onclick: "loadOrca(" + id + ",'" + versionList[i] + "')",
          text: (""+versionList[i]).replace(/([0-9]+)\.([0-9]+)/, "$2/$1")
        })
          .appendTo(li);
        $("ul#version-list").append(li);
      }
    } else {
      $("li[id^=orca-version-]").remove();
      $("#versions-button").prop('disabled', true);
      $("#versions-button>i.fa-caret-down").hide();
      $("#versionName")
        .empty()
        .text((""+versionList[0]).replace(/([0-9]+)\.([0-9]+)/, "$2/$1"));
    }
  });
  $("#Orcaname").empty().text("Novo orçamento");
}

/**
 * Esta função é utilizada para desabilitar as checkbox de todos os nós com
 * filhos para evitar que o usuário marque múltiplos itens acidentalmente.
 */
function removeBranchCheckbox() {
  var get_json_options = {
    'flat': 1,
    'no_data': 1,
    'no_state': 1,
  }
  var AllNodes = $(arvore).jstree(1).get_json("*", get_json_options);
  if (!customizable) return 1;
  for (var i = 0; i < AllNodes.length; i++) {
    var nodeId = AllNodes[i].id;
    if (!$(arvore).jstree(1).is_leaf(nodeId)) {
      $(arvore).jstree(1).disable_checkbox(nodeId);
    }
  }
}

/**
 * Executa a gravação no banco de dados interno do último orçamento aberto
 */
function recordLastOpened(id, version) {
  localStorage.setItem("LastOpened", JSON.stringify({'id': id, 'version': version}));
}

function rememberLastOpened() {
  var last = localStorage.getItem("LastOpened");
  if (last) {
    return JSON.parse(last);
  } else {
    return false;
  }
}
