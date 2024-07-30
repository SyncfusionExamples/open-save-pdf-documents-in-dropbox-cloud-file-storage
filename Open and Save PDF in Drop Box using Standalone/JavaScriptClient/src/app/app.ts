import { PdfViewer, CustomToolbarItemModel, Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, FormFields, FormDesigner} from '@syncfusion/ej2-pdfviewer';
import { Dropbox } from 'dropbox';
PdfViewer.Inject(Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, FormFields, FormDesigner);

let pdfviewer: PdfViewer = new PdfViewer();
pdfviewer.resourceUrl = "https://cdn.syncfusion.com/ej2/23.1.43/dist/ej2-pdfviewer-lib";

let toolItem1: CustomToolbarItemModel = {
    prefixIcon: 'e-icons e-pv-download-document-icon',
    id: 'download_pdf',
    tooltipText: 'Download file',
    align: 'right'
};

pdfviewer.toolbarSettings = { toolbarItems: [ 'OpenOption', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'SearchOption', 'PrintOption', toolItem1, 'UndoRedoTool', 'AnnotationEditTool', 'FormDesignerEditTool', 'CommentTool', 'SubmitForm']}

pdfviewer.toolbarClick = function (args) {
    if (args.item && args.item.id === 'download_pdf') {
        saveDocument();
    }
};

function saveDocument() {
    pdfviewer.saveAsBlob().then(function (value) {
        var reader = new FileReader();
        reader.onload = async () => {
          if (reader.result) {
            const dbx = new Dropbox({ accessToken: 'Your Access Token' });
            if(reader && reader.result){
                const uint8Array = new Uint8Array(reader.result as ArrayBuffer);
                dbx.filesUpload({ path: '/' + pdfviewer.fileName, contents: uint8Array })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.error(error);
                });
            }
          }
        };
        reader.readAsArrayBuffer(value);
      });
}

pdfviewer.created = function () {
    let dbx = new Dropbox({ accessToken: 'Your Access Token' });
      dbx.filesDownload({ path: '/PDF_Succinctly.pdf' }).then(async (response) => {
        const blob = await (response.result as any).fileBlob;
        const base64String = await blobToBase64(blob);
        setTimeout(() => {
            pdfviewer.load(base64String, "");
        }, 2000);
    });
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
    });
}

pdfviewer.appendTo('#PdfViewer');