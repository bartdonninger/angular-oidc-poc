import { Component, OnInit, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  isAuthenticated: boolean;
    userData: any;
    attrHref: any;
    isCollapsed: boolean;

    constructor(public oidcSecurityService: OidcSecurityService) {
        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.doCallbackLogicIfRequired();
            });
        }
    }

    ngOnInit() {
        this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
            this.isAuthenticated = auth;
        });

        this.oidcSecurityService.getUserData().subscribe(userData => {
            this.userData = userData;
        });
    }

    ngOnDestroy(): void {}

    login() {
        // this.oidcSecurityService.authorize((authUrl) => {
        //     // handle the authorrization URL
        //     window.open(authUrl, '_blank', 'toolbar=0,location=0,menubar=0');
        // });

        this.oidcSecurityService.authorize((authUrl) => { 
            this.attrHref = authUrl + '&from=iFrame'; 
            this.isCollapsed = false; }
            )
    }

    logout() {
        this.oidcSecurityService.logoff();
    }

    private doCallbackLogicIfRequired() {
        // Will do a callback, if the url has a code and state parameter.
        this.oidcSecurityService.authorizedCallbackWithCode(window.location.toString());
    }
}
