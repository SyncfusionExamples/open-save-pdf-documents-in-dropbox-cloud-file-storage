import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PdfViewerComponent, LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService, ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService, FormDesignerService, PageOrganizerService,PdfViewerModule, CustomToolbarItemModel } from '@syncfusion/ej2-angular-pdfviewer';
import { Dropbox } from 'dropbox';

/**
 * Default PdfViewer Controller
 */
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:max-line-length
    providers: [LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService, ToolbarService, NavigationService,
        TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService, FormDesignerService,PageOrganizerService],
    styleUrls: ['app.component.css'],
    standalone: true,
    imports: [
        PdfViewerModule,
    ],
})

export class AppComponent {
    @ViewChild('pdfviewer')
    public pdfviewerControl!: PdfViewerComponent;

    public fileName: string = "";

    public resource = 'https://cdn.syncfusion.com/ej2/23.1.43/dist/ej2-pdfviewer-lib';
    ngOnInit(): void {
        // ngOnInit function
    }

    public toolItem1: CustomToolbarItemModel = {
        prefixIcon: 'e-icons e-pv-download-document-icon',
        id: 'download_pdf',
        tooltipText: 'Download file',
        align: 'right'
    };

    public toolbarSettings = {
        showTooltip: true,
        toolbarItems: ['OpenOption', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'SearchOption', 'PrintOption', this.toolItem1, 'UndoRedoTool', 'AnnotationEditTool', 'FormDesignerEditTool', 'CommentTool', 'SubmitForm']
    };

    public toolbarClick(args: any): void {
        if (args.item && args.item.id === 'download_pdf') {
            this.saveDocument();
        }
    }

    async loadPdfDocument(): Promise<void> {
      let proxy = this;
      let dbx = new Dropbox({ accessToken: 'Your Access Token' });
      dbx.filesDownload({ path: '/PDF_Succinctly.pdf' }).then(async (response) => {
        const blob = await (response.result as any).fileBlob;
        const base64String = await this.blobToBase64(blob);
        setTimeout(() => {
            this.pdfviewerControl.load(base64String, "");
        }, 2000);
      });
    }

    private blobToBase64(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onload = () => {
              resolve(reader.result as string);
          };
          reader.readAsDataURL(blob);
      });
    }

    saveDocument() {
      var proxy = this
        var viewer = (<any>document.getElementById("pdfViewer")).ej2_instances[0];  
        this.fileName = viewer.fileName;
        viewer.saveAsBlob().then((value: Blob) => {
          const reader = new FileReader();
          reader.onload = async () => {
            let dbx = new Dropbox({ accessToken: 'Your Access Token' });
            const uint8Array = new Uint8Array(reader.result as ArrayBuffer);
            dbx.filesUpload({ path: '/' + proxy.fileName , contents: uint8Array })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.error(error);
              });
          };
          reader.readAsArrayBuffer(value);
        });
      }
}
 