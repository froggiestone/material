(function() {
  DocsApp
    .factory('$codepen', ['$demoAngularScripts', '$document', Codepen]);

  function Codepen($demoAngularScripts, $document) {
    var translator = new MutateIndexContentTranslatorDecorator(
      new ExampleFilesToCodepenDataTranslator()
    );

    return {
      editExample: editExample
    };

    function editExample(demo) {
      var data = translator.translate(demo, $demoAngularScripts.all());
      var form = buildForm(data);
      $document.find('body').append(form);
      form[0].submit();
      form.remove();
    };

    function buildForm(data) {
      var url = 'http://codepen.io/pen/define/';
      var form = angular.element('<form style="display: none;" method="post" target="_blank" action="' + url + '"></form>');
      var input = '<input type="hidden" name="data" value="' + cleanseJson(data) + '" />';
      form.append(input);
      return form;
    };

    function cleanseJson(json) {
      return JSON.stringify(json)
        .replace(/"/g, "&quot;")
        .replace(/"/g, "&apos;")
        .replace(/&gt;/g, "&amp;gt;")
        .replace(/&lt;/g, "&amp;lt;");
    };
  };


  function ExampleFilesToCodepenDataTranslator() {
    var coreJs = 'http://rawgit.com/angular/bower-material/master/angular-material.js';
    var assetCacheJs = 'https://rawgit.com/angular/material/wip/edit-example-on-codepen/docs/app/asset-cache.js';
    var coreCss = 'http://rawgit.com/angular/bower-material/master/angular-material.css';

    return {
      translate: translate
    };

    function translate(demo, externalScripts) {
      var files = demo.files;

      return {
        title: demo.title,
        html: demo.files.index.contents,
        css: mergeFiles(files.css).join(' '),
        js: mergeFiles(files.js).join(' '),
        js_external: externalScripts.concat([coreJs, assetCacheJs]).join(';') || '',
        css_external: coreCss
      };
    };

    function mergeFiles(files) {
      return files.map(function(file) {
        return file.contents;
      });
    };
  };

  function MutateIndexContentTranslatorDecorator(decorated) {
    return {
      translate: translate
    };

    function translate(demo, externalScripts) {
      appendDemoDataToIndex(demo);
      replaceDocsSiteModuleWithCodepenModule(demo);
      insertTemplatesIntoIndex(demo);
      return decorated.translate(demo, externalScripts);
    };

    function appendDemoDataToIndex(demo) {
      var tmp = angular.element(demo.files.index.contents);
      tmp.addClass(demo.id);
      tmp.attr('ng-app', 'editable-example');
      demo.files.index.contents = tmp[0].outerHTML;
    };

    function replaceDocsSiteModuleWithCodepenModule(demo) {
      for(var i = 0; i < demo.files.js.length; i++) {
        var tmp = demo.files.js[i].contents;
        demo.files.js[i].contents = tmp.replace(demo.module, 'editable-example');
      };
    };

    function insertTemplatesIntoIndex(demo) {
      if (demo.files.html.length) {
        var tmp = angular.element(demo.files.index.contents);
        angular.forEach(demo.files.html, function(template) {
          tmp.append("<script type='text/ng-template' id='" + template.name + "'>" + template.contents + "</script>");
        });
        demo.files.index.contents = tmp[0].outerHTML;
      }
     };
  };
})();
