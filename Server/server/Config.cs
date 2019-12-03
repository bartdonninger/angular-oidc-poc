using IdentityServer4.Models;
using System.Collections.Generic;
using System.Security.Claims;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Test;

namespace server
{
    public class Config
    {
        public static IEnumerable<ApiResource> Apis =>
            new List<ApiResource>
            {
                new ApiResource("api1", "My API")
            };

        public static List<IdentityResource> IdentityResources =>
            new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Email(),
                new IdentityResources.Profile() // <-- usefull
            };

        public static List<TestUser> GetUsers()
        {
            return new List<TestUser>
            {
                new TestUser
                {
                    SubjectId = "1",
                    Username = "alice",
                    Password = "password",

                    Claims = new []
                    {
                        new Claim("name", "Alice"),
                        new Claim("website", "https://alice.com")
                    }
                },
                new TestUser
                {
                    SubjectId = "2",
                    Username = "bob",
                    Password = "password",

                    Claims = new []
                    {
                        new Claim("name", "Bob"),
                        new Claim("website", "https://bob.com")
                    }
                }
            };
        }

        public static IEnumerable<Client> Clients =>
            new List<Client>
            {
                new Client
                {
                    ClientId = "angularClient",
                    ClientName = "Angular Client (Code with PKCE)",

                    RequireClientSecret = false,

                    // token lifetime
                    AccessTokenLifetime = 600,
                    AuthorizationCodeLifetime = 300,
                    IdentityTokenLifetime = 300,


                    // no interactive user, use the clientid/secret for authentication
                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,

                    RedirectUris =
                    {
                        "http://localhost:4200",
                        "http://localhost:4200/silent-renew.html"
                    },
                    PostLogoutRedirectUris = { "http://localhost:4200" },


                    // scopes that client has access to
                    AllowedScopes = { "api1", "openid", "profile", "email" },

                    AllowOfflineAccess = true,
                    RefreshTokenUsage = TokenUsage.ReUse,
                    RequireConsent = false
                }
            };
    }
}
