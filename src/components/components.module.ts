import { NgModule } from '@angular/core';
import { InputComponent } from './input/input';
import { OptionsComponent } from './options/options';
@NgModule({
	declarations: [InputComponent,
    OptionsComponent],
	imports: [],
	exports: [InputComponent,
    OptionsComponent]
})
export class ComponentsModule {}
