// Placeholder Plugin 

tinymce.PluginManager.add('placeholder', function (editor) {
    editor.on('init', function () {
        var label = new Label;
        onBlur();
        tinymce.DOM.bind(label.el, 'click', onFocus);
        editor.on('focus', onFocus);
        editor.on('blur', onBlur);
        editor.on('change', onBlur);
        editor.on('setContent', onBlur);
        function onFocus() { if (!editor.settings.readonly === true) { label.hide(); } editor.execCommand('mceFocus', false); }
        function onBlur() { if (editor.getContent() == '') { label.show(); } else { label.hide(); } }
    });
    var Label = function () {
        var placeholder_text = editor.getElement().getAttribute("placeholder") || editor.settings.placeholder;
        var placeholder_attrs = editor.settings.placeholder_attrs || { style: { position: 'absolute', top: '2px', left: 0, color: '#aaaaaa', padding: '.25%', margin: '5px', width: '80%', 'font-size': '17px !important;', overflow: 'hidden', 'white-space': 'pre-wrap' } };
        var contentAreaContainer = editor.getContentAreaContainer();
        tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative');
        this.el = tinymce.DOM.add(contentAreaContainer, "label", placeholder_attrs, placeholder_text);
    }
    Label.prototype.hide = function () { tinymce.DOM.setStyle(this.el, 'display', 'none'); }
    Label.prototype.show = function () { tinymce.DOM.setStyle(this.el, 'display', ''); }
});

// Basic editors

tinymce.init({
    selector: 'textarea.composer-editor',
    height: 600,
    menubar: false,
    statusbar: false,
    branding: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table contextmenu paste code','placeholder'
    ],
    toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',

});