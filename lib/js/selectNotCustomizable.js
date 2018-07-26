// function to select items in not customizable lists
function selectNotCustomizable(e, data) {
  var hierarquiaDeNós = [], nóSelecionado = data.selected[0];
  hierarquiaDeNós.push($(arvore).jstree(1).get_node(nóSelecionado));
  while (hierarquiaDeNós[0].parent != "#") {
    nomeDoPai = hierarquiaDeNós[0].parent;
    nóPai = $(arvore).jstree(1).get_node(nomeDoPai);
    hierarquiaDeNós.unshift(nóPai);
  }
  $("#total").empty();
  $("[id^=item]").remove()
  var éFolha = $(arvore).jstree(1).is_leaf(nóSelecionado);
  // processamento de folha
  for(var id = 0; id < hierarquiaDeNós.length; id++) {
    var nó = hierarquiaDeNós[id];
    var emptyHeader = $("<th/>");
    if ($(arvore).jstree(1).is_leaf(nó)) {
      // última iteração
      var tr = {
        t: nó.text.split(/\s[0-9]+(\.[0-9]+)?\sx\sR\$/).shift(),
        v: formatNum(nó.original.valor),
        s: formatNum(nó.original.valor * nó.original.qtd),
        q: formatNum(nó.original.qtd),
        u: nó.text.split('R$').pop().split('/'),
        c: nó.text.split(' ').shift()
      }
      tr.u.shift(); // remove começo do texto da unidade
      var _r = "text-right";
      $("#lastRow").before( // add tr before lastRow
        $("<tr/>", {
          id: "item-" + nó.id.replace(/\./g, '-')
        }) // tr def end
        .append(
          _td(nó.id), // Item ID
          _td(tr.c), // Código
          _td(tr.t), // texto descritivo
          _td(tr.q, _r), // quantidade / Qtd
          _td(tr.u, _r), // Unidade / Un
          _td(tr.v, _r), // Valor do item
          _td(tr.s, _r) // Subtotal do item
        ) // append end
      );
    } else {
      // iteração de cabeçalhos
      $("#lastRow").before( // add tr before lastRow
        $("<tr/>", {
          id: "item-" + nó.id.replace(/\./g, '-'),
          class: 'hover-link'
        }) // tr def end
        .append(
          $("<th/>", {text: nó.id}), // id for 1st col
          emptyHeader.clone(1, 1),
          $("<th/>", {text: nó.text}), // name for 3rd col
          emptyHeader.clone(1, 1),
          emptyHeader.clone(1, 1),
          emptyHeader.clone(1, 1),
          emptyHeader.clone(1, 1)
        ) // append end
        .on('click',null, {id: nó.id}, function (e) {
          $(arvore).jstree(1).deselect_all();
          $(arvore).jstree(1).select_node(e.data.id);

        })
      );
    }
  }
  if (tr) $("#total").empty().text(tr.s);
  // fim do processamento de folha e hierarquia superior
  if (!éFolha) {
    // processamento de galho
    // se não for um galho selecionado, processar subitens do galho

  }
  $("#detalhes, #dtl").show();
  // console.log("hierarquia: ", hierarquiaDeNós);
}

// HELPER FUNCTIONS

function formatNum(num) {
  if (typeof num != 'number') {
    num = parseFloat(num);
  }
  if (isNaN(num)) {
    console.log("num " + num + "is NaN");
    return "0,00";
  }
  strNum = num.toFixed(2).replace('.',',');
  numPattern = /([0-9]{1,3})([0-9]{3}[\.|,])/g;
  while(strNum.search(numPattern) > -1) {
    strNum = strNum.replace(numPattern, '$1.$2');
  }
  return strNum;
}

function _td(text, Class) {
  var attribs = {};
  if (typeof text != 'undefined') attribs.text = text;
  if (typeof Class != 'undefined') attribs.class = Class;
  return $("<td/>", attribs);
}
