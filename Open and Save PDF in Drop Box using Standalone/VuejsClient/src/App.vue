<template>
  <ejs-pdfviewer 
    id="pdfViewer" 
    :resourceUrl="resourceUrl" 
    :toolbarClick="toolbarClick" 
    :created="loadPdfDocument" 
    :toolbarSettings="toolbarSettings">
  </ejs-pdfviewer>
</template>

<script>
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, 
           ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormDesigner, FormFields, PageOrganizer } from '@syncfusion/ej2-vue-pdfviewer';
import { Dropbox } from 'dropbox';
  export default {
    name: 'App',

    components: {
      "ejs-pdfviewer": PdfViewerComponent
    },

    data() {
      let toolItem1 = {
        prefixIcon: 'e-icons e-pv-download-document-icon',
        id: 'download_pdf',
        tooltipText: 'Download file',
        align: 'right'
      };

      return {
        resourceUrl: 'https://cdn.syncfusion.com/ej2/23.1.43/dist/ej2-pdfviewer-lib',
        toolbarSettings: {
          toolbarItems: [ 'OpenOption', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'SearchOption', 'PrintOption', toolItem1, 'UndoRedoTool', 'AnnotationEditTool', 'FormDesignerEditTool', 'CommentTool', 'SubmitForm']
        },
      };
    },

    methods: {
      toolbarClick: function (args) {
          if (args.item && args.item.id === 'download_pdf') {
            this.savePdfDocument();
          }
      },

      loadPdfDocument: async function () {
        const dbx = new Dropbox({ accessToken: 'Your Access Token'});
        dbx.filesDownload({ path: '/PDF_Succinctly.pdf' }).then(async (response) => {
          const blob = await response.result.fileBlob;
          var base64String = await this.blobToBase64(blob);
          var viewer = document.getElementById('pdfViewer').ej2_instances[0];
          setTimeout(() => {
            viewer.load(base64String, "");
          }, 2000);
        });
      },

      blobToBase64: function (blob){
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      },

      savePdfDocument: function () {
        var viewer = document.getElementById('pdfViewer').ej2_instances[0];
        viewer.saveAsBlob().then(function (value) {
          var reader = new FileReader();
          reader.onload = async () => {
            if (reader.result) {
              const dbx = new Dropbox({ accessToken: 'Your Access Token' });
              const uint8Array = new Uint8Array(reader.result);
              dbx.filesUpload({ path: '/' + viewer.fileName, contents: uint8Array })
                .then(response => {
                  console.log(response);
                })
                .catch(error => {
                  console.error(error);
                });
            }
          };
          reader.readAsArrayBuffer(value);
        });
      }
    },

    provide: {
      PdfViewer: [ Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView,
                   Print, TextSelection, TextSearch, Annotation, FormDesigner, FormFields, PageOrganizer ]
    }
  }
</script>

<style>
  @import '../node_modules/@syncfusion/ej2-base/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
  @import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
  @import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
  @import '../node_modules/@syncfusion/ej2-vue-pdfviewer/styles/material.css';
</style>