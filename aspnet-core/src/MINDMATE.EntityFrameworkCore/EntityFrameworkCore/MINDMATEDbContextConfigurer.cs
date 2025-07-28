using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace MINDMATE.EntityFrameworkCore
{
    public static class MINDMATEDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<MINDMATEDbContext> builder, string connectionString)
        {
            builder.UseNpgsql(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<MINDMATEDbContext> builder, DbConnection connection)
        {
            builder.UseNpgsql(connection);
        }
    }
}
