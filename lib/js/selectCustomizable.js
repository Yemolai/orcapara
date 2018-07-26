// Helper functions

// td tag creator
function _td(Text, Class, Id) {
  var _props = {};
  if (isDef(Text)) _props.text = Text;
  if (isDef(Class)) _props.class = Class;
  if (isDef(Id)) _props.Id = Id;
  return $("<td/>", _props);
}

// Dot . to Comma ,
function _DtC(str) { return (''+str).replace('.', ',') }

// Comma , to Dot .
function _CtD(str) { return (''+str).replace(',', '.') }

// parse from string to Float
function _Flt(str) { return parseFloat(_CtD(str)) }

// parse from float to string rounded to 2 decimals
function _Str(float) { return _DtC(float.toFixed(2)) }

// check if variable isnt undefined (undefined? false, otherwise true)
function isDef(variable) { return !(typeof variable == 'undefined') }

// find the id of every selected node
function _already() {
  return $("td.item-id").map(function () {
    return $.trim($(this).text());
  }).toArray();
}

// transform 001.01.02 format in 001-01-02 format for element id
function _id(nodeId) { return nodeId.replace(/\./g,'-') }

// Globals
var _input = "<input type=\"number\" pattern=\"/[0-9]+([\\.,][0-9]+)?/\" \
  class=\"form-control\"  placeholder=\"número\" value=\"0\" />";

var subtotal = 0.00;

// Handlers:

var isClickedNodeLeaf = undefined;
var onActivateFunction = function (event, data) {
    isClickedNodeLeaf = $(arvore).jstree(true).is_leaf(data.node);
    if (!isClickedNodeLeaf) {
      var already = _already();
      $(arvore).jstree(true).deselect_all();
      $(arvore).jstree(true).select_node(already, false);
    }
}

function selectCustomizable(e, data) {
  // Adiciona os novos nós à lista
  var selected = data.selected,
      already = _already();

  $.each(selected, function (k, v) { // para cada nó novo
    if (already.indexOf(v) > -1) { return true } // se já existir, pula
    if (!data.instance.is_leaf(v)) { return true } // se não for folha, pula

    // usa os dados originais do nó
    var originalNode = data.instance.get_node(v).original,
        val = 0.00;
    // e enfileira uma função para pedir quantidade dos itens
    $("#detalhesTable").queue("addItem", function ( next ) {
      var Modal = $.confirm({ // janela de confirmação para pedir dados
        title: "Adicionar item",
        confirmButton: "Adicionar",
        cancelButton: "Cancelar",
        content: "Quantidade de " + originalNode.text + ":<br/>" + _input,
        confirm: function () {
          val = this.$content.find('input').val();
          if (val.trim() == '') { return false; }
          if (/[0-9]+([\.,][0-9]+)?/.test(val)) {
            val = parseFloat( _CtD(val) );
          }
          else { return false; }
          var data = originalNode,
              node = v,
              tr, // para arme
              _r = "R$",
              _s = ' ',
              _t = data.text,
              _tA= _t.split(' '),
              _right = "text-right",
              _valor = parseFloat(data.valor),
              _subtotal = val * _valor;
          $("#lastRow").before(
            $("<tr/>", { id: "item" + _id(node), }) // linha do item
            .append(
              _td (data.id, "item-id"), // ITEM
              _td (_tA[0]), // CODIGO
              _td (_tA.splice(1,(_tA.length-1)).join(_s).split(_s+_r).shift()), // Descrição
              _td (_DtC(val),_right,"qtd" + _id(node)), // Quantidade
              _td(_t.substr(_t.lastIndexOf('/')+1, _t.length), _right), // Unidade
              _td (_r + _Str(_valor), _right), // Valor
              _td (_r + _Str(_subtotal), _right) // Total
            )
          );

          subtotal += _subtotal; // adicione este subtotal ao subtotal
          $("#total").text(_Str(subtotal)); // atualize o subtotal
          $("#lastRow").before(tr); // ponha a linha deste item ao fim da tabela
          $(".table, #detalhes").show(); // garanta que esteja visível
          next();
        },
        cancel: function () {
          data.instance.deselect_node(v);
        },
        animation: 'scaleX', // animação de abertura do modal
        closeAnimation: 'scaleY', // animação de fechamento do modal
        animationBounce: 1, // quantas vezes a animação do modal pula
        theme: 'bootstrap' // tema do modal
      }); // confirmation modal
    });
  });
  //  inicializa execução em cadeia de lista de funções
  $("#detalhesTable").dequeue("addItem");
}

function deselectCustomizable(e, data) {
  // Remove da lista os nós deselecionados
  var selected = data.selected, // pegue a lista dos nós selecionados agora
      already = _already(), // liste os nós presentes na tabela
      // filtre para achar a diferença entre os na tabela e os selecionados
      goners = already.filter(function (x) { return selected.indexOf(x) < 0 });
  if (goners.length > 2) {
    $.confirm({
      title: 'Retirar todos estes nós?',
      confirmButton: "Remover",
      cancelButton: "Cancelar",
      content: "Tem certeza de que deseja remover estes " + goners.length +
      " itens do orçamento? Esta ação não pode ser desfeita.",
      confirm: function () {
        _removeNodes(e, data, goners);
      },
      cancel: function () {
        console.log("Remoção de " + goners.length + " cancelada.");
      }
    })
  } else {
    _removeNodes(e, data, goners);
  }
}

function _removeNodes(e, data, goners) {
  $.each(goners, function (k, v) { // para cada um dos removidos da seleção
    if (!data.instance.is_leaf(v)) { return true; } // se não for folha, ignore
    var originalNode = data.instance.get_node(v).original, // pegue a instância do nó
        qtd = _Flt($("#qtd"+_id(v)).text()); // leia quantidade do item
    subtotal -= qtd * originalNode.valor; // reduza valor deste item do subtotal
    $("#total").text(_Str(subtotal)); // atualize o subtotal
    $("#item" + _id(v)).remove(); // remova o item da tabela
    if ($("[id^=item]").length < 1) { // se não houverem itens, oculte a tabela
      $(".table, #detalhes").hide();
    }
  }); // end of each
}
