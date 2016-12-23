// Generated by CoffeeScript 1.10.0
(function() {
  var _gridDialogTemplate, formCount, uiKatrid;

  uiKatrid = Katrid.uiKatrid;

  formCount = 0;

  uiKatrid.directive('field', function($compile) {
    var fieldType, widget;
    fieldType = null;
    widget = null;
    return {
      restrict: 'E',
      replace: true,
      template: function(element, attrs) {
        if ((element.parent('list').length)) {
          fieldType = 'column';
          return '<column></column>';
        } else {
          fieldType = 'field';
          return "<section class=\"section-field-" + attrs.name + " form-group\" />";
        }
      },
      link: function(scope, element, attrs) {
        var cols, field, templ, tp;
        field = scope.view.fields[attrs.name];
        if (fieldType === 'field') {
          widget = attrs.widget;
          if (!widget) {
            tp = field.type;
            if (tp === 'ForeignKey') {
              widget = tp;
            } else if (field.choices) {
              widget = 'SelectField';
            } else if (tp === 'TextField') {
              widget = 'TextareaField';
            } else if (tp === 'BooleanField') {
              widget = 'CheckBox';
            } else if (tp === 'DecimalField') {
              widget = 'DecimalField';
              cols = 3;
            } else if (tp === 'IntegerField') {
              widget = 'TextField';
              cols = 3;
            } else if (tp === 'CharField') {
              widget = 'TextField';
              if (field.max_length && field.max_length < 30) {
                cols = 3;
              }
            } else if (tp === 'OneToManyField') {
              widget = 'OneToManyField';
              cols = 12;
            } else {
              widget = 'TextField';
            }
          }
          element.addClass("col-md-" + (attrs.cols || cols || 6));
          widget = new Katrid.UI.Widgets[widget];
          field = scope.view.fields[attrs.name];
          templ = $compile(widget.template(scope, element, attrs, field))(scope);
          element.append(templ);
          return widget.link(scope, element, attrs, $compile, field);
        } else {
          return element.append('<button>teste</button>');
        }
      }
    };
  });

  uiKatrid.directive('view', function() {
    return {
      restrict: 'E',
      template: function(element, attrs) {
        formCount++;
        return '';
      },
      link: function(scope, element, attrs) {
        if (scope.model) {
          element.attr('class', 'view-form-' + scope.model.name.replace(new RegExp('\.', 'g'), '-'));
          element.attr('id', 'katrid-form-' + formCount.toString());
          element.attr('model', scope.model);
          return element.attr('name', 'dataForm' + formCount.toString());
        }
      }
    };
  });

  uiKatrid.directive('list', function($compile, $http) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var html;
        html = Katrid.UI.Utils.Templates.renderList(scope, element, attrs);
        return element.replaceWith($compile(html)(scope));
      }
    };
  });

  _gridDialogTemplate = function() {
    return "<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\n  <div class=\"modal-dialog modal-lg\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n        <h4 class=\"modal-title\" id=\"myModalLabel\">${field.caption}</h4>\n      </div>\n      <div class=\"modal-body\">\n<div class=\"row\">\n<!-- view content -->\n</div>\n<div class=\"clearfix\"></div>\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-primary\">" + (Katrid.i18n.gettext('Save')) + "</button>\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">" + (Katrid.i18n.gettext('Cancel')) + "</button>\n      </div>\n    </div>\n  </div>\n</div>";
  };

  uiKatrid.directive('grid', function($compile, $http) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      link: function(scope, element, attrs) {
        var field, masterChanged, renderDialog;
        field = scope.$parent.view.fields[attrs.name];
        scope.field = field;
        scope.recordIndex = null;
        scope._viewCache = {};
        scope.dataSet = [];
        scope.model = new Katrid.Services.Model(field.model);
        scope.data = new Katrid.Data.DataSource(scope);
        scope.model.getViewInfo({
          view_type: 'list'
        }).done(function(res) {
          return scope.$apply(function() {
            var html;
            scope.view = res.result;
            html = Katrid.UI.Utils.Templates.renderList(scope, $(scope.view.content), attrs, 'showDialog($index)');
            return element.replaceWith($compile(html)(scope));
          });
        });
        renderDialog = function() {
          var el;
          el = $compile(_gridDialogTemplate().replace('<!-- view content -->', scope._viewCache.form.content))(scope);
          el.modal('show');
          el.on('hidden.bs.modal', function() {
            return el.remove();
          });
          return false;
        };
        scope.showDialog = function(index) {
          if (!scope.dataSet[index]) {
            scope.data.get(scope.records[index].id).done(function(res) {
              if (res.ok) {
                return scope.$apply(function() {
                  scope.record = res.result.data[0];
                  return scope.dataSet[index] = scope.record;
                });
              }
            });
          }
          scope.record = scope.dataSet[index];
          if (scope._viewCache.form) {
            setTimeout(function() {
              return renderDialog();
            });
          } else {
            scope.model.getViewInfo({
              view_type: 'form'
            }).done(function(res) {
              if (res.ok) {
                scope._viewCache.form = res.result;
                return renderDialog();
              }
            });
          }
          return false;
        };
        masterChanged = function(key) {
          var data;
          data = {};
          data[field.field] = key;
          return scope.model.search(data).done(function(res) {
            return scope.$apply(function() {
              return scope.records = res.result.data;
            });
          });
        };
        return scope.$parent.$watch('recordId', function(key) {
          return masterChanged(key);
        });
      }
    };
  });

  uiKatrid.directive('ngEnter', function() {
    return function(scope, element, attrs) {
      return element.bind("keydown keypress", function(event) {
        if (event.which === 13) {
          scope.$apply(function() {
            return scope.$eval(attrs.ngEnter);
          });
          return event.preventDefault();
        }
      });
    };
  });

  uiKatrid.directive('datepicker', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, controller) {
        var el, updateModelValue;
        el = element.datepicker({
          format: Katrid.i18n.gettext('dd/mm/yyyy'),
          forceParse: false
        });
        updateModelValue = function() {
          return el.val(controller.$modelValue);
        };
        scope.$watch(attrs.ngModel, updateModelValue);
        el = el.mask('00/00/0000');
        controller.$render = function() {
          return console.log(controller.$modelValue);
        };
        return el.on('blur', function(evt) {
          var dt, s;
          s = el.val();
          if ((s.length === 5) || (s.length === 6)) {
            if (s.length === 6) {
              s = s.substr(0, 5);
            }
            dt = new Date();
            el.datepicker('setDate', s + '/' + dt.getFullYear().toString());
          }
          if ((s.length === 2) || (s.length === 3)) {
            if (s.length === 3) {
              s = s.substr(0, 2);
            }
            dt = new Date();
            return el.datepicker('setDate', new Date(dt.getFullYear(), dt.getMonth(), s));
          }
        });
      }
    };
  });

  uiKatrid.directive('ajaxChoices', function($location) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, controller) {
        var cfg, el, multiple, serviceName;
        multiple = attrs.multiple;
        serviceName = attrs.ajaxChoices;
        cfg = {
          ajax: {
            url: serviceName,
            dataType: 'json',
            quietMillis: 500,
            data: function(term, page) {
              return {
                q: term,
                t: 1,
                p: page - 1,
                file: attrs.reportFile,
                sql_choices: attrs.sqlChoices
              };
            },
            results: function(data, page) {
              var more;
              console.log(data);
              data = data.items;
              more = (page * 10) < data.count;
              if (!multiple && (page === 1)) {
                data.splice(0, 0, {
                  id: null,
                  text: '---------'
                });
              }
              return {
                results: data,
                more: more
              };
            }
          },
          escapeMarkup: function(m) {
            return m;
          },
          initSelection: function(element, callback) {
            var i, j, len, v, values;
            v = controller.$modelValue;
            if (v) {
              if (multiple) {
                values = [];
                for (j = 0, len = v.length; j < len; j++) {
                  i = v[j];
                  values.push({
                    id: i[0],
                    text: i[1]
                  });
                }
                return callback(values);
              } else {
                return callback({
                  id: v[0],
                  text: v[1]
                });
              }
            }
          }
        };
        if (multiple) {
          cfg['multiple'] = true;
        }
        el = element.select2(cfg);
        element.on('$destroy', function() {
          $('.select2-hidden-accessible').remove();
          $('.select2-drop').remove();
          return $('.select2-drop-mask').remove();
        });
        el.on('change', function(e) {
          var v;
          v = el.select2('data');
          controller.$setDirty();
          if (v) {
            controller.$viewValue = v;
          }
          return scope.$apply();
        });
        return controller.$render = function() {
          if (controller.$viewValue) {
            return element.select2('val', controller.$viewValue);
          }
        };
      }
    };
  });

  uiKatrid.directive('decimal', function($filter) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, controller) {
        var decimal, el, negative, precision, symbol, thousands;
        precision = attrs.precision || 2;
        thousands = attrs.uiMoneyThousands || ".";
        decimal = attrs.uiMoneyDecimal || ",";
        symbol = attrs.uiMoneySymbol;
        negative = attrs.uiMoneyNegative || true;
        el = element.maskMoney({
          symbol: symbol,
          thousands: thousands,
          decimal: decimal,
          precision: precision,
          allowNegative: negative,
          allowZero: true
        }).bind('keyup blur', function(event) {
          controller.$setViewValue(element.val().replace(RegExp('\\' + thousands, 'g'), '').replace(RegExp('\\' + decimal, 'g'), '.'));
          controller.$modelValue = parseFloat(element.val().replace(RegExp('\\' + thousands, 'g'), '').replace(RegExp('\\' + decimal, 'g'), '.'));
          return scope.$apply();
        });
        return controller.$render = function() {
          if (controller.$viewValue) {
            return element.val($filter('number')(controller.$viewValue, precision));
          } else {
            return element.val('');
          }
        };
      }
    };
  });

  uiKatrid.controller('TabsetController', [
    '$scope', function($scope) {
      var ctrl, destroyed, tabs;
      ctrl = this;
      tabs = ctrl.tabs = $scope.tabs = [];
      ctrl.select = function(selectedTab) {
        angular.forEach(tabs, function(tab) {
          if (tab.active && tab !== selectedTab) {
            tab.active = false;
            tab.onDeselect();
          }
        });
        selectedTab.active = true;
        selectedTab.onSelect();
      };
      ctrl.addTab = function(tab) {
        tabs.push(tab);
        if (tabs.length === 1) {
          tab.active = true;
        } else if (tab.active) {
          ctrl.select(tab);
        }
      };
      ctrl.removeTab = function(tab) {
        var index, newActiveIndex;
        index = tabs.indexOf(tab);
        if (tab.active && tabs.length > 1 && !destroyed) {
          newActiveIndex = index === tabs.length - 1 ? index - 1 : index + 1;
          ctrl.select(tabs[newActiveIndex]);
        }
        tabs.splice(index, 1);
      };
      destroyed = void 0;
      $scope.$on('$destroy', function() {
        destroyed = true;
      });
    }
  ]);

  uiKatrid.directive('tabset', function() {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        type: '@'
      },
      controller: 'TabsetController',
      template: "<div>\n" + "  <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" + "  <div class=\"tab-content\">\n" + "    <div class=\"tab-pane\" \n" + "         ng-repeat=\"tab in tabs\" \n" + "         ng-class=\"{active: tab.active}\"\n" + "         tab-content-transclude=\"tab\">\n" + "    </div>\n" + "  </div>\n" + "</div>\n",
      link: function(scope, element, attrs) {
        scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
        return scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
      }
    };
  });

  uiKatrid.directive('tab', [
    '$parse', function($parse) {
      return {
        require: '^tabset',
        restrict: 'EA',
        replace: true,
        template: "<li ng-class=\"{active: active, disabled: disabled}\">\n" + "  <a href ng-click=\"select()\" tab-heading-transclude>{{heading}}</a>\n" + "</li>\n",
        transclude: true,
        scope: {
          active: '=?',
          heading: '@',
          onSelect: '&select',
          onDeselect: '&deselect'
        },
        controller: function() {},
        compile: function(elm, attrs, transclude) {
          return function(scope, elm, attrs, tabsetCtrl) {
            scope.$watch('active', function(active) {
              if (active) {
                tabsetCtrl.select(scope);
              }
            });
            scope.disabled = false;
            if (attrs.disabled) {
              scope.$parent.$watch($parse(attrs.disabled), function(value) {
                scope.disabled = !!value;
              });
            }
            scope.select = function() {
              if (!scope.disabled) {
                scope.active = true;
              }
            };
            tabsetCtrl.addTab(scope);
            scope.$on('$destroy', function() {
              tabsetCtrl.removeTab(scope);
            });
            scope.$transcludeFn = transclude;
          };
        }
      };
    }
  ]);

  uiKatrid.directive('tabHeadingTransclude', [
    function() {
      return {
        restrict: 'A',
        require: '^tab',
        link: function(scope, elm, attrs, tabCtrl) {
          scope.$watch('headingElement', function(heading) {
            if (heading) {
              elm.html('');
              elm.append(heading);
            }
          });
        }
      };
    }
  ]);

  uiKatrid.directive('tabContentTransclude', function() {
    var isTabHeading;
    isTabHeading = function(node) {
      return node.tagName && (node.hasAttribute('tab-heading') || node.hasAttribute('data-tab-heading') || node.tagName.toLowerCase() === 'tab-heading' || node.tagName.toLowerCase() === 'data-tab-heading');
    };
    return {
      restrict: 'A',
      require: '^tabset',
      link: function(scope, elm, attrs) {
        var tab;
        tab = scope.$eval(attrs.tabContentTransclude);
        tab.$transcludeFn(tab.$parent, function(contents) {
          angular.forEach(contents, function(node) {
            if (isTabHeading(node)) {
              tab.headingElement = node;
            } else {
              elm.append(node);
            }
          });
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=components.js.map
