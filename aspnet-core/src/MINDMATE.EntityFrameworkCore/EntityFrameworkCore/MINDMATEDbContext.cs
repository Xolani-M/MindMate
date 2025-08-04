using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Authorization.Roles;
using MINDMATE.Authorization.Users;
using MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Moods;
using MINDMATE.Domain.Seekers;
using MINDMATE.Domain.Journals;
using MINDMATE.MultiTenancy;

namespace MINDMATE.EntityFrameworkCore
{
    public class MINDMATEDbContext : AbpZeroDbContext<Tenant, Role, User, MINDMATEDbContext>
    {
        /* Define a DbSet for each entity of the application */

        public DbSet<Seeker> Seekers { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<AssessmentResult> AssessmentResults { get; set; }
        public DbSet<MoodEntry> MoodEntries { get; set; }
        public DbSet<AssessmentAnswer> AssessmentAnswers { get; set; }





        public MINDMATEDbContext(DbContextOptions<MINDMATEDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure MoodTrendSummary as keyless
            modelBuilder.Entity<MINDMATE.Domain.Moods.MoodTrendSummary>().HasNoKey();

            // Ignore LatestMoodTrend property in Seeker
            modelBuilder.Entity<MINDMATE.Domain.Seekers.Seeker>().Ignore(x => x.LatestMoodTrend);

            modelBuilder.Entity<AssessmentResult>()
                .HasMany(r => r.Answers)
                .WithOne(a => a.AssessmentResult)
                .HasForeignKey(a => a.AssessmentResultId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
