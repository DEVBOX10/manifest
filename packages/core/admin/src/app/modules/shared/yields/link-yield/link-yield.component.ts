import { NgClass, NgIf } from '@angular/common'
import { Component, Input } from '@angular/core'
import { TruncatePipe } from '../../pipes/truncate.pipe'
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-link-yield',
  standalone: true,
  imports: [NgIf, NgClass, TruncatePipe],
  template: ` <a
      [href]="external ? value : storageBaseUrl + '/' + value"
      [download]="!external"
      target="_blank"
      class="is-inline-flex is-align-items-center"
      *ngIf="value"
    >
      <i
        class="icon icon-external-link mr-1"
        [ngClass]="{
          'icon-external-link': external,
          'icon-download': !external
        }"
      ></i>
      <span *ngIf="compact">{{ value | truncate: 44 }}</span>
      <span *ngIf="!compact">{{ value }}</span>
    </a>
    <span class="is-nowrap" *ngIf="!value"> - </span>`,
  styleUrls: ['./link-yield.component.scss']
})
export class LinkYieldComponent {
  @Input() value: string
  @Input() compact: boolean = true
  @Input() external: boolean = true

  storageBaseUrl = environment.storageBaseUrl
}
