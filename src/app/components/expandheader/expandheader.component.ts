import { Component, OnInit, Input, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'app-expandheader',
  templateUrl: './expandheader.component.html',
  styleUrls: ['./expandheader.component.scss'],
})
export class ExpandheaderComponent implements OnInit {

  @Input() scrollArea;

  headerHeight: any;
  newheaderHeight: any;

  constructor(  public element:   ElementRef,
                public renderer:  Renderer )  {
    this.headerHeight = 150;
  }

  ngOnInit() {
    this.renderer.setElementStyle( this.element.nativeElement, 'height', this.headerHeight + 'px' );
    this.scrollArea.ionScroll.subscribe( ev => { this.resizeHeader( ev.detail ); } );
  }

  resizeHeader( ev ) {
      /// console.log( ev.scrollTop );
      // console.log(this.element);

      this.newheaderHeight = this.headerHeight - ev.scrollTop;
      if ( this.newheaderHeight < 0 ) {
        this.newheaderHeight = 0;
      }
      this.renderer.setElementStyle( this.element.nativeElement, 'height', this.newheaderHeight + 'px' );
      /*
      for ( const hE of this.element.nativeElement.children ) {
        const totlaHeight = hE.offsetTop + hE.clientHeight ;
        if ( totlaHeight > this.headerHeight ) {
          this.renderer.setElementStyle( hE, 'opacity', '0' );
        } else {
          this.renderer.setElementStyle( hE, 'opacity', '1' );
        }
      }
      */
  }

}
