import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
         ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';
import { Dropbox } from 'dropbox';

function App() {
  let viewer;

  var toolItem1 = {
    prefixIcon: 'e-icons e-pv-download-document-icon',
    id: 'download_pdf',
    tooltipText: 'Download file',
    align: 'right'
  };

  function toolbarClick(args){
    if (args.item && args.item.id === 'download_pdf') {
      saveDocument();
    }
  };

  function saveDocument() {
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
  };

  function blobToBase64(blob){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function loadDocument() {
    const dbx = new Dropbox({ accessToken: 'Your Access Token' });
    dbx.filesDownload({ path: '/PDF_Succinctly.pdf' }).then(async (response) => {
      const blob = await response.result.fileBlob;
      const base64String = await blobToBase64(blob);
      setTimeout(() => {
        viewer.load(base64String, "");
      }, 2000);
    });
  }
    return (<div>
    <div className='control-section'>
    {/* Render the PDF Viewer */}
      <PdfViewerComponent
        ref={(scope) => {
          viewer = scope;
        }}
        created={loadDocument}
        id="container"
        resourceUrl="https://cdn.syncfusion.com/ej2/23.1.40/dist/ej2-pdfviewer-lib"
        style={{ 'height': '640px' }}
        toolbarSettings={{ showTooltip : true, toolbarItems: [ 'OpenOption', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'SearchOption', 'PrintOption', toolItem1, 'UndoRedoTool', 'AnnotationEditTool', 'FormDesignerEditTool', 'CommentTool', 'SubmitForm']}}
        toolbarClick={toolbarClick}>
         
         <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
                             ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner ]}/>

      </PdfViewerComponent>
    </div>
  </div>);
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);