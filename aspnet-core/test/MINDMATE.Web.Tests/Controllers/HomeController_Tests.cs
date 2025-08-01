﻿using System.Threading.Tasks;
using MINDMATE.Models.TokenAuth;
using MINDMATE.Web.Controllers;
using Shouldly;
using Xunit;

namespace MINDMATE.Web.Tests.Controllers
{
    public class HomeController_Tests: MINDMATEWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}