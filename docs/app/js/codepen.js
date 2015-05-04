(function() {
  DocsApp
    .factory('$codepenDataAdapter', CodepenDataAdapter)
    .factory('$codepen', ['$demoAngularScripts', '$document', '$codepenDataAdapter', Codepen]);

  function Codepen($demoAngularScripts, $document, $codepenDataAdapter) {

    var CODEPEN_API = 'http://codepen.io/pen/define/';

    return {
      editOnCodepen: editOnCodepen
    };

    function editOnCodepen(demo) {
      var data = $codepenDataAdapter.translate(demo, $demoAngularScripts.all());
      var form = buildForm(data);
      $document.find('body').append(form);
      form[0].submit();
      form.remove();
    };

    function buildForm(data) {
      var form = angular.element('<form style="display: none;" method="post" target="_blank" action="' + CODEPEN_API + '"></form>');
      var input = '<input type="hidden" name="data" value="' + cleanseJson(data) + '" />';
      form.append(input);
      return form;
    };

    function cleanseJson(json) {
      return JSON.stringify(json)
        .replace(/"/g, "&quot;")
        .replace(/"/g, "&apos;");
    };
  };

  function CodepenDataAdapter() {

    var CORE_JS = 'https://cdn.rawgit.com/angular/bower-material/master/angular-material.js';
    var ASSET_CACHE_JS = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-114/assets-cache.js';
    var CORE_CSS = 'https://cdn.rawgit.com/angular/bower-material/master/angular-material.css';

    return {
      translate: translate
    };

    function translate(demo, externalScripts) {
      var files = demo.files;

      return {
        title: demo.title,
        html: processHtml(demo),
        css: mergeFiles(files.css).join(' '),
        js: processJs(files.js),
        js_external: externalScripts.concat([CORE_JS, ASSET_CACHE_JS]).join(';'),
        css_external: CORE_CSS
      };
    };

    function processHtml(demo) {
      var index = demo.files.index.contents;

      var processors = [
        applyAngularAttributesToParentElement,
        insertTemplatesAsScriptTags,
        replaceEscapedCharacters
      ];

      angular.forEach(processors, function(processor) {
        index = processor(index, demo);
      });

      return index;
    };

    function processJs(jsFiles) {
      var mergedJs = mergeFiles(jsFiles).join(' ');
      var script = replaceDemoModuleWithCodepenModule(mergedJs);
      return script;
    };

    function mergeFiles(files) {
      return files.map(function(file) {
        return file.contents;
      });
    };

    function applyAngularAttributesToParentElement(html, demo) {
      var tmp = angular.element(html);
      tmp.addClass(demo.id);
      tmp.attr('ng-app', 'MyApp');
      return tmp[0].outerHTML;
    };

    function insertTemplatesAsScriptTags(indexHtml, demo) {
      if (demo.files.html.length) {
        var tmp = angular.element(indexHtml);
        angular.forEach(demo.files.html, function(template) {
          tmp.append("<script type='text/ng-template' id='" + template.name + "'>" + template.contents + "</script>");
        });
        return tmp[0].outerHTML;
      }
      return indexHtml;
    };

    function replaceEscapedCharacters(html) {
      return html
        .replace(/&gt;/g, "&amp;gt;")
        .replace(/&lt;/g, "&amp;lt;");
    };

    function replaceDemoModuleWithCodepenModule(file) {
      var matchAngularModule =  /\.module\(('[^']*'|"[^"]*")\s*,(?:\s*\[([^\]]*)\])?/g;
      return file.replace(matchAngularModule, ".module('MyApp'");
    };
 };
})();
