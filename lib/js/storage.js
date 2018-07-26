var _NOME_ORCAMENTO;

function saveOrc(action) {
  if (!loaded || loaded_orca.id == null) return false;
  var arvore = $('#arvore').jstree(true);
  var selected = arvore.get_selected();
  var selected_nodes = [];
  $.each(selected, function (k, v) {
    var qtd_id = "#qtd" + v.replace(/\./g,'-');
    selected_nodes.push({
      id: v,
      qtd: parseFloat($(qtd_id).text().replace(',', '.')),
    });
  });
  var OrcaFile = {
    orca: loaded_orca,
    file: selected_nodes
  };
  var saveableJSON = JSON.stringify(OrcaFile);
  /////// SWITCH CASE ACTION IN HERE
  switch (action) {
    // SAVING AS BEACHES
    case 'as':
      console.log("Saving as...");
      $.confirm({
        title: "Salvar orçamento como...",
        confirmButton: "Salvar",
        cancelButton: "Cancelar",
        content: "Nome deste novo orçamento:<br/>\
        <input type=\"text\" class=\"form-control\" \
        value=\"" + _NOME_ORCAMENTO + "\" />",
        confirm: function() {
          console.log("Save as... confirmed.");
          var nome = this.$content.find('input').val();
          if (nome.indexOf('_') > -1) {
            $.alert('Desculpe, não é permitido usar travessão no nome');
            return false;
          }
          if (window.localStorage.getItem('orca-' + nome) == null) {
            window.localStorage.setItem('orca-' + nome, saveableJSON);
            _NOME_ORCAMENTO = nome;
            $.alert("Orçamento salvo como \"" + _NOME_ORCAMENTO + "\".");
            return nome;
          } else {
            $.alert('Um orçamento com este nome já existe.');
            return false;
          }
        },
        cancel: function() {
          console.log("Save as... canceled.");
        }
      });
      break;
    case 'copy':
      console.log("Saving copy...");
      $.confirm({
        title: "Salvar cópia como...",
        confirmButton: "Salvar cópia",
        cancelButton: "Cancelar",
        content: "Nome para cópia deste orçamento:<br/>\
        <input type=\"text\" class=\"form-control\" \
        value=\"" + _NOME_ORCAMENTO + " - cópia\" />",
        confirm: function() {
          console.log("Save as... confirmed.");
          var nome = this.$content.find('input').val();
          if (nome.indexOf('_') > -1) {
            $.alert('Desculpe, não é permitido usar travessão no nome');
            return false;
          }
          if (window.localStorage.getItem('orca-' + nome) == null) {
            window.localStorage.setItem('orca-' + nome, saveableJSON);
            $.alert("Cópia do orçamento \"" + _NOME_ORCAMENTO + "\" salvo \
            como \"" + nome + "\".");
            return nome;
          } else {
            $.alert('Um orçamento com este nome já existe.');
            return false;
          }
        },
        cancel: function() {
          console.log("Save copy... canceled.");
        }
      });
      break;
    case 'rename':
      console.log("Renaming...");
      $.confirm({
        title: "Renomear...",
        confirmButton: "Renomear",
        cancelButton: "Cancelar",
        content: "Nome para cópia deste orçamento:<br/>\
        <input type=\"text\" class=\"form-control\" \
          value=\"" + _NOME_ORCAMENTO + "\" />",
        confirm: function() {
          console.log("Rename... confirmed.");
          var nome = this.$content.find('input').val();
          if (nome.indexOf('_') > -1) {
            $.alert('Desculpe, não é permitido usar travessão no nome');
            return false;
          }
          if (window.localStorage.getItem('orca-' + nome) == null) {
            window.localStorage.setItem('orca-' + nome, saveableJSON);
            window.localStorage.removeItem('orca-' + _NOME_ORCAMENTO);
            $.alert("Orçamento \"" + _NOME_ORCAMENTO + "\" renomeado\
            para \"" + nome + "\".");
            _NOME_ORCAMENTO = nome;
            return nome;
          } else {
            $.alert('Um orçamento com este nome já existe.');
            return false;
          }
        },
        cancel: function() {
          console.log("Rename... canceled.");
        }
      });
      break;
    default:
    console.log("Default case");
    if (typeof _NOME_ORCAMENTO == 'undefined') {
      ///////// Modal de confirmacão para perguntar nome do orçamento
      $.confirm({
        title: "Salvar orçamento",
        confirmButton: "Salvar",
        cancelButton: "Cancelar",
        content: "Nome deste orçamento:<br/>\
        <input type=\"text\" class=\"form-control\" \
          value=\"Meu orcamento\" />",
        confirm: function() {
          var nome = this.$content.find('input').val();
          if (nome.indexOf('_') > -1) {
            $.alert('Desculpe, não é permitido usar travessão no nome');
            return false;
          }
          if (window.localStorage.getItem('orca-' + nome) == null) {
            window.localStorage.setItem('orca-' + nome, saveableJSON);
            _NOME_ORCAMENTO = nome;
          } else {
            $.alert('Um orçamento com este nome já existe');
            return false;
          }
          carregarOrcamentosSalvos();
        },
        cancel: function () {
          console.log("Processo de salvar orçamento foi cancelado.");
        }
      });
    } else {
      window.localStorage.setItem("orca-" + _NOME_ORCAMENTO, selecionados);
      $.alert("Orçamento \"" + _NOME_ORCAMENTO + "\" salvo.");
    }
  }
}

