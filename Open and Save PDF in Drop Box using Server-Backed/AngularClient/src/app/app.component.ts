import { Component, OnInit } from '@angular/core';
import { LinkAnnotationService, BookmarkViewService, MagnificationService,
  ThumbnailViewService, ToolbarService, NavigationService,
  TextSearchService, AnnotationService, TextSelectionService,
  PrintService, FormDesignerService, FormFieldsService} from '@syncfusion/ej2-angular-pdfviewer';

@Component({
  selector: 'app-root',
  // specifies the template string for the PDF Viewer component
  template: 
    `<div class="content-wrapper">
                <ejs-pdfviewer id="pdfViewer"
                       [serviceUrl]='service'
                       [documentPath]='document'
                       style="height:640px;display:block">
                </ejs-pdfviewer>
             </div>`,

  providers: [ LinkAnnotationService, BookmarkViewService, MagnificationService,ThumbnailViewService, 
               ToolbarService, NavigationService, AnnotationService, TextSearchService,
                TextSelectionService, PrintService, FormDesignerService, FormFieldsService]
  })
export class AppComponent implements OnInit {
  // Replace the "localhost:44369" with the actual URL of your server
  public service = 'https://localhost:44396/pdfviewer';
  //Replace `PDF_Succinctly.pdf` with the actual document name that you want to load from dropbox folder
  public document = 'PDF_Succinctly.pdf';

  ngOnInit(): void {
  }
}