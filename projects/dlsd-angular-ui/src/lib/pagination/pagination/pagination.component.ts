import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
  computed,
  effect,
  model,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgLetModule } from 'ng-let';
import { DLSDSelectComponent } from '../../forms';
import { I18N_NAMESPACE } from '../../internal/constants';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_LIMIT_OPTIONS,
} from '../constants';
import { DLSDPaginationOptions } from '../interfaces';

@Component({
  selector: 'dlsd-pagination',
  standalone: true,
  imports: [
    DLSDSelectComponent,
    NgLetModule,
    TranslateModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDPaginationComponent {
  protected readonly I18N = `${I18N_NAMESPACE}.pagination`;
  protected readonly LIMIT_OPTIONS = PAGINATION_LIMIT_OPTIONS;

  public pagination = model<DLSDPaginationOptions>({
    page: 1,
    limit: PAGINATION_DEFAULT_LIMIT,
  });

  @Input() public set totalItems(totalItems: number | undefined) {
    if (totalItems == null) return;
    this._totalItems.set(totalItems);
  }
  public get totalItems(): Signal<number> {
    return this._totalItems.asReadonly();
  }

  protected limitFormControl = this.fb.control<number>(this.pagination().limit);
  protected pageItemsTranslationParam = computed<string>(() =>
    this.calculatePageItemsTranslationParam(
      this.pagination(),
      this.totalItems(),
      this.totalPages()
    )
  );
  protected totalPages = computed<number[]>(() =>
    this.calculateTotalPages(this.pagination(), this.totalItems())
  );

  private _totalItems = signal<number>(0);

  constructor(private fb: FormBuilder) {
    const limitValueChanges = toSignal(this.limitFormControl.valueChanges);

    effect(() => this.changeLimit(limitValueChanges()), {
      allowSignalWrites: true,
    });
  }

  protected previousPage(): void {
    const page = this.pagination().page;
    if (page > 1) {
      this.changePage(page - 1);
    }
  }

  protected nextPage(): void {
    const page = this.pagination().page;
    if (page < this.totalPages().length) {
      this.changePage(page + 1);
    }
  }

  protected changePage(page: number): void {
    this.pagination.update((pageParams) => ({
      ...pageParams,
      page,
    }));
  }

  private changeLimit(limit?: number | null): void {
    if (!limit) return;

    this.pagination.update((page) => ({
      page: Math.floor(((page.page - 1) * page.limit + 1) / limit) + 1,
      limit,
    }));
  }

  private calculateTotalPages(
    pagination: DLSDPaginationOptions,
    totalItems: number
  ): number[] {
    const pages = [];
    if (!totalItems) return [];

    const length = totalItems / pagination.limit;
    while (pages.length < length) {
      pages.push(pages.length + 1);
    }
    return pages;
  }

  private calculatePageItemsTranslationParam(
    pagination: DLSDPaginationOptions,
    totalItems: number,
    totalPages: number[]
  ): string {
    return (
      (pagination.page - 1) * pagination.limit +
      1 +
      '-' +
      (pagination.page < totalPages.length
        ? pagination.page * pagination.limit
        : totalItems)
    );
  }
}
