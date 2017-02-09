// Generated by CoffeeScript 1.10.0
(function() {
  var Templates;

  Templates = (function() {
    function Templates() {}

    Templates.prototype.getViewRenderer = function(viewType) {
      return this["render_" + viewType];
    };

    Templates.prototype.getViewModesButtons = function(scope) {
      var act, buttons;
      act = scope.action;
      buttons = {
        list: '<button class="btn btn-default" type="button" ng-click="action.setViewType(\'list\')"><i class="fa fa-list"></i></button>',
        form: '<button class="btn btn-default" type="button" ng-click="action.setViewType(\'form\')"><i class="fa fa-edit"></i></button>',
        calendar: '<button class="btn btn-default" type="button" ng-click="action.setViewType(\'calendar\')"><i class="fa fa-calendar"></i></button>',
        chart: '<button class="btn btn-default" type="button" ng-click="action.setViewType(\'chart\')"><i class="fa fa-bar-chart-o"></i></button>'
      };
      return buttons;
    };

    Templates.prototype.getViewButtons = function(scope) {
      var act, buttons, i, len, r, ref, vt;
      act = scope.action;
      buttons = this.getViewModesButtons(scope);
      r = [];
      ref = act.viewModes;
      for (i = 0, len = ref.length; i < len; i++) {
        vt = ref[i];
        r.push(buttons[vt]);
      }
      return '<div class="btn-group">' + r.join('') + '</div>';
    };

    Templates.prototype.gridDialog = function() {
      return "<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\n  <div class=\"modal-dialog modal-lg\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n        <h4 class=\"modal-title\" id=\"myModalLabel\">${field.caption}</h4>\n      </div>\n      <div class=\"modal-body\">\n<div class=\"row\">\n<!-- view content -->\n</div>\n<div class=\"clearfix\"></div>\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-primary\" type=\"button\" ng-click=\"save()\" ng-show=\"dataSource.changing\">" + (Katrid.i18n.gettext('Save')) + "</button>\n        <button type=\"button\" class=\"btn btn-default\" type=\"button\" data-dismiss=\"modal\" ng-show=\"dataSource.changing\">" + (Katrid.i18n.gettext('Cancel')) + "</button>\n        <button type=\"button\" class=\"btn btn-default\" type=\"button\" data-dismiss=\"modal\" ng-show=\"!dataSource.changing\">" + (Katrid.i18n.gettext('Close')) + "</button>\n      </div>\n    </div>\n  </div>\n</div>";
    };

    Templates.prototype.preRender_form = function(scope, html) {
      var act, actions, buttons, confirmation, i, len, ref;
      buttons = this.getViewButtons(scope);
      actions = '';
      if (scope.view.view_actions) {
        ref = scope.view.view_actions;
        for (i = 0, len = ref.length; i < len; i++) {
          act = ref[i];
          if (act.confirm) {
            confirmation = ", '" + act.confirm + "'";
          } else {
            confirmation = '';
          }
          actions += "<li><a href=\"javascript:void(0)\" ng-click=\"action.doViewAction('" + act.name + "', record.id" + confirmation + ")\">" + act.title + "</a></li>";
        }
      }
      return "<div ng-form=\"form\"><div class=\"data-heading panel panel-default\">\n    <div class=\"panel-body\">\n      <div>\n        <a href=\"javascript:void(0)\" title=\"Add to favorite\"><i class=\"fa star fa-star-o pull-right\"></i></a>\n        <ol class=\"breadcrumb\">\n          <li><a href=\"javascript:void(0)\" ng-click=\"action.setViewType(\'list\')\">${ action.info.display_name }</a></li>\n          <li>${ (dataSource.loadingRecord && Katrid.i18n.gettext('Loading...')) || record.display_name }</li>\n        </ol>\n        <div class=\"pull-right\">\n            <span ng-show=\"records.length\">\n              ${dataSource.recordIndex} / ${records.length}\n            </span>\n        </div>\n        <p class=\"help-block\">${ action.info.usage }&nbsp;</p>\n      </div>\n      <div class=\"toolbar\">\n  <button class=\"btn btn-primary\" type=\"button\" ng-disabled=\"dataSource.uploading\" ng-click=\"dataSource.saveChanges()\" ng-show=\"dataSource.changing\">" + (Katrid.i18n.gettext('Save')) + "</button>\n  <button class=\"btn btn-primary\" type=\"button\" ng-disabled=\"dataSource.uploading\" ng-click=\"dataSource.editRecord()\" ng-show=\"!dataSource.changing\">" + (Katrid.i18n.gettext('Edit')) + "</button>\n  <button class=\"btn btn-default\" type=\"button\" ng-click=\"dataSource.cancelChanges()\" ng-show=\"dataSource.changing\">" + (Katrid.i18n.gettext('Cancel')) + "</button>\n  <div class=\"btn-group\">\n    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\">\n      " + (Katrid.i18n.gettext('Action')) + " <span class=\"caret\"></span></button>\n    <ul class=\"dropdown-menu animated flipInX\">\n      <li><a href='javascript:void(0)' ng-click=\"action.deleteSelection()\"><i class=\"fa fa-fw fa-trash\"></i> " + (Katrid.i18n.gettext('Delete')) + "</a></li>\n      " + actions + "\n    </ul>\n  </div>\n  <div class=\"pull-right\">\n    <div class=\"btn-group\" role=\"group\">\n      <button class=\"btn btn-default\" type=\"button\" ng-click=\"dataSource.prior(\'form\')\"><i class=\"fa fa-chevron-left\"></i>\n      </button>\n      <button class=\"btn btn-default\" type=\"button\" ng-click=\"dataSource.next(\'form\')\"><i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n\n    " + buttons + "\n</div>\n</div>\n    </div>\n  </div><div class=\"content container animated fadeIn\"><div class=\"panel panel-default data-panel\">\n<div class=\"panel-body\"><div class=\"row\">" + html + "</div></div></div></div></div>";
      return html;
    };

    Templates.prototype.preRender_list = function(scope, html) {
      var buttons;
      buttons = this.getViewButtons(scope);
      return "<div class=\"data-heading panel panel-default\">\n  <div class=\"panel-body\">\n    <div class='row'>\n      <div class=\"col-sm-6\">\n      <ol class=\"breadcrumb\">\n        <li>${ action.info.display_name }</li>\n      </ol>\n      </div>\n      <div class=\"search-view col-md-6\">\n        <input search-box type=\"hidden\" ng-model=\"searchParams\" ng-change=\"action.setSearchParams(searchParams)\">\n      </div>\n      <!--<p class=\"help-block\">${ action.info.usage }&nbsp;</p>-->\n    </div>\n    <div class=\"toolbar\">\n      <button class=\"btn btn-primary\" type=\"button\" ng-click=\"action.createNew()\">" + (Katrid.i18n.gettext('Create')) + "</button>\n      <span ng-show=\"dataSource.loading\" class=\"badge page-badge-ref fadeIn animated\">${dataSource.pageIndex}</span>\n\n<div class=\"btn-group\">\n  <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\">\n    " + (Katrid.i18n.gettext('Action')) + " <span class=\"caret\"></span></button>\n  <ul class=\"dropdown-menu animated flipInX\">\n    <li><a href='javascript:void(0)' ng-click=\"action.deleteSelection()\"><i class=\"fa fa-fw fa-trash\"></i> " + (Katrid.i18n.gettext('Delete')) + "</a></li>\n  </ul>\n</div>\n\n<button class=\"btn btn-default\" ng-click=\"dataSource.refresh()\"><i class=\"fa fa-refresh\"></i> Atualizar</button>\n\n<div class=\"pull-right\">\n          <div class=\"pagination-area\">\n            <span class=\"paginator\">${dataSource.offset|number} - ${dataSource.offsetLimit|number}</span> / <span class=\"total-pages\">${dataSource.recordCount|number}</span>\n          </div>\n  <div class=\"btn-group\">\n    <button class=\"btn btn-default\" type=\"button\" ng-click=\"dataSource.prevPage()\"><i class=\"fa fa-chevron-left\"></i>\n    </button>\n    <button class=\"btn btn-default\" type=\"button\" ng-click=\"dataSource.nextPage()\"><i class=\"fa fa-chevron-right\"></i>\n    </button>\n  </div>\n\n  " + buttons + "\n</div>\n</div>\n  </div>\n</div><div class=\"content no-padding\">\n<div class=\"panel panel-default data-panel\">\n<div class=\"panel-body no-padding\">\n<div class=\"dataTables_wrapper form-inline dt-bootstrap no-footer\">" + html + "</div></div></div></div>";
    };

    Templates.prototype.renderList = function(scope, element, attrs, rowClick, parentDataSource) {
      var choice, cls, col, colHtml, cols, fieldInfo, i, j, len, len1, name, ref, ref1, s, ths;
      ths = '';
      cols = '';
      ref = element.children();
      for (i = 0, len = ref.length; i < len; i++) {
        col = ref[i];
        col = $(col);
        name = col.attr('name');
        if (!name) {
          cols += "<td>" + (col.html()) + "</td>";
          ths += "<th><label>${col.attr('caption')}</label></th>";
          continue;
        }
        if (col.attr('visible') === 'False') {
          continue;
        }
        name = col.attr('name');
        fieldInfo = scope.view.fields[name];
        console.log(fieldInfo, name, scope.view.fields);
        if (fieldInfo.choices) {
          fieldInfo._listChoices = {};
          ref1 = fieldInfo.choices;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            choice = ref1[j];
            fieldInfo._listChoices[choice[0]] = choice[1];
          }
        }
        cls = fieldInfo.type + " list-column";
        ths += "<th class=\"" + cls + "\" name=\"" + name + "\"><label>${view.fields." + name + ".caption}</label></th>";
        cls = fieldInfo.type + " field-" + name;
        colHtml = col.html();
        if (colHtml) {
          cols += "<td><a data-id=\"${row." + name + "[0]}\">" + colHtml + "</a></td>";
        } else if (fieldInfo.type === 'ForeignKey') {
          cols += "<td><a data-id=\"${row." + name + "[0]}\">${row." + name + "[1]}</a></td>";
        } else if (fieldInfo._listChoices) {
          cols += "<td class=\"" + cls + "\">${view.fields." + name + "._listChoices[row." + name + "]}</td>";
        } else if (fieldInfo.type === 'BooleanField') {
          cols += "<td>${row." + name + " ? '" + (Katrid.i18n.gettext('yes')) + "' : '" + (Katrid.i18n.gettext('no')) + "'}</td>";
        } else if (fieldInfo.type === 'DecimalField') {
          cols += "<td class=\"" + cls + "\">${row." + name + "|number:2}</td>";
        } else if (fieldInfo.type === 'DateField') {
          cols += "<td class=\"" + cls + "\">${row." + name + "|date:'shortDate'}</td>";
        } else {
          cols += "<td>${row." + name + "}</td>";
        }
      }
      if (parentDataSource) {
        ths += "<th class=\"list-column-delete\" ng-show=\"parent.dataSource.changing\">";
        cols += "<td class=\"list-column-delete\" ng-show=\"parent.dataSource.changing\" ng-click=\"removeItem($index);$event.stopPropagation();\"><i class=\"fa fa-trash\"></i></td>";
      }
      if (rowClick == null) {
        rowClick = 'dataSource.setRecordIndex($index);action.location.search({view_type: \'form\', id: row.id});';
      }
      s = "<table ng-show=\"!dataSource.loading\" class=\"table table-striped table-bordered table-hover display responsive nowrap dataTable no-footer dtr-column\">\n<thead><tr>" + ths + "</tr></thead>\n<tbody>\n<tr ng-repeat=\"row in records\" ng-click=\"" + rowClick + "\">" + cols + "</tr>\n</tbody>\n</table>\n<div ng-show=\"dataSource.loading\" class=\"col-sm-12 margin-bottom-16 margin-top-16\">" + (Katrid.i18n.gettext('Loading...')) + "</div>";
      return s;
    };

    Templates.prototype.renderGrid = function(scope, element, attrs, rowClick) {
      var tbl;
      tbl = this.renderList(scope, element, attrs, rowClick, true);
      return "<div><div><button class=\"btn btn-default\" ng-click=\"addItem()\" ng-show=\"parent.dataSource.changing\" type=\"button\">" + (Katrid.i18n.gettext('Add')) + "</button></div>" + tbl + "</div>";
    };

    return Templates;

  })();

  this.Katrid.UI.Utils = {
    Templates: new Templates()
  };

}).call(this);

//# sourceMappingURL=ui.templ.js.map
