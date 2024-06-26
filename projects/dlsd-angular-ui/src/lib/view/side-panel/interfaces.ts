import { TemplateRef, Type } from '@angular/core';

export interface DLSDSidePanelConfig {
  backdrop?: boolean;
  close?: () => void;
  component?: Type<any>;
  templateRef?: TemplateRef<any>;
}
