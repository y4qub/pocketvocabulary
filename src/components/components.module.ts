import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { HttpLoaderFactory } from '../app/app.module';
import { PracticeInputComponent } from './practice-input/practice-input';
import { PracticeOptionsComponent } from './practice-options/practice-options';
import { PracticeSelectComponent } from './practice-select/practice-select';
import { PracticeYesNoComponent } from './practice-yes-no/practice-yes-no';
@NgModule({
    declarations: [
        PracticeSelectComponent,
        PracticeYesNoComponent,
        PracticeInputComponent,
        PracticeOptionsComponent
    ],
    imports: [CommonModule,
        IonicModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        })
    ],
    exports: [PracticeSelectComponent,
        PracticeYesNoComponent,
        PracticeInputComponent,
        PracticeOptionsComponent]
})
export class ComponentsModule { }
