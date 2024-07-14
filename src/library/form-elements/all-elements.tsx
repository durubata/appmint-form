import React from 'react';
import { ButtonElement } from './button-element';
import { CodeElement } from './code-element';
import { ColorElement } from './color-element';
import { CronElement } from './cron-element';
import { DateElement } from './date-element';
import { DateRangeElement } from './date-range-element';
import { FileElement } from './file-element';
import { HTMLElement } from './html-element';
import { IconPickerElement } from './icon-picker-element';
import { LabelElement } from './label-element';
import { MapElement } from './map-element';
import { MarkdownElement } from './markdown-element';
import { NumberElement } from './number-element';
import { NumberRangeElement } from './number-range-element';
import { ParagraphElement } from './paragraph-element';
import { PreviewElement } from './preview-element';
import { RichtextElement } from './richtext-element';
import { SelectManyElement } from './select-many-element';
import { SelectSingleElement } from './select-single-element';
import { TextElement } from './text-element';
import { UuidElement } from './uuid-element';
import { PhoneElement } from './phone';
import { RatingInput } from './rating';
import { RankingInput } from './ranking';
import { GeneratedElement } from './generated-element';
import { SocialLinksElement } from './social-links';
import { LegalConsentElement } from './legal-concent';
import { PreSelectElement } from './pre-select';

export * from './color-element';
export * from './code-element';
export * from './number-element';
export * from './paragraph-element';
export * from './richtext-element';
export * from './select-many-element';
export * from './select-single-element';
export * from './text-element';
export * from './file-element';
export * from './uuid-element';
export * from './date-element';
export * from './map-element';
export * from './button-element';
export * from './label-element';
export * from './cron-element';
export * from './icon-picker-element';
export * from './markdown-element';
export * from './preview-element';
export * from './html-element';
export * from './number-range-element';
export * from './phone';

export const elementToNameMap = {
    'text': TextElement,
    'number': NumberElement,
    'file': FileElement,
    'selectsingle': SelectSingleElement,
    'selectmany': SelectManyElement,
    'richtext': RichtextElement,
    'paragraph': ParagraphElement,
    'code': CodeElement,
    'date': DateElement,
    'daterange': DateRangeElement,
    'color': ColorElement,
    'uuid': UuidElement,
    'map': MapElement,
    'button': ButtonElement,
    'label': LabelElement,
    'cron': CronElement,
    'phone': PhoneElement,
    'icon': IconPickerElement,
    'markdown': MarkdownElement,
    'html': HTMLElement,
    'preview': PreviewElement,
    'numberrange': NumberRangeElement,
    'address': NumberRangeElement,
    'rating': RatingInput,
    'ranking': RankingInput,
    'generated': GeneratedElement,
    'sociallinks': SocialLinksElement,
    'legalconsent': LegalConsentElement,
    'preselect': PreSelectElement,
    'default': ({ name }) => <div>Unknown element {name}</div>,

}