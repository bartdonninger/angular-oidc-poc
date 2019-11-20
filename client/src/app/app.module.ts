import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule, ConfigResult, OidcConfigService, OidcSecurityService, OpenIdConfiguration, LoggerService } from 'angular-auth-oidc-client';

const oidc_configuration = 'assets/auth.clientConfiguration.json';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load(oidc_configuration);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule.forRoot(),
  ],
  providers: [
    OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [OidcConfigService],
            multi: true,
        },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

        // Use the configResult to set the configurations

        const config: OpenIdConfiguration = {
            stsServer: configResult.customConfig.stsServer,
            redirect_url: 'http://localhost:4200',
            client_id: 'angularClient',
            scope: 'api1 openid profile email',
            response_type: 'code',
            silent_renew: true,
            silent_renew_url: 'https://localhost:4200/silent-renew.html',
            log_console_debug_active: true,
            // all other properties you want to set
        };

        this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
    });
  }
}
