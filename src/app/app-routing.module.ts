import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {CamerasPageComponent} from './cameras-page/cameras-page.component';
import {CipherPageComponent} from './cipher-page/cipher-page.component';
import {AuthGuard} from './shared/services/auth.guard';

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: '', component: HomePageComponent},
      {path: 'login', component: LoginPageComponent},
      {path: 'cameras', component: CamerasPageComponent, canActivate: [AuthGuard]},
    ]
  },
  {path: 'cipher', component: CipherPageComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