var SAVED_ORCA = [];

function carregarOrcamentosSalvos() {
  var openBtnListDivider = $("#open-button-group>ul.dropdown-menu>li.divider");
  $("[id^=open-orca-]").remove();
  var SavedList = $("#open-button-group>ul");
  var orcamentos = [];
  SAVED_ORCA = [];
  for (var key in localStorage) {
    if (typeof localStorage[key] != "string") continue;
    var item = JSON.parse(localStorage[key] + "");
    var orca_defined = typeof item.orca !== 'undefined';
    var file_defined = typeof item.file !== 'undefined';
    if (item && orca_defined && file_defined) {
      SAVED_ORCA[key] = item;
      var li = $("<li/>", {
        id: "open-orca-" + key.replace('orca-','')
      });
      var a = $("<a/>", {
        href: "#",
        onclick: "loadSavedOrca('" + key + "')",
        text: key.replace('orca-','')
      });
      $(li).append(a);
      $(SavedList).append(li);
    }
  }
}

function loadSavedOrca(name) {
  subtotal = 0.00;
  var saved = JSON.parse(localStorage.getItem(name));
  if (!saved) {
    $.alert("Erro ao carregar orçamento.");
    return false;
  }
  var orca = saved.orca;
  loadOrca(orca.id, orca.version, function () {
    var itens = saved.file;
    var select_these = [];
    for (var k in itens) {
      var item = itens[k];
      var item_id = item.id.replace(/\./g,'-');
      $(arvore).jstree(true).select_node(item.id, true);
      if (!$(arvore).jstree(true).is_leaf(item.id)) continue;
      var node = $(arvore).jstree(true).get_node(item.id);
      var nodeText = node.original.text.split(' ');
      var ntl = nodeText.length;
      var descricao = nodeText.splice(1,(ntl-1)).join(' ').split(' R$').shift();
      var qtdString = (item.qtd+"").replace('.',',');
      var valorFloat = parseFloat(node.original.valor) * item.qtd;
      var valorStr  = (valorFloat.toFixed(2)).replace('.',',');
      var tr = $("<tr/>", {
        id: "item"+item_id,
      });

      var _id = $("<td/>", { text: item.id, class: 'item-id' });
      var _cod = $("<td/>", { text: nodeText[0] });
      var _desc = $("<td/>", { text: descricao });
      var _qtd = $("<td/>", { text: qtdString, id: "qtd"+item_id, class: "text-right" });
      var _val = $("<td/>", { text: "R$"+valorStr });

      tr.append(_id, _cod, _desc, _qtd, _val);
      $("#lastRow").before(tr);
      subtotal += valorFloat;
    }
    $("#Orcaname").empty().text(name.replace('orca-',''));
    _NOME_ORCAMENTO = name;
    $("#total").text((subtotal.toFixed(2)).replace('.',','));
    $(".table,#detalhes").show();
    $(arvore).on('select_node.jstree', onSelectFunction); // use a função em select_node
    $(arvore).on('deselect_node.jstree', onDeselectFunction); // função para deselect_node
  });
}

function deleteOrca() {
  if (!_NOME_ORCAMENTO) {
    $.alert("Não há orçamento aberto a ser excluído");
    return false;
  }
  $.confirm({
    title: "Excluir orçamento",
    content: "Tem certeza de que deseja excluir o orçamento '" +
    _NOME_ORCAMENTO.replace('orca-','') + "'? <br/> <strong>Esta ação não "+
    "poderá ser desfeita</strong>",
    confirmButton: "Apagar",
    cancelButton: "Cancelar",
    confirm: function () {
      localStorage.removeItem(_NOME_ORCAMENTO);
      _NOME_ORCAMENTO = null;
      loadOrca(loaded_orca.id, loaded_orca.version);
      carregarOrcamentosSalvos();
      $.alert({ title: "", content: "O orçamento foi apagado.", confirmButton: "Fechar."})
    },
    cancel: function () {
      $.alert({ title: "", content: "O orçamento não foi apagado.", confirmButton: "Fechar."});
    }
  })
}
