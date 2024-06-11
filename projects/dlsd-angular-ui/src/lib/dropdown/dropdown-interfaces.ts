import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OverlayRef } from '@angular/cdk/overlay';
import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomOverlayConfig } from '../overlay/interfaces';

export interface DropdownConfig<T> extends CustomOverlayConfig {
  clearValue?: () => void;
  close: () => void;
  // focusSourceElement?: () => void;
  // footerOption?: DropdownOption<T>;
  // footerTemplateRef?: TemplateRef<unknown>;
  // headerTemplateRef?: TemplateRef<unknown>;
  multiple?: boolean;
  noResultsMessage?: string;
  optional?: boolean;
  options: DropdownOptions<T>;
  optionsDraggable?: boolean;
  optionTemplateRef?: TemplateRef<unknown>;
  onOptionDrag?: (
    event: CdkDragDrop<{ title: string; poster: string }[]>
  ) => void;
  onValueChange: (
    value: DropdownOption<T>,
    options: DropdownOption<T>[]
  ) => void;
  search?: boolean;
  title?: string;
  width?: number;
}

export type DropdownOptions<T> =
  | Observable<DropdownSourceOptions<T>>
  | DropdownOptionsGroup<T>[]
  | undefined;

export interface DropdownSourceOptions<T> {
  options: DropdownOptionsGroup<T>[] | null;
  query?: string;
}

export interface DropdownOptionsGroup<T> {
  headerTemplateRef?: TemplateRef<unknown>;
  options: DropdownOption<T>[];
}

export interface DropdownOption<T> extends Option<T> {
  selected?: boolean;
  disabled?: boolean;
  options?: DropdownOption<T>[];
}

export interface Option<T> {
  name: string;
  value: T;
}

export type CallbackOption = Option<() => void>;

export interface DropdownOverlayConfig {
  overlayRef: OverlayRef;
  intersectionObserver?: IntersectionObserver;
}
