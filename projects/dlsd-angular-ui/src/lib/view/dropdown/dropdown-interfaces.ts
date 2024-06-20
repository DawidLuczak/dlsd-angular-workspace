import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OverlayRef } from '@angular/cdk/overlay';
import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { DLSDCustomOverlayConfig } from '../../overlay/interfaces';

export interface DLSDDropdownConfig<T> extends DLSDCustomOverlayConfig {
  clearValue?: () => void;
  close: () => void;
  multiple?: boolean;
  noResultsMessage?: string;
  optional?: boolean;
  options: DLSDDropdownOptions<T>;
  optionsDraggable?: boolean;
  optionTemplateRef?: TemplateRef<unknown>;
  onOptionDrag?: (
    event: CdkDragDrop<{ title: string; poster: string }[]>
  ) => void;
  onValueChange: (
    value: DLSDDropdownOption<T>,
    options: DLSDDropdownOption<T>[]
  ) => void;
  search?: boolean;
  title?: string;
  width?: number;
}

export type DLSDDropdownOptions<T> =
  | Observable<DLSDDropdownSourceOptions<T>>
  | DLSDDropdownOptionsGroup<T>[]
  | undefined;

export interface DLSDDropdownSourceOptions<T> {
  options: DLSDDropdownOptionsGroup<T>[] | null;
  query?: string;
}

export interface DLSDDropdownOptionsGroup<T> {
  headerTemplateRef?: TemplateRef<unknown>;
  options: DLSDDropdownOption<T>[];
}

export interface DLSDDropdownOption<T> extends DLSDOption<T> {
  selected?: boolean;
  disabled?: boolean;
  options?: DLSDDropdownOption<T>[];
}

export interface DLSDOption<T> {
  name: string;
  value: T;
}

export type DLSDCallbackOption = DLSDOption<() => void>;

export interface DLSDDropdownOverlayConfig {
  overlayRef: OverlayRef;
  intersectionObserver?: IntersectionObserver;
}
