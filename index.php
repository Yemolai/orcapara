<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE-edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="lib/img/favicon.png"/>
    <meta name="description" content="Lista de orçamentos e tabelas da SEDOP">
    <meta name="author" content="Romulo Gabriel Rodrigues">
    <title>OrçaPará</title>
  </head>
  <body>
    <?php include "libs.php" ?>
    <div id="wrapper">
      <!-- Menu lateral -->
      <div id="sidebar-wrapper">
        <ul id="sidebar-menu" class="sidebar-nav">
          <li class="sidebar-brand">
            <a class="text-center force-default-cursor"
                style="position: relative;" href="#">
              <img src="lib/img/halficon.png" alt="Logo"
                class="img-responsive" style="overflow: hidden; opacity: 0.9;">
            </a>
          </li>
          <li id="brand" class="sidebar-brand">
            <a href="#">
              <div class="brand-text">
                <p>ORÇAPARÁ</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <!-- /menu lateral -->

      <!-- Conteúdo da página -->
      <div id="page-content-wrapper">
        <div class="container-fluid">
          <!-- Tree and details box row start -->
          <div class="row">
            <div id="treeCol" class="col-md-5">
              <!-- Button toolbar -->
              <div class="btn-toolbar">
                <!-- First button group -->
                <div class="btn-group">
                  <!-- Sidebar toggle button -->
                  <button type="button" class="btn btn-default btn-sm" id="menu-toggle">
                    <i class="fa fa-lg fa-fw fa-bars"></i>
                  </button>
                </div>
                <div class="btn-group">
                  <!-- Versions dropdown button -->
                  <div class="btn-group">
                    <button id="versions-button" class="btn btn-primary btn-sm dropdown-toggle"
                    type="button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                      <i class="fa fa-lg fa-fw fa-clock-o">&nbsp;</i>
                      Versão&nbsp;
                      <span id="versionName">
                        Jun-2016
                      </span>
                      <i class="fa fa-fw fa-caret-down"></i>
                    </button>
                    <ul id="version-list" class="dropdown-menu">
                      <li><a href="#" style="cursor: default;">
                        <i class="fa fa-history fa-fw"></i>
                        Outras versões:</a></li>
                      <li role="separator" class="divider"></li>
                      <li id="orca-version-2016.04">
                        <a href="#" onclick="loadOrcaVersion('2016.04')">
                          Abr-2016
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="btn-group">
                    <button id="anexos" class="btn btn-success btn-sm dropdown-toggle"
                      type="button" data-toggle="dropdown" aria-haspopup="true"
                      aria-expanded="false">
                      <i class="fa fa-lg fa-fw fa-paperclip fa-rotate-180"></i>
                      <i class="fa fa-fw fa-caret-down"></i>
                    </button>
                    <ul id="anexo-list" class="dropdown-menu">
                      <li><a href="#">Anexos neste orçamento</a></li>
                      <li role="separator" class="divider"></li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- Button toolbar end -->
              <br>
              <h3>
                <span id="titulo"></span>
              </h3>
              <div id="arvore" class="jstree-no-icons" style="font-size: 80%;">
              </div>
            </div>
            <div class="col-md-6">
              <div id="detailsToolbar" class="btn-toolbar">
                <div class="btn-group">
                  <button id="OrcaName-button" class="btn btn-link btn-sm dropdown-toggle"
                    type="button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <i class="fa fa-lg fa-file-o"></i>&nbsp;
                    <span id="Orcaname" style="color: black; text-weight: bold;">
                    </span>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a href="#" onclick="newOrca()">
                        <i class="fa fa-asterisk"></i>&nbsp;Novo orçamento
                      </a>
                    </li>
                    <li>
                      <a href="#" onclick="saveOrc('rename')">
                        <i class="fa fa-pencil"></i>&nbsp;Renomear
                      </a>
                    </li>
                    <li>
                      <a href="#" onclick="deleteOrca()">
                        <i class="fa fa-trash"></i>&nbsp;Excluir
                      </a>
                    </li>
                  </ul>
                </div>
                <br><br>
                <div class="btn-group">
                  <!-- Second button group -->
                  <div class="btn-group">
                    <!-- Save dropdown button -->
                    <div class="btn-group">
                      <button id="salvar" class="btn btn-primary btn-sm dropdown-toggle"
                        type="button" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        <i class="fa fa-lg fa-fw fa-floppy-o" style="vertical-align: middle;"></i>
                      </button>
                      <!-- Save button options list -->
                      <ul class="dropdown-menu">
                        <li><a href="#" onclick="saveOrc()">Salvar</a></li>
                        <li><a href="#" onclick="saveOrc('as')">Salvar como</a></li>
                        <li><a href="#" onclick="saveOrc('copy')">Salvar cópia</a></li>
                      </ul>
                    </div>
                    <!-- Open dropdown button -->
                    <div id="open-button-group" class="btn-group">
                      <button id="abrir" class="btn btn-info btn-sm dropdown-toggle"
                        type="button" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        <i class="fa fa-lg fa-fw fa-folder-open-o"></i>
                      </button>
                      <!-- Open button options list -->
                      <ul class="dropdown-menu">
                        <li><a href="#"><i class="fa fa-folder-open-o"></i>Abrir</a></li>
                        <li role="separator" class="divider"></li>
                      </ul>
                    </div>

                    <!-- Print button -->
                    <div class="btn btn-default btn-sm" id="imprimir" onclick="printOrca();">
                      <i class="fa fa-lg fa-fw fa-print"></i>
                    </div>

                    <!-- Export dropdown button -->
                    <div id="exportar-group" class="btn-group">
                      <button id="exportar" class="btn btn-warning btn-sm dropdown-toggle"
                        type="button" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        <i class="fa fa-lg fa-fw fa-share-square-o fa-rotate-90"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a href="#">Exportar como</a></li>
                        <li role="separator" class="divider"></li>
                        <?php
                        $exprt_frmts = array(
                          array("ext"=>'PDF',  "icon"=>"pdf",   "text"=>"Documento portátil (PDF)"),
                          array("ext"=>'DOC',  "icon"=>"word",  "text"=>"Documento de texto do Word (DOC)"),
                          array("ext"=>'XLS',  "icon"=>"excel", "text"=>"Planilha de dados para Excel (XLS)"),
                          array("ext"=>'CSV',  "icon"=>"text",  "text"=>"Texto dividido por vírgulas (CSV)"),
                          array("ext"=>'JSON', "icon"=>"code",  "text"=>"Notação de objeto JS (JSON)"),
                          array("ext"=>'XML',  "icon"=>"code",  "text"=>"Notação de objeto XML (XML)")
                        );
                        foreach ($exprt_frmts as $frmt) { ?>
                        <li>
                          <a href="#" onclick="exportTo('<?php echo $frmt['ext']?>')">
                            <span class="fa fa-fw fa-file-<?php echo $frmt['icon']?>-o">
                            </span>
                            &nbsp; <?php echo $frmt['text']; ?>
                          </a>
                        </li>
                        <?php } ?>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div id="toPrint">
                <h1 id="tituloDetalhes"></h1>
                <div id="detalhes" class="detalhes">
                  <table id="dtl" class="table" style="font-size: 80%;">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Codigo</th>
                        <th>Descrição</th>
                        <th id="qtd-header" class="text-right">Qtd</th>
                        <th class="text-right">Un</th>
                        <th class="text-right">Valor</th>
                        <th class="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody id="detalhesTable">
                      <tr id="lastRow">
                        <td></td><td></td><td></td><td></td><td></td> <!-- 5 td -->
                        <td><strong>Subtotal:</strong></td>
                        <td class="text-right">R$<span id="total"></span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /conteúdo da página -->
    </div>
  </body>
</html>
