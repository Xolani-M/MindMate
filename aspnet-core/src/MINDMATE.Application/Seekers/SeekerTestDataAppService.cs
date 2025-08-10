using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using MINDMATE.Application.TestData;

namespace MINDMATE.Application.Seekers
{
    /// <summary>
    /// Test data seeding service for seeker dashboard and analytics
    /// Only for development/testing purposes
    /// </summary>
    [AbpAuthorize]
    public class SeekerTestDataAppService : ApplicationService, Abp.Dependency.ITransientDependency
    {
        private readonly SeekerDataSeeder _dataSeeder;

        public SeekerTestDataAppService(SeekerDataSeeder dataSeeder)
        {
            _dataSeeder = dataSeeder ?? throw new ArgumentNullException(nameof(dataSeeder));
        }

        /// <summary>
        /// Seeds test data for the current authenticated user
        /// Creates journal entries and mood entries for testing dashboard and analytics
        /// </summary>
        /// <returns>Success message</returns>
        public async Task<string> SeedTestDataForCurrentUserAsync()
        {
            await _dataSeeder.SeedTestDataAsync();
            return "Test data seeded successfully! Your dashboard should now show analytics data.";
        }

        /// <summary>
        /// Quick endpoint to check if test data seeding is available
        /// </summary>
        /// <returns>Status message</returns>
        public Task<string> GetTestDataStatusAsync()
        {
            return Task.FromResult("Test data seeding is available. Call SeedTestDataForCurrentUser to populate your dashboard with sample data.");
        }
    }
}
